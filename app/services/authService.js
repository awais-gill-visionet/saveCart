const config = require('../../config/appConfig');

module.exports = {
    // Auth Middle-ware
    /**
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    authenticate: async (req, res, next) => {
        try {
            // check header or url parameters or post parameters for token
            //let token = req.headers['authorization'];
            let token = req.query.token;
            console.log(token)
            if (token){
                console.log('token founded')
                // verifies secret and checks expiry
                let decoded = await helper.jwt.verifyJWT(token);
                console.log(decoded)
                req.token = decoded;
                let response = await User.findById({ _id: req.token.user._id }).populate('role');
                if (response) {
                    req.user = response;
                    next();
                } else {
                    console.log('1')
                    return res.status(config.STATUS_CODES.UNAUTHORIZED).send({
                        success: false,
                        message: "Unauthorized!"
                    });
                }
            }else {
                console.log('2')
                // if there is no token return an error
                return res.status(config.STATUS_CODES.UNAUTHORIZED).send({
                    success: false,
                    message: "Unauthorized!"
                });
            }
        } catch (err) {
            console.log('3')
            return res.status(config.STATUS_CODES.UNAUTHORIZED).send({
                success: false,
                message: "Unauthorized!"
            });
        }
    },
};