const frappe = require('frappejs');
const naming = require('frappejs/model/naming');

module.exports = {
  async getPayments() {
    let payments = await frappe.db.getAll({
      doctype: 'PaymentFor',
      fields: ['parent'],
      filters: { referenceName: this.name },
      orderBy: 'name'
    });
    if (payments.length != 0) {
      return payments;
    }
    return [];
  },

  async beforeUpdate() {
    const entries = await this.getPosting();
    await entries.validateEntries();
  },

  async beforeInsert() {
    const entries = await this.getPosting();
    await entries.validateEntries();
    let ddd = await frappe.db.getAll({ doctype: 'SalesInvoice', filters: {} });
    console.log(ddd);
  },

  async afterSubmit() {
    // post ledger entries
    const entries = await this.getPosting();
    await entries.post();

    // update outstanding amounts
    await frappe.db.setValue(
      this.doctype,
      this.name,
      'outstandingAmount',
      this.baseGrandTotal
    );

    let party = await frappe.getDoc('Party', this.customer || this.supplier);
    await party.updateOutstandingAmount();
  },

  async afterRevert() {
    let paymentRefList = await this.getPayments();
    for (let paymentFor of paymentRefList) {
      const paymentReference = paymentFor.parent;
      const payment = await frappe.getDoc('Payment', paymentReference);
      const paymentEntries = await payment.getPosting();
      await paymentEntries.postReverse();
      // To set the payment status as unsubmitted.
      payment.revert();
    }
    const entries = await this.getPosting();
    await entries.postReverse();
  },

  //HELKYds 01-12-2020
  async beforeSubmit() {
    console.log('On Submit HELYD');
    console.log('To generate HASH');

    console.log(this.name);
    console.log(this.date);
    console.log(this.postingdate);
    //Depeding the Document created FT or FF or FP; gets the Series
    let seriedocumento = 'SINV-';
    if (this.name.search('FT')) {
      console.log('FT');
      seriedocumento = 'FT%';
    } else if (this.name.search('FF')) {
      seriedocumento = 'FF%';
    } else if (this.name.search('RC')) {
      seriedocumento = 'RC%';
    } else if (this.name.search('JV')) {
      seriedocumento = 'JV%';
    } else if (this.name.search('PP')) {
      seriedocumento = 'PP%';
    } else if (this.name.search('OV')) {
      seriedocumento = 'OV%';
    } else if (this.name.search('OF')) {
      seriedocumento = 'OF%';
    } else if (this.name.search('OC')) {
      seriedocumento = 'OC%';
    } else if (this.name.search('REC')) {
      seriedocumento = 'REC%';
    }

    let numeroserie = await frappe.db.getAll({
      doctype: 'NumberSeries',
      fields: ['name', 'current'],
      filters: { name: ['like', seriedocumento] }
    });
    console.log(numeroserie);
    console.log(numeroserie[0].name);
    console.log('naming');
    this.docAgt = await naming.getSeriesNext(numeroserie[0].name);

    let ultimoHash = await frappe.db.sql(
      " SELECT name, creation, docAgt, submitted, postingdate, hashAgt FROM SalesInvoice WHERE submitted = 1 and creation = (SELECT max(creation) from SalesInvoice where hashAgt <>'') "
    );
    console.log('SalesInvoice');

    console.log(ultimoHash);
    if (ultimoHash.length > 0) {
      console.log(ultimoHash[0].creation);
      console.log(ultimoHash[0].creation.slice(0, 19));

      console.log(this.grandTotal);
      console.log(
        String(this.date) +
          ';' +
          String(this.creation.slice(0, 19)) +
          ';' +
          String(this.docAgt) +
          ';' +
          String(this.grandTotal) +
          ';' +
          String(ultimoHash[0].hashAgt)
      );
    }

    let hashinfo = '';
    if (ultimoHash.length > 0) {
      //Has Records gets last HASH
      hashinfo =
        String(this.date) +
        ';' +
        String(this.creation.slice(0, 19)) +
        ';' +
        String(this.docAgt) +
        ';' +
        String(this.grandTotal) +
        ';' +
        String(ultimoHash[0].hashAgt);
    } else {
      //First Record
      hashinfo =
        String(this.date) +
        ';' +
        String(this.postingdate) +
        ';' +
        String(this.docAgt) +
        ';' +
        String(this.grandTotal) +
        ';';
    }
    const jsrasign = require('jsrsasign');
    const fs = require('fs');

    let key = '';
    if (fs.existsSync('/tmp/pk/angolaerp-selfsigned-priv.pem', 'utf-8')) {
      key = fs.readFileSync('/tmp/pk/angolaerp-selfsigned-priv.pem', 'utf-8');
    } else if (
      fs.existsSync('c://temp//pk//angolaerp-selfsigned-priv.pem', 'utf-8')
    ) {
      key = fs.readFileSync(
        'c://temp//pk//angolaerp-selfsigned-priv.pem',
        'utf-8'
      );
    }
    let sig = new jsrasign.KJUR.crypto.Signature({ alg: 'SHA1withRSA' });
    sig.init(key);
    sig.updateString(hashinfo);
    const sigValueHex = sig.sign();
    console.log(sigValueHex);
    console.log(jsrasign.hextob64(sigValueHex));
    this.hashAgt = jsrasign.hextob64(sigValueHex);
    this.hashAgtControl = 1; //TODO: Check
  }
};
