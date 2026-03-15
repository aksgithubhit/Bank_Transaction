const mongoose=require('mongoose')

const accountSchema=new mongoose.Schema({
   user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"userModel",
    required:true,
    index:true
   }, 
//      accountNumber: {
//     type: String,
//     required: true,
//     unique: true
//    },
//    accountType: {
//     type: String,
//     enum: ['savings', 'checking', 'business'],
//     default: 'savings'
//    },
//    balance: {
//     type: Number,
//     default: 0,
//     min: 0
//    }, 
     status: {
    type: String,
    enum: ['ACTIVE', 'FROZEN', 'CLOSED'],
    default: 'ACTIVE'
   },
   currency: {
    type: String,
    default: 'INR',
    required:true
   }
}, {
  timestamps: true
});

// Create indexes for better performance
accountSchema.index({ user: 1 , status: 1});
// accountSchema.index({ accountNumber: 1 });

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;


