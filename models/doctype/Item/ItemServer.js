//const Item = require('./Item');

const BaseDocument = require('frappejs/model/document');

module.exports = class ItemServer extends BaseDocument {
  async validate() {
    console.log('Validar');
  }
  async beforeInsert() {
    console.log('Ante de Insert');
  }
};
