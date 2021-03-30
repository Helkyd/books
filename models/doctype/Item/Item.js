const frappe = require('frappejs');
//const { _ } = require('frappejs/utils');
const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

module.exports = {
  name: 'Item',
  doctype: 'DocType',
  isSingle: 0,
  keywordFields: ['name', 'description'],
  fields: [
    {
      fieldname: 'name',
      label: __('Item Name'),
      fieldtype: 'Data',
      placeholder: 'Item Name',
      required: 1
    },
    {
      fieldname: 'image',
      label: __('Image'),
      fieldtype: 'AttachImage'
    },
    {
      fieldname: 'description',
      label: __('Description'),
      placeholder: 'Item Description',
      fieldtype: 'Text'
    },
    {
      fieldname: 'unit',
      label: __('Unit Type'),
      fieldtype: 'Select',
      default: 'Unit',
      options: ['Unit', 'Kg', 'Gram', 'Hour', 'Day']
    },
    {
      fieldname: 'itemType',
      label: __('Type'),
      placeholder: 'Sales',
      fieldtype: 'Select',
      default: 'Product',
      options: ['Product', 'Service']
    },
    {
      fieldname: 'incomeAccount',
      label: __('Income'),
      fieldtype: 'Link',
      target: 'Account',
      placeholder: 'Sales',
      required: 1,
      disableCreation: true,
      getFilters: () => {
        return {
          isGroup: 0,
          accountType: 'Income Account'
        };
      },
      formulaDependsOn: ['itemType'],
      formula(doc) {
        if (frappe.AccountingSettings.currency === 'KZ') {
          if (doc.itemType === 'Product') {
            return '61110000 - Vendas'; //'Sales';
          }
          if (doc.itemType === 'Service') {
            return '62110000 - Servicos Principais'; //'Service';
          }
        } else {
          if (doc.itemType === 'Product') {
            return 'Sales';
          }
          if (doc.itemType === 'Service') {
            return 'Service';
          }
        }
      }
    },
    {
      fieldname: 'expenseAccount',
      label: __('Expense'),
      fieldtype: 'Link',
      target: 'Account',
      placeholder: 'Select Account',
      required: 1,
      disableCreation: true,
      getFilters: () => {
        return {
          isGroup: 0,
          accountType: ['in', ['Cost of Goods Sold', 'Expense Account']]
        };
      },
      formulaDependsOn: ['itemType'],
      //HELKYDs 30-11-2020; If Angola CoA
      formula(doc) {
        if (frappe.AccountingSettings.currency === 'KZ') {
          if (doc.itemType === 'Product') {
            return '71110000 - Custo das Existencias Vendidas e Consumidas'; //'Sales';
          }
          if (doc.itemType === 'Service') {
            //return '71110000 - Custo das Existencias Vendidas e Consumidas'; //'Sales';
            return '75239000 - Outros Servicos'; //'Service';
          }
        } else {
          return 'Cost of Goods Sold';
        }
      }
    },
    {
      fieldname: 'tax',
      label: __('Tax'),
      fieldtype: 'Link',
      target: 'Tax',
      placeholder: 'GST'
    },
    {
      fieldname: 'rate',
      label: __('Rate'),
      fieldtype: 'Currency',
      placeholder: '0.00',
      validate(value) {
        if (!value) {
          throw new frappe.errors.ValidationError(
            'Rate must be greater than 0'
          );
        }
      }
    }
  ],
  quickEditFields: ['rate', 'unit', 'itemType', 'tax', 'description'],
  actions: [
    {
      label: __('New Invoice'),
      condition: doc => !doc.isNew(),
      action: async (doc, router) => {
        const invoice = await frappe.getNewDoc('SalesInvoice');
        invoice.append('items', {
          item: doc.name,
          rate: doc.rate,
          tax: doc.tax
        });
        router.push(`/edit/SalesInvoice/${invoice.name}`);
      }
    },
    {
      label: __('New Bill'),
      condition: doc => !doc.isNew(),
      action: async (doc, router) => {
        const invoice = await frappe.getNewDoc('PurchaseInvoice');
        invoice.append('items', {
          item: doc.name,
          rate: doc.rate,
          tax: doc.tax
        });
        router.push(`/edit/PurchaseInvoice/${invoice.name}`);
      }
    }
  ]
};
