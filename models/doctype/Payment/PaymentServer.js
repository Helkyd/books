const BaseDocument = require('frappejs/model/document');
const frappe = require('frappejs');
const LedgerPosting = require('../../../accounting/ledgerPosting');
const naming = require('frappejs/model/naming');

//HELKYds 30-11-2020; Changed For to payfor
module.exports = class PaymentServer extends BaseDocument {
  async change({ changed }) {
    if (changed === 'payfor') {
      this.amount = 0;
      for (let paymentReference of this.payfor) {
        this.amount += paymentReference.amount;
      }
      console.log(this.account);
      console.log(this.paymentAccount);
      //Check account
      if (this.paymentMethod == 'Cash') {
        //Default account 4511
        let ddd = await frappe.db.getAll({
          doctype: 'Account',
          fields: ['*'],
          filters: { account_number: ['like', '4511%'] }
        });
        /*
        const salesInvoices = frappe.db.getAll({
          doctype: 'SalesInvoice',
          filters,
          fields: ['*']
        });
        */
        console.log('Conta ', ddd);
      }
    }
  }

  async getPosting() {
    let entries = new LedgerPosting({ reference: this, party: this.party });
    await entries.debit(this.paymentAccount, this.amount);
    for (let row of this.payfor) {
      await entries.credit(this.account, row.amount);
    }
    return entries;
  }

  async beforeSubmit() {
    if (!this.payfor.length) {
      throw new Error(`No reference for the payment.`);
    }
    for (let row of this.payfor) {
      if (!['SalesInvoice', 'PurchaseInvoice'].includes(row.referenceType)) {
        continue;
      }
      let referenceDoc = await frappe.getDoc(
        row.referenceType,
        row.referenceName
      );
      let { outstandingAmount, baseGrandTotal } = referenceDoc;
      if (outstandingAmount == null) {
        outstandingAmount = baseGrandTotal;
      }
      if (this.amount <= 0 || this.amount > outstandingAmount) {
        throw new Error(
          `Payment amount (${this.amount}) should be greater than 0 and less than Outstanding amount (${outstandingAmount})`
        );
      } else {
        // update outstanding amounts in invoice and party
        let newOutstanding = outstandingAmount - this.amount;
        await referenceDoc.set('outstandingAmount', newOutstanding);
        await referenceDoc.update();
        let party = await frappe.getDoc('Party', this.party);
        await party.updateOutstandingAmount();
        //docAGT

        let seriedocumento = 'RC-';
        if (this.name.search('RC') != -1) {
          seriedocumento = 'RC%';
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
      }
    }
  }

  async afterSubmit() {
    const entries = await this.getPosting();
    await entries.post();
  }

  async afterRevert() {
    const entries = await this.getPosting();
    await entries.postReverse();

    // Maybe revert outstanding amount of invoice too?
  }
};
