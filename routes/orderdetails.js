var express = require("express")
const axios = require('axios');
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
const qs = require('qs');
var Currency = require("../models/currency")
var Env = require("../config/env");
const { response } = require("express");
//const res = require("express/lib/response");

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const curEnv = new Env();
const curCur = new Currency();


router.get('', async function(req, res, next) {
            const  baseURL = 'https://api.sandbox.paypal.com/v2/checkout/orders/'+req.query.token ;
            console.log("URL for get request :"+baseURL );
            try{
            const responseobj = await axios.get(baseURL,{
                headers :
            {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer '+curEnv.getAccessToken("sandbox")
            }});
            console.log("response : "+responseobj.status);
            console.log("response object :"+typeof(responseobj.data));
            let orderdetails = responseobj.data;
            res.render("orderdetails",{data:orderdetails})

        }
        catch(error){
            res.render("error",{data:error})
        }
        });         
module.exports = router;