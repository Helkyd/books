const frappe = require('frappejs');
const { _ } = require('frappejs/utils');
const router = require('@/router').default;
const PartyWidget = require('./PartyWidget.vue').default;

const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = {
  name: 'Customer',
  label: __('Customer'),
  basedOn: 'Party',
  filters: {
    customer: 1
  },
  actions: [
    {
      label: __('Create Invoice'),
      condition: doc => !doc.isNew(),
      action: async customer => {
        let doc = await frappe.getNewDoc('SalesInvoice');
        router.push({
          path: `/edit/SalesInvoice/${doc.name}`,
          query: {
            doctype: 'SalesInvoice',
            values: {
              customer: customer.name
            }
          }
        });
      }
    },
    {
      label: __('View Invoices'),
      condition: doc => !doc.isNew(),
      action: customer => {
        router.push({
          name: 'ListView',
          params: {
            doctype: 'SalesInvoice',
            filters: {
              customer: customer.name
            }
          }
        });
      }
    }
  ],
  quickEditWidget: doc => ({
    render(h) {
      return h(PartyWidget, {
        props: { doc }
      });
    }
  })
};
