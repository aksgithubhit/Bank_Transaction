// we create 2 routes 1 for register 2 for login

const express=require('express');
const userRegister=require('../controllers/auth.controllers')
const router=express.Router();

/** POST /api/auth/register */
router.post('/register',userRegister.register);

 router.post('/login',userRegister.login);


module.exports=router;