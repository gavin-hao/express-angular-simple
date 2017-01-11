/**
 * Created by zhigang on 14/10/23.
 */
var expressJwt = require('express-jwt');
var _ = require('lodash');
var config = require('config');

var jwtDefaultOptions = {
    "secret": "A92LWsdBgH6legaUm8U3uyJ7n1bdEik7WvO8nQab9LlHTtnawpRx8d-HPqW0b2g-",
    "audience": "dongkerCN@123456",
    "expiresInMinutes": 360,
    "issuer": "urn:dongkercn",
    "algorithm": "HS256",
    "subject": "urn:dongkerweb"
};

var jwtConf = (config.get('web') && config.get('web').auth) ? config.get('web').auth["jwt"] : {};
var option = _.defaults(jwtConf,jwtDefaultOptions);
exports.jwtSetting = option;