import { _ } from 'frappejs/utils';
import Badge from '@/components/Badge';

const { __ } = require('../../../src/translate'); //HELKYDS 30-03-2021

export default {
  doctype: 'Payment',
  title: _('Payments'),
  columns: [
    'party',
    {
      label: 'Status',
      fieldname: 'status',
      fieldtype: 'Select',
      size: 'small',
      render(doc) {
        let status = 'Draft';
        let color = 'gray';
        if (!doc.submitted) {
          status = __('Draft');
          color = 'gray';
        }

        if (
          doc.submitted === 1 &&
          (doc.clearanceDate !== null || doc.paymentMethod === 'Cash')
        ) {
          color = 'green';
          status = __('Submitted');
        } else if (doc.submitted === 2) {
          color = 'red';
          status = __('Canceled');
        }

        return {
          template: `<Badge class="text-xs" color="${color}">${status}</Badge>`,
          components: { Badge }
        };
      }
    },
    'paymentType',
    'date',
    'amount'
  ]
};
