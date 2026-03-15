const express=require('express')
const cookieParser=require('cookie-parser')
/** Routes require */
const authRouter=require('./routes/auth.routes.js')
const accountRouter=require('./routes/account.routes.js')
const transactionRoutes=require('./routes/transaction.routes.js')



const app=express();

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth',authRouter);
app.use('/api/accounts',accountRouter)

app.use('/api/trasaction',transactionRoutes);


module.exports=app;
/**
 * app file has 2 work 
 * 1 server ko create karna 
 * 2 is the server ko config karna ->middleware and api use 
 */