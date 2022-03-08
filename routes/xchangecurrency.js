var express = require("express")
const bodyParser = require('body-parser');
var Env = require("../config/env");
const { json } = require("body-parser");
const { response } = require("..");

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('', function(req, res, next) {
    res.render("currencyconvertor", { title: 'Currency Convertor', pokeData: 'datama'});
});

module.exports = router ;
