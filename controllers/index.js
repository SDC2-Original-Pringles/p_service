const model = require('../models');

module.exports = {
  getProducts(req, res) {
    const { page, count } = req.query;
    if (!+page || !+count) return res.sendStatus(400);
    return model
      .readProductList(page, count)
      .then((results) => res.send(results))
      .catch((err) => res.status(400).send(err));
  },

  getProductById(req, res) {
    const { product_id } = req.params;
    if (!+product_id) return res.sendStatus(400);
    return model
      .readProductByIdNew(product_id)
      .then((results) => res.send(results))
      .catch((err) => res.status(400).send(err));
  },

  getStylesByPid(req, res) {
    const { product_id } = req.params;
    if (!+product_id) return res.sendStatus(400);
    return model
      .readStylesByPid(product_id)
      .then((results) => res.send({ product_id, results }))
      .catch((err) => res.status(400).send(err));
  },

  getRelatedProducts(req, res) {
    const { product_id } = req.params;
    if (!+product_id) return res.sendStatus(400);
    return model
      .readRelatedProducts(product_id)
      .then((results) => res.send(results))
      .catch((err) => res.status(400).send(err));
  },
};
