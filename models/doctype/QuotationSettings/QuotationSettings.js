const model = require('frappejs/model');
const SalesInvoiceSettings = require('../SalesInvoiceSettings/SalesInvoiceSettings');

module.exports = model.extend(SalesInvoiceSettings, {
    'name': 'QuotationSettings',
    'label': 'Quotation Settings',
    'fields': [
        {
            'fieldname': 'numberSeries',
            'default': 'PP ' + new Date().toISOString().slice(0, 4) //'QTN'
        }
    ]
});
