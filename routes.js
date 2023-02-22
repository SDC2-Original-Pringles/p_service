const router = require('express').Router();
const controllers = require('./controllers');

router.get('/products', controllers.getProducts);
router.get('/products/:product_id', controllers.getProductById);
router.get('/products/:product_id/styles', controllers.getStylesByPid);
router.get('/products/:product_id/related', controllers.getRelatedProducts);

module.exports = router;
