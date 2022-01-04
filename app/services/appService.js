const fetch = require('node-fetch');
const { authenticate } = require('../controllers/appController');
const crypto = require('crypto');
const { productUsed } = require('../../../compliance-project/shopify-service/internalServices/compliancePublicApi');
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const store_url = process.env.STORE_URL;

const appService = {

    /**
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
     createOrder: async (req, res) => {
         //console.log(JSON.stringify(req.body));
        let _URL = `https://${apiKey}:${apiSecret}@${store_url}/admin/api/2021-10/orders.json`;
        return await ((await fetch(_URL, {
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json'
            }
        })).json());
    },

    tagCustomers: async (req, res) => {
        let response = [];
        //let orders = [400096003,400096007,400096010,400096013,400096014,400096020,400096022,400096023,400096026,400096029,400096036,400096037,400096038,400096041,400096055,400096060,400096063,400096077,400096079,400096080,400096082,400096086,400096091,400096096,400096099,400096100,400096101,400096106,400096107,400096108,400096110,400096114,400096115,400096118,400096120,400096122,400096135,400096137,400096138,400096150,400096153,400096154,400096158,400096167,400096168,400096170,400096172,400096173,400096175];
        let orders = [400096003];
        for(let j=0; j<orders.length; j++) {
            console.log(orders[j]);
            let getOrder = await appService.getOrder(orders[j]);
            let tags = getOrder.orders[0].customer.tags+', March 2021 DM, S21 DM - BUYER';
            let updateCustomer = await appService.updateCustomer(getOrder.orders[0].customer.id, tags);
            response.push({
                'id': getOrder.orders[0].id,
                'name': getOrder.orders[0].name,
                'customer_id': updateCustomer.customer.id,
                'tags': updateCustomer.customer.tags
            });
        }

        return response;
    },

    customers: async (req, res) => {
        let customers = req.body;
        let response = [];
        for(let j=0; j<customers.length; j++) {
            console.log(customers[j].customer_id);
            let updateCustomer = await appService.updateCustomer(customers[j].customer_id, customers[j].tags);
            response.push({
                'customer_id': updateCustomer.customer.id,
                'tags': updateCustomer.customer.tags
            });
        }

        return response;
    },

    /**
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
     getOrder: async (number) => {
       let _URL = `https://${apiKey}:${apiSecret}@${store_url}/admin/api/2021-10/orders.json?name=${number}&status=any&fields=id,name,customer`;
       return await ((await fetch(_URL, {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json'
           }
       })).json());
   },

   /**
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    updateCustomer: async (customer_id, tags) => {
        let data = {
            "customer": {
                "tags": tags
            }
        }
        let _URL = `https://${apiKey}:${apiSecret}@${store_url}/admin/api/2021-10/customers/${customer_id}.json`;
        return await ((await fetch(_URL, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })).json());
    },

    /**
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
     saveCart: async (req) => {
        const verified = await appService.verifyWebhook(req);
        if(verified == true) {
            const data = JSON.stringify(req.body);
            const product = JSON.parse(data);
            return product;
        }
    },
}

module.exports = appService;