const express = require('express');
const router = express.Router();

const appController = require('../controllers/appController');
const authService = require('../services/authService');

router.route('/createOrder')
    .post(authService.authenticate, appController.createOrder);

router.route('/test')
    .get(appController.test);

router.route('/tag/customers')
    .get(appController.tagCustomers);

router.route('/tag/updateCustomer')
    .post(appController.updateCustomer);

router.route('/webhook/saveCart')
    .post(appController.saveCart);

module.exports = {
    router: router,
    basePath: 'milly'
};