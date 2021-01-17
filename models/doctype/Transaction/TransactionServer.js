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
    //replace - for / in Series
    console.log(this.name);
    console.log('Series replace');
    console.log(
      this.name
        .substr(
          this.name.search(new Date().toISOString().slice(0, 4)),
          this.name.length
        )
        .search('-')
    );
    //if (this.name.substr(this.name.search(new Date().toISOString().slice(0, 4)),this.name.length).search('-') != -1) {
    //  this.name.replace(this.name.substr(this.name.search(new Date().toISOString().slice(0, 4)),this.name.length),this.name.substr(this.name.search(new Date().toISOString().slice(0, 4)),this.name.length).replace('-','/'));
    //}
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
    if (this.name.search('FT') != -1) {
      console.log('FT');
      seriedocumento = 'FT%';
    } else if (this.name.search('FF') != -1) {
      seriedocumento = 'FF%';
    } else if (this.name.search('RC') != -1) {
      seriedocumento = 'RC%';
    } else if (this.name.search('JV') != -1) {
      seriedocumento = 'JV%';
    } else if (this.name.search('PP') != -1) {
      seriedocumento = 'PP%';
    } else if (this.name.search('OV') != -1) {
      seriedocumento = 'OV%';
    } else if (this.name.search('OF') != -1) {
      seriedocumento = 'OF%';
    } else if (this.name.search('OC') != -1) {
      seriedocumento = 'OC%';
    } else if (this.name.search('REC') != -1) {
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
    console.log('naming ', this.docAgt);
    console.log('Series replace');
    console.log(
      this.docAgt
        .substr(
          this.docAgt.search(new Date().toISOString().slice(0, 4)),
          this.docAgt.length
        )
        .search('-')
    );
    if (
      this.docAgt
        .substr(
          this.docAgt.search(new Date().toISOString().slice(0, 4)),
          this.docAgt.length
        )
        .search('-') != -1
    ) {
      let novodocAGT = this.docAgt.replace(
        this.docAgt.substr(
          this.docAgt.search(new Date().toISOString().slice(0, 4)),
          this.docAgt.length
        ),
        this.docAgt
          .substr(
            this.docAgt.search(new Date().toISOString().slice(0, 4)),
            this.docAgt.length
          )
          .replace('-', '/')
      );
      console.log('aqui ', novodocAGT);
      this.docAgt = novodocAGT;
      console.log(this.docAgt);
    }

    //Check if SalesInvoice or PurchaseInvoice
    let ultimoHash = '';
    if (this.doctype == 'SalesInvoice') {
      ultimoHash = await frappe.db.sql(
        " SELECT name, creation, docAgt, submitted, postingdate, hashAgt FROM SalesInvoice WHERE submitted = 1 and creation = (SELECT max(creation) from SalesInvoice where hashAgt <>'') "
      );
    } else if (this.doctype == 'PurchaseInvoice') {
      ultimoHash = await frappe.db.sql(
        " SELECT name, creation, docAgt, submitted, postingdate, hashAgt FROM PurchaseInvoice WHERE submitted = 1 and creation = (SELECT max(creation) from PurchaseInvoice where hashAgt <>'') "
      );
    }
    console.log('SalesInvoice/PurchaseInvoice ', this.doctype);
    console.log('ultimoHash');
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

    //TODO:Still need to think where to keep this as a file...
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
