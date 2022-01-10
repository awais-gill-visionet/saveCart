const crypto = require('crypto');
const fetch = require('node-fetch');
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const store_url = process.env.STORE_URL;
const webhookSecret = process.env.WEBHOOK_SECRET;

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
        let orders = [];
        for(let j=0; j<orders.length; j++) {
            console.log(orders[j]);
            let getOrder = await appService.getOrder(orders[j]);
            let tags = getOrder.orders[0].customer.tags+', March 2021 DM, S21 DM - EXTERNAL PROSPECT';
            //let updateCustomer = await appService.updateCustomer(getOrder.orders[0].customer.id, tags);
            response.push({
                'id': getOrder.orders[0].id,
                'name': getOrder.orders[0].name,
                'customer_id':getOrder.orders[0].customer.id,
                'tags': tags
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
     getCust: async (customer_id) => {
        let _URL = `https://${apiKey}:${apiSecret}@${store_url}/admin/api/2021-10/customers/${customer_id}.json`;
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
     saveCart: async (req) => {
        let customer_id = req.body.cust_id;
        let line_items  = req.body.line_items;
        let get_cust = await appService.getCust(customer_id);
        let tags = get_cust.customer.tags;
        let splitTags = tags.split(", ");
        let carTags = [];
        
        let filteredTags = splitTags.filter(function(val) {
            return !val.includes('line_item:');
        });

        for(let i=0; i<line_items.length; i++) {
            carTags.push('line_item:'+line_items[i].id+':'+line_items[i].quantity);
        }

        let appendTags = carTags.join(",");

        let newTags = filteredTags ? filteredTags+','+appendTags : appendTags;

        let updateCustomer = await appService.updateCustomer(customer_id, newTags);
        
        return updateCustomer;
    },

    /**
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
     clearCart: async (req) => {
        const verified = await appService.verifyWebhook(req);
        if(verified == true) {
            const data = JSON.stringify(req.body);
            const order = JSON.parse(data);
            let tags = order.customer.tags;
            let splitTags = tags.split(", ");
            let filteredTags = splitTags.filter(function(val) {
                return !val.includes('line_item:');
            });

            let updateCustomer = await appService.updateCustomer(order.customer.id, filteredTags);
            return filteredTags;
        }
    },

    /**
     * @param req
     * @returns {Promise<*>}
     */
     verifyWebhook: async (req) => {
        const hmac = req.header("X-Shopify-Hmac-Sha256");
        const message = req.rawBody;
        const genHash = crypto
        .createHmac("sha256", webhookSecret)
        .update(message, 'utf8', 'hex')
        .digest("base64");
        return genHash === hmac;
    },
}

module.exports = appService;