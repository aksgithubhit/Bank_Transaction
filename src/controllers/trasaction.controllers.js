const transactionModel = require('../models/transaction.models');
const ledgerModel = require('../models/ledger.models');
const emailServices = require('../services/email.services');

/**
 * Create a transaction model
 * 1 validate request
 * 2. validate idempotency key
 * 3.check amount status
 * 4.derive sender balance from ledger
 * 5.create transaction
 * 6. create debit ledger entry
 * 7.create credit ledger entry
 * 8.mark trasaction complete
 * 9.commit mongoDB session
 * 10.send email notification
 * 
 * 
 */
async function createTrasaction(req, res) {
  const session = await transactionModel.startSession();
  session.startTransaction();

  try {
    // 1. Validate request
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
    if (!fromAccount || !toAccount || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // 2. Validate idempotency key
    const existingTransaction = await transactionModel.findOne({ idempotencyKey }).session(session);
    if (existingTransaction) {
      await session.abortTransaction();
      return res.status(409).json({ error: 'Transaction already processed' });
    }

    // 3. Check amount status (assuming amount is valid as per validation)

    // 4. Derive sender balance from ledger
    const senderLedger = await ledgerModel.findOne({ account: fromAccount }).session(session);
    if (!senderLedger || senderLedger.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // 5. Create transaction
    const transaction = new transactionModel({
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
      status: 'pending'
    });
    await transaction.save({ session });

    // 6. Create debit ledger entry
    const debitEntry = new ledgerModel({
      account: fromAccount,
      amount: -amount,
      type: 'debit',
      transactionId: transaction._id
    });
    await debitEntry.save({ session });

    // 7. Create credit ledger entry
    const creditEntry = new ledgerModel({
      account: toAccount,
      amount: amount,
      type: 'credit',
      transactionId: transaction._id
    });
    await creditEntry.save({ session });

    // 8. Mark transaction complete
    transaction.status = 'completed';
    await transaction.save({ session });

    // 9. Commit mongoDB session
    await session.commitTransaction();

    // 10. Send email notification
    // Assuming user details are available; adjust as needed
    const userEmail = req.user.email; // Example: get from auth
    const userName = req.user.name; // Example: get from auth
    await emailServices.sendTransactionEmail(userEmail, userName, amount, toAccount);

    res.status(201).json({ message: 'Transaction successful', transactionId: transaction._id });
  } catch (error) {
    await session.abortTransaction();
    console.error('Transaction failed:', error);
    res.status(500).json({ error: 'Transaction failed' });
  } finally {
    session.endSession();
  }
}
async function createInitialFundsTransaction(req,res){
        const {  toAccount, amount, idempotencyKey } = req.body;
        if(!toAccount || !amount || !idempotencyKey){
         return res.status(400).json({ message: 'to account , amount and idempotency key is required' });

        }

        const touser=await accountModel.findOne({
            _id:toAccount,

        })
      if(!touser){
     return res.status(400).json({ message: 'Invalid toAcccount' });

      }
  const fromuser=await accountModel.findOne({
    SystemUser:true,
    user:req.user._id
  })
  if(!fromuser){
    return res.status(400).json({
        message:"system user not found"
    })
  }

  const 
}

module.exports = { createTrasaction };