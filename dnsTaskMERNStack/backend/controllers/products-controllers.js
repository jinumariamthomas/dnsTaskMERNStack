const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Product = require('../models/product');
const User = require('../models/user');

const getProductById = async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a product',
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError(
      'Could not find product for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ product: product.toObject({ getters: true }) });
};

const getProductsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithProducts;
  try {
    userWithProducts = await User.findById(userId).populate('products');
  } catch (err) {
    const error = new HttpError(
      'Fetching product list failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!userWithProducts || userWithProducts.products.length === 0) {
    return next(
      new HttpError('Could not find products for the provided user id.', 404)
    );
  }

  res.json({
    products: userWithProducts.products.map(product =>
      product.toObject({ getters: true })
    )
  });
};

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('qwertyInvalid inputs passed, please check your data.', 422)
    );
  }

  console.log(req.body);
  const { name, price, quantity } = req.body;

  const createdProduct = new Product({
    name,
    price,
    quantity,
    creator: req.userData.userId
  });


  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'Fetching-User->Creating product failed, please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdProduct.save();
    user.products.push(createdProduct);
    await user.save();
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'CREATING LOCA->Creating product failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ product: createdProduct });
};

const updateProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, price } = req.body;
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update product.',
      500
    );
    return next(error);
  }

  if (product.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this product.', 401);
    return next(error);
  }

  product.name = name;
  product.price = price;

  try {
    console.log(product);
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await product.save();
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update product.',
      500
    );
    return next(error);
  }

  res.status(200).json({ product: product.toObject({ getters: true }) });
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete product.',
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError('Could not find product for this id.', 404);
    return next(error);
  }

  if (product.creator.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this product.',
      401
    );
    return next(error);
  }


  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await product.remove();
    product.creator.products.pull(product);
    await product.creator.save();
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete product.',
      500
    );
    return next(error);
  }



  res.status(200).json({ message: 'Deleted product.' });
};

exports.getProductById = getProductById;
exports.getProductsByUserId = getProductsByUserId;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
