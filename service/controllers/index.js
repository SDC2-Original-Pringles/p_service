const model = require('../models');

module.exports = {
  getProducts(req, res) {
    const { page, count } = req.query;
    if (!+page || !+count) return res.sendStatus(400);
    return model.readProductList(page, count)
      .then((results) => res.send(results))
      .catch((err) => console.error(err));
  },

  getProductById(req, res) {
    const { product_id } = req.params;
    if (!+product_id) return res.sendStatus(400);
    return model.readProductById(product_id)
      .then((results) => res.send(results))
      .catch((err) => console.error(err));
  },
};
