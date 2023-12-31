const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
        if (err) {
            res.status(401).json({ status: "error", message: err.message, data: null });
        } else {
            // add user id to request
            req.body.auth = decoded;
            next();
        }
    });


};