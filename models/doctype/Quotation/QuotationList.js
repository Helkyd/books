import { _ } from 'frappejs/utils';
import { getStatusColumn } from '../Transaction/Transaction';

export default {
  doctype: 'Quotation',
  title: _('Quotation'),
  formRoute: name => `/edit/Quotation/${name}`,
  columns: [
    'customer',
    'name',
    getStatusColumn('Quotation'),
    'date',
    'grandTotal'
  ]
};
