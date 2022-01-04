const appService = require('../services/appService');

const error = new Error();
error.status = 'NOT_FOUND';
error.message = null;

const appController = {
    
    /**
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
     test: async (req, res) => {
        res.status(200).send('milly working');
    },

    /**
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
     createOrder: async (req, res) => {
        try {
            let createOrder = await appService.createOrder(req, res);
            return helper.apiResponse(res, false, "Order created successfully", createOrder);
        }
        catch (error) {
            const statusCode = error.status || "INTERNAL_SERVER_ERROR";
            return helper.apiResponse(res, true, error.message, null, statusCode);
        }
    },

    /**
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
     tagCustomers: async (req, res) => {
        try {
            let tagCustomers = await appService.tagCustomers(req, res);
            return helper.apiResponse(res, false, "Order fetch successfully", tagCustomers);
        }
        catch (error) {
            const statusCode = error.status || "INTERNAL_SERVER_ERROR";
            return helper.apiResponse(res, true, error.message, null, statusCode);
        }
    },

    /**
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
     updateCustomer: async (req, res) => {
        try {
            let customers = await appService.customers(req, res);
            return helper.apiResponse(res, false, "Customers tagged successfully", customers);
        }
        catch (error) {
            const statusCode = error.status || "INTERNAL_SERVER_ERROR";
            return helper.apiResponse(res, true, error.message, null, statusCode);
        }
    },

    /**
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
     saveCart: async (req, res) => {
        res.status(200).send('ok');
        try {
            let saveCart = await appService.saveCart(req);
            console.log(saveCart)
        }
        catch (error) {
            console.log(error)
        }
    },
}

module.exports = appController;