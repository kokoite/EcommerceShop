const express = require('express');
const { getAllProduct, createProduct, updateProduct, deleteProduct, getProductDetail, createReview, getAllReview, deleteReview, getProductBasedOnCategory } = require('../controller/prodController');
const { isAuthenticated, authorizeRole } = require('../middleware/auth');
const router = express.Router();
router.route("/products").get(getAllProduct);
router.route("/product/new").post(isAuthenticated,authorizeRole("admin"),createProduct)
router.route("/product/:id").put(isAuthenticated,authorizeRole("admin"),updateProduct).delete(isAuthenticated,authorizeRole("admin"),deleteProduct).get(getProductDetail)
router.route('/product/:id/review').put(isAuthenticated,createReview);
router.route('/products/allreview').get(getAllReview);
router.route('/product/admin/deleteReview').delete(isAuthenticated,authorizeRole("admin"),deleteReview);
router.route('/products/category').get(getProductBasedOnCategory);
module.exports = router;