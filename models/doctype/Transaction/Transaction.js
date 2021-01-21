const frappe = require('frappejs');
const utils = require('../../../accounting/utils');
const { openQuickEdit } = require('@/utils');
const Badge = require('@/components/Badge').default;

module.exports = {
  getStatusColumn() {
    console.log('transiction');
    return {
      label: 'Status',
      fieldname: 'status',
      fieldtype: 'Select',
      render(doc) {
        let status = 'Unpaid';
        let color = 'orange';
        if (!doc.submitted) {
          status = 'Draft';
          color = 'gray';
        }
        if (doc.submitted === 1 && doc.name.includes('INT-PP')) {
          status = 'Ordered';
          color = 'green';
        } else if (doc.submitted === 1 && doc.outstandingAmount === 0.0) {
          status = 'Paid';
          color = 'green';
        }
        if (doc.submitted === 2) {
          status = 'Canceled';
          color = 'red';
        }

        return {
          template: `<Badge class="text-xs" color="${color}">${status}</Badge>`,
          components: { Badge }
        };
      }
    };
  },
  getActions(doctype) {
    return [
      {
        label: 'Make Payment',
        condition: doc =>
          doc.submitted < 2 &&
          doc.outstandingAmount > 0 &&
          doc.doctype != 'Quotation', //HELKYds 06-12-2020
        action: async function makePayment(doc) {
          let payment = await frappe.getNewDoc('Payment');
          payment.once('afterInsert', async () => {
            await payment.submit();
          });
          let isSales = doctype === 'SalesInvoice';
          //let isSales = doctype ? 'Quotation' : 'SalesInvoice';
          let party = isSales ? doc.customer : doc.supplier;
          let paymentType = isSales ? 'Receive' : 'Pay';
          let hideAccountField = isSales ? 'account' : 'paymentAccount';
          openQuickEdit({
            doctype: 'Payment',
            name: payment.name,
            hideFields: [
              'party',
              'date',
              hideAccountField,
              'paymentType',
              'for'
            ],
            defaults: {
              party,
              [hideAccountField]: doc.account,
              date: new Date().toISOString().slice(0, 10),
              paymentType,
              for: [
                {
                  referenceType: doc.doctype,
                  referenceName: doc.name,
                  amount: doc.outstandingAmount
                }
              ]
            }
          });
        }
      },
      //HELKYDS 06-12-2020; Cannot be done on Angola after document Submitted; Need to implement Credit Note instead
      /*
      {
        label: 'Revert',
        condition: doc =>
          doc.submitted && doc.baseGrandTotal === doc.outstandingAmount,
        action(doc) {
          doc.revert();
        }
      },
      */
      {
        label: 'Cancel',
        condition: doc => doc.submitted === 1,
        //action(async doc) {
        action: async function(doc) {
          console.log('Vair Cancelar....');
          console.log('doctype ', doc.doctype);
          console.log('nome ', doc.name);
          if (doc.doctype === 'Payment') {
            //Unpaid Invoice; after cancel Payment
            console.log('pagamento');
            let pagamento = await frappe.db.getAll({
              doctype: 'PaymentFor',
              fields: ['referenceType', 'referenceName'],
              filters: { parent: doc.name },
              orderBy: 'name'
            });
            console.log(pagamento[0]);
            // update status to Unpaid
            await frappe.db.setValue(
              pagamento[0].referenceType,
              pagamento[0].referenceName,
              'outstandingAmount',
              doc.amount
            );
            // Cancel o Ledger
            console.log('Apagar ', doc.name);
            let ledgerdoc = await frappe.db.getAll({
              doctype: 'AccountingLedgerEntry',
              fields: ['*'],
              filters: { referenceName: doc.name }
            });
            console.log('ledgerdoc ', ledgerdoc);

            for (let apagar in ledgerdoc) {
              console.log('apagar ', ledgerdoc[apagar].name);
              await frappe.db.delete(
                'AccountingLedgerEntry',
                ledgerdoc[apagar].name
              );
            }

            doc.submitted = 2;
            doc.update();
          } else if (
            doc.doctype === 'SalesInvoice' ||
            doc.doctype === 'PurchaseInvoice'
          ) {
            //Paid Invoice; Cancel Payments
            console.log('Cancelar Pagamentos Facturas');
            console.log(doc.name);
            let pagamento = await frappe.db.getAll({
              doctype: 'PaymentFor',
              fields: ['parent'],
              filters: { referenceName: doc.name },
              orderBy: 'name'
            });
            console.log(pagamento[0]);
            // update status to cancelled
            await frappe.db.setValue(
              'Payment',
              pagamento[0].parent,
              'submitted',
              2
            );
            // Cancel o Ledger Payment
            console.log('Apagar ', doc.name);
            let ledgerpay = await frappe.db.getAll({
              doctype: 'AccountingLedgerEntry',
              fields: ['*'],
              filters: { referenceName: pagamento[0].parent }
            });
            console.log('ledgerdoc ', ledgerpay);

            for (let apagar in ledgerpay) {
              console.log('apagar ', ledgerpay[apagar].name);
              await frappe.db.delete(
                'AccountingLedgerEntry',
                ledgerpay[apagar].name
              );
            }

            // Cancel o Ledger Sales/Purchase
            console.log('Apagar ', doc.name);
            let ledgerdoc = await frappe.db.getAll({
              doctype: 'AccountingLedgerEntry',
              fields: ['*'],
              filters: { referenceName: doc.name }
            });
            console.log('ledgerdoc ', ledgerdoc);

            for (let apagar in ledgerdoc) {
              console.log('apagar ', ledgerdoc[apagar].name);
              await frappe.db.delete(
                'AccountingLedgerEntry',
                ledgerdoc[apagar].name
              );
            }

            doc.submitted = 2;
            doc.update();
          } else {
            //Quotations
            doc.submitted = 2;
            doc.update();
          }
        }
      },

      {
        label: 'Print',
        condition: doc => doc.submitted,
        action(doc, router) {
          router.push(`/print/${doc.doctype}/${doc.name}`);
        }
      },
      utils.ledgerLink
    ];
  }
};
