const accountModel=require('../models/account.models.js')

async function createAccount(req,res){
   const user=req.user
   const account=await accountModel.create({
    user:user._id
   })
   res.send(201).json({
    account
   })


}

module.exports={createAccount}