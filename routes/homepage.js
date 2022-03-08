var express = require("express")
const axios = require('axios');
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
const qs = require('qs');
var Currency = require("../models/currency")
var Env = require("../config/env");
const { json } = require("body-parser");
const { response } = require("..");

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const curEnv = new Env();
const curCur = new Currency();
router.get('/home', function(req, res, next) {
    res.render("homepage", { title: 'Fx optimiser', pokeData: 'datama'});
});



router.get('/exchangeCurrency?' , function(req, res , next){

    var basecur = req.query.basecur;
    var targetcur = req.query.targetcur;
    var baseamount = req.query.baseamount;
    var targetval;

   if(curCur.find(targetcur)){
    const data = {
        'quote_items' : [{
            "base_currency": basecur, 
            "base_amount": baseamount, 
            "quote_currency": targetcur,
            "markup_percent": "0.00"  
        }]
    };
    var baseURL = curEnv.getQuoteURL(req.query.mode);
    console.log("quote url:"+baseURL+" mode:"+req.query.mode);
    console.log("accesstoken :"+curEnv.getAccessToken(req.query.mode));
   axios.post(baseURL, data,
        {
            headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer '+curEnv.getAccessToken(req.query.mode)
            }
        }
    ).then((response) => {
        console.log('Status: ${response.status}');
        console.log('Body: ', response.data);
        if(response.status == 200){
        var value = response.data.exchange_rate_quotes[0].quote_amount.value;
        var fx_id = response.data.exchange_rate_quotes[0].fx_id;
        var xchangerate = response.data.exchange_rate_quotes[0].exchange_rate;
        res.json({quoteval : value,
            id : fx_id,
            exchange_rate :xchangerate
        })
        }
        else{

            res.json({
                quoteval:response.data.name+":"+response.data.message
            })
        }
    }).catch((err) => {
        console.error(err);
        res.json(err)
    });
   }
});

router.get('/switchenv?', function(req, res,next){
    var data = qs.stringify({
        'grant_type': 'client_credentials',
        'response_type': 'token' 
    });
    var cred = curEnv.getusername(req.query.mode)+":"+curEnv.getpassword(req.query.mode);
      var config = {
        method: 'post',
        url: curEnv.getAuthURL(req.query.mode),
        headers: { 
          'Authorization': 'basic '+Buffer.from(cred).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
        console.log("success");
        var jsonres = response.data;
        curEnv.setAccessToken(jsonres.access_token,req.query.mode);
        res.json({
            'status':'200'
        })
      })
      .catch(function (error) {
        res.json(error);
        console.log(error);
      });
});

router.get("/placeorder?", function(req, res, next){

    const data = {
        "intent": "CAPTURE",
        "purchase_units": [
        {
        "amount": {
        "currency_code": req.query.cur,
        "value": req.query.val
      },
      "payment_instruction": {
        "payee_receivable_fx_rate_id": req.query.fx_id
      }
    }
    ],
    "application_context":{
        "return_url" : "http:localhost:8080/fx/captureorder"
    }
    };

})

module.exports = router;
