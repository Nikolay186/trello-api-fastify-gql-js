const Knex = require('knex');
const { Model } = require('objection');

async function setup() {
  const cfg = await import('../../knexfile.cjs')
  const instance = Knex(cfg.default);
  Model.knex(instance);
}

module.exports = setup()
