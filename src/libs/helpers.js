const bcrypct = require('bcryptjs');
const passport = require('passport');

const helpers = {};

helpers.encryptPassword = async (password) =>{
   const salt = await bcrypct.genSalt(10);
   const psscrypt = await bcrypct.hash(password,salt);
   return psscrypt;
};

helpers.compararPassword = async(password,savedPassword) =>{
    try{

    return await bcrypct.compare(password,savedPassword);
        
    }catch(e){
        console.log(e)
        
    }
};


module.exports = helpers;