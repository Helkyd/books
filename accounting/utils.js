const { __ } = require('../src/translate'); //HELKYDS 30-03-2021

module.exports = {
  ledgerLink: {
    label: __('Ledger Entries'),
    condition: doc => doc.submitted,
    action: (doc, router) => {
      router.push({
        name: 'Report',
        params: {
          reportName: 'general-ledger',
          defaultFilters: {
            referenceType: doc.doctype,
            referenceName: doc.name
          }
        }
      });
    }
  }
};
