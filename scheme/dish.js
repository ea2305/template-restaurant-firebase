/**
 * Dish Scheme
 * Main definition
 */

const moment = require('moment')

module.exports = {
  name: 'Platillo sin nombre',
  description: 'Sin descripción',
  created_at: moment().format('YYYY-MM-DD'),
  price: 20,
  coin: 'MXN',
  image: 'http://lorempixel.com/400/200/food/1',
  path: null
}
