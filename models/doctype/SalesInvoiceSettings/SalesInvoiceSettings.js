let fact = 'FT ' + new Date().toISOString().slice(0, 4); // + '/';
console.log('fact ',fact);

module.exports = {
  name: 'SalesInvoiceSettings',
  label: 'SalesInvoice Settings',
  doctype: 'DocType',
  isSingle: 1,
  isChild: 0,
  keywordFields: [],
  fields: [
    {
      fieldname: 'numberSeries',
      label: 'Number Series',
      fieldtype: 'Link',
      target: 'NumberSeries',
      required: 1,
      default: fact //'FT ' + new Date().toISOString().slice(0, 4) + '/' //'SINV'
    },
    {
      fieldname: 'template',
      label: 'Template',
      fieldtype: 'Select',
      options: ['Basic I', 'Basic II', 'Modern'],
      required: 1,
      default: 'Basic I'
    },
    {
      fieldname: 'font',
      label: 'Font',
      fieldtype: 'Select',
      options: ['Montserrat', 'Open Sans', 'Oxygen', 'Merriweather'],
      required: 1,
      default: 'Montserrat'
    },
    {
      fieldname: 'themeColor',
      label: 'Theme Color',
      fieldtype: 'Data',
      required: 1,
      default: '#000000',
      hidden: 1
    }
  ]
};
