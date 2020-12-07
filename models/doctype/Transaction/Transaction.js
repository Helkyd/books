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
        if (doc.submitted === 1 && doc.outstandingAmount === 0.0) {
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
        condition: doc => doc.submitted < 2 && doc.outstandingAmount > 0, //HELKYds 06-12-2020
        action: async function makePayment(doc) {
          let payment = await frappe.getNewDoc('Payment');
          payment.once('afterInsert', async () => {
            await payment.submit();
          });
          let isSales = doctype === 'SalesInvoice';
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
        action(doc) {
          console.log('Vair Cancelar....');
          doc.submitted = 2;
          doc.update();
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
