import frappe from 'frappejs';
import { openSettings } from '@/utils';
import { _ } from 'frappejs/utils';
import Icon from './components/Icon';
import router from './router';
import { __ } from './translate'; //HELKYDS 30-03-2021
//const __ = require('./translate'); //HELKYDS 30-03-2021

const config = {
  getTitle: async () => {
    const { companyName } = await frappe.getSingle('AccountingSettings');
    return companyName;
  },
  groups: [
    {
      title: __('Get Started'),
      route: '/get-started',
      icon: getIcon('general', '24', '5')
    },
    {
      title: __('Dashboard'),
      route: '/',
      icon: getIcon('dashboard')
    },
    {
      title: __('Sales'),
      icon: getIcon('sales'),
      action() {
        router.push('/list/SalesInvoice');
      },
      items: [
        {
          label: __('Quotations'),
          route: '/list/Quotation',
          doctype: 'Quotation'
        },

        {
          label: __('Invoices'),
          route: '/list/SalesInvoice',
          doctype: 'SalesInvoice'
        },
        {
          label: __('Customers'),
          route: '/list/Customer',
          doctype: 'Customer'
        },
        {
          label: __('Items'),
          route: '/list/Item',
          doctype: 'Item'
        },
        {
          label: __('Payments'),
          route: '/list/Payment',
          doctype: 'Payment'
        },
        {
          label: __('Journal Entry'),
          route: '/list/JournalEntry',
          doctype: 'JournalEntry'
        }
      ]
    },
    {
      title: __('Purchases'),
      icon: getIcon('purchase'),
      action() {
        router.push('/list/PurchaseInvoice');
      },
      items: [
        {
          label: __('Bills'),
          route: '/list/PurchaseInvoice',
          doctype: 'PurchaseInvoice'
        },
        {
          label: __('Suppliers'),
          route: '/list/Supplier',
          doctype: 'Supplier'
        },
        {
          label: __('Items'),
          route: '/list/Item',
          doctype: 'Item'
        },
        {
          label: __('Payments'),
          route: '/list/Payment',
          doctype: 'Payment'
        },
        {
          label: __('Journal Entry'),
          route: '/list/JournalEntry',
          doctype: 'JournalEntry'
        }
      ]
    },
    {
      title: __('Reports'),
      icon: getIcon('reports'),
      action() {
        router.push('/report/general-ledger');
      },
      items: [
        {
          label: __('General Ledger'),
          route: '/report/general-ledger'
        },
        {
          label: __('Profit And Loss'),
          route: '/report/profit-and-loss'
        },
        {
          label: __('Balance Sheet'),
          route: '/report/balance-sheet'
        },
        {
          label: __('Trial Balance'),
          route: '/report/trial-balance'
        }
      ]
    },
    {
      title: __('Setup'),
      icon: getIcon('settings'),
      items: [
        {
          label: __('Chart of Accounts'),
          route: '/chart-of-accounts'
        },
        {
          label: __('Taxes'),
          route: '/list/Tax',
          doctype: 'Tax'
        },
        {
          label: __('Settings'),
          action() {
            openSettings();
          }
        }
      ]
    }
  ]
};

function getIcon(name, size = '18', height = null) {
  return {
    name,
    render(h) {
      return h(Icon, {
        props: Object.assign(
          {
            name,
            size,
            height
          },
          this.$attrs
        )
      });
    }
  };
}

export default config;
