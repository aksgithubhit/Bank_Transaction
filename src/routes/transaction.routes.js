const {Router}=require('express');
const authMiddleware = require('../middleware/auth.middleware');
const transactionRoutes=Router()
const trasactionController=require('../controllers/trasaction.controllers')
/**
 * POST /api/transaction
 * Create a new transaction
 */

transactionRoutes.post('/',authMiddleware.authMiddleware,trasactionController.createTrasaction);

/**
 * POST /api/trasactions/system/initial-funds
 * -- Create initial funds transaction from system user 
 * 
 */
transactionRoutes.post('/system/initial-funds', authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction);


module.exports=transactionRoutes;