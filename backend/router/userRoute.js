const express = require('express');
const { registerUser, getAllUser, loginUser, logoutUser, forgetPassword, resetPassword, updatePassword, updateProfile, profile, updateUser, deleteUser, getUser } = require('../controller/userController');
const {isAuthenticated, authorizeRole} = require('../middleware/auth')
const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)
router.route("/alluser").get(isAuthenticated,authorizeRole("admin"),getAllUser)
router.route('/forget-password').post(forgetPassword)
router.route('/reset-password/:token').put(resetPassword)
router.route('/update-password').put(isAuthenticated,updatePassword);
router.route('/update-profile').put(isAuthenticated,updateProfile);
router.route('/profile').get(isAuthenticated,profile);
router.route('/user/:id').get(isAuthenticated,authorizeRole("admin"),getUser).put(isAuthenticated,authorizeRole("admin"),updateUser).delete(isAuthenticated,authorizeRole("admin"),deleteUser);
module.exports = router;