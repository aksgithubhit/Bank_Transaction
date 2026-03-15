const express=require('express');
// const userRegister=require('../controllers/auth.controllers')
const authMiddleare_=require("../middleware/auth.middleware.js")
const accountController=require('../controllers/account.controllers.js')
const router=express.Router();
// create a new account
router.post('/',authMiddleare_,accountController.createAccount);





module.exports=router