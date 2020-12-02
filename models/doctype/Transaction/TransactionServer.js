const frappe = require('frappejs');

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

    console.log(this.date);
    console.log(this.postingdate);
    //Depeding the Document created FT or FF or FP; gets the Series
    console.log(
      await frappe.db.getAll({
        doctype: 'NumberSeries',
        fields: ['name', 'current']
      })
    );

    console.log(this.grandTotal);

    const hashinfo = String(this.date) + ';' + String(this.postingdate) + ';' + String('FT') + ';' + String(this.grandTotal) + ';'

    const jsrasign = require('jsrsasign');
    const fs = require('fs');

    let key = fs.readFileSync('/tmp/pk/angolaerp-selfsigned-priv.pem','utf-8');
    let sig = new jsrasign.KJUR.crypto.Signature({"alg":"SHA1withRSA"});
    sig.init(key);
    sig.updateString(hashinfo);
    const sigValueHex = sig.sign();
    console.log(sigValueHex);
    console.log(jsrasign.hextob64(sigValueHex));
  }

};
