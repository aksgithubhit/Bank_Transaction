const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Reference to the account involved in the transaction
    fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    index: true // Index for faster queries on account
  },
  toAccount:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required:[true, "Transaction must be associated with a account"],
    index: true 

  },
   status: {
    type: String,
    enum: ['ACTIVE', 'FROZEN', 'CLOSED'],
    default: 'PENDING'
   },
  // Transaction amount - positive number
  amount: {
    type: Number,
    required: [true, 'Transaction amount is required'],
    min: [0.01, 'Transaction amount must be greater than 0']
  },
  // same payment ko 2 bar karna sa rokti ha , client generate karaga 
  idempotencyKey:{
    type:String,
    required: [true,"Idempotency key is required for creating a transaction"],
    index: true,
    unique:true
  }
  // Type of transaction - credit (money in) or debit (money out)
  // type: {
  //   type: String,
  //   enum: {
  //     values: ['credit', 'debit'],
  //     message: 'Transaction type must be either credit or debit'
  //   },
  //   required: [true, 'Transaction type is required']
  // },
  // Optional description of the transaction
  // description: {
  //   type: String,
  //   trim: true,
  //   maxlength: [200, 'Description cannot exceed 200 characters']
  // },
  // // Transaction date - defaults to current date/time
  // date: {
  //   type: Date,
  //   default: Date.now,
  //   required: true
  // },
  // Account balance after this transaction
  // balanceAfter: {
  //   type: Number,
  //   required: [true, 'Balance after transaction is required'],
  //   min: [0, 'Balance cannot be negative']
  // },
  // // Optional reference to related transaction (e.g., transfer)
  // relatedTransaction: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Transaction'
  // }
// },
},
 {
  timestamps: true // Adds createdAt and updatedAt fields
});

// // Create indexes for better query performance
// transactionSchema.index({ account: 1, date: -1 }); // Sort transactions by account and date descending
// transactionSchema.index({ type: 1 }); // Index on transaction type

// Virtual for transaction ID (if needed)
// transactionSchema.virtual('id').get(function() {
//   return this._id.toHexString();
// });

// Ensure virtual fields are serialized
// transactionSchema.set('toJSON', {
//   virtuals: true
// });

// Pre-save middleware (if needed)
// transactionSchema.pre('save', function(next) {
//   // Add any pre-save logic here
//   next();
// });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;