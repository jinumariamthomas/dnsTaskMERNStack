const express = require('express');
const { check } = require('express-validator');

const productsControllers = require('../controllers/products-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:pid', productsControllers.getProductById);

router.get('/user/:uid', productsControllers.getProductsByUserId);

router.use(checkAuth);

router.post(
  '/',
  [
    check('name')
      .not()
      .isEmpty(),
    check('price').not().isEmpty(),
    check('quantity')
      .not()
      .isEmpty()
  ],
  productsControllers.createProduct
);

  //fileUpload.single('image'),


router.patch(
  '/:pid',
  [
    check('name')
      .not()
      .isEmpty(),
    check('price').not()
    .isEmpty()
  ],
  productsControllers.updateProduct
);

router.delete('/:pid', productsControllers.deleteProduct);

module.exports = router;
