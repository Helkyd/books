const model = require('frappejs/model');
const QuotationSettings = require('../QuotationSettings/QuotationSettings');

module.exports = model.extend(QuotationSettings, {
    'name': 'FulfillmentSettings',
    'label': 'Fulfillment Settings',
    'fields': [
        {
            'fieldname': 'numberSeries',
            'default': 'OF ' + new Date().toISOString().slice(0, 4) //'OF'
        }
    ]
});
