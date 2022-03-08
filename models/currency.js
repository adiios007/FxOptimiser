const csvtojson = require('csvtojson');
const fileName = "currencycode.csv";
module.exports = function Currency() {
    
    this.find = function(currency){
      return  csvtojson().fromFile(fileName).then(source => {
            for(var i =0 ; i< source.length;i++){
                if(currency == source[i]['AlphabeticCode']){
                    return true;
                }
            }
            return false;
        });
    };
};