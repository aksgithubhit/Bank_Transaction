const mongoose=require('mongoose')

const ledgerSchema=new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'account',
        required:[true,"ledger must be associated with an account"],
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        immutable:true,
         required:[true,"amount is required for creating an entry"],
    },
    transaction:{
         type:mongoose.Schema.Types.ObjectId,
        ref:'Transaction',
        required:[true,"ledger must be associated with an transaction"],
        index:true,
        immutable:true

    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"type can be either CREDIT or DEBITED"
        },
        required:[true,"ledger type is required"],
        immutable:true
    }

})

function preventlegerModification(){
    throw new Error("Ledger entry cannot be modified or deleted");
}

ledgerSchema.pre('findOneAndUpdate',preventlegerModification)
ledgerSchema.pre('updateOne',preventlegerModification)
ledgerSchema.pre('deleteOne',preventlegerModification)
ledgerSchema.pre('remove',preventlegerModification)
ledgerSchema.pre('deleteMany',preventlegerModification)
ledgerSchema.pre('updateMany',preventlegerModification)
ledgerSchema.pre('findOneAndDelete',preventlegerModification)
ledgerSchema.pre('findOneAndReplace',preventlegerModification)




const ledgerModel=mongoose.model("ledgerModel",ledgerSchema);
module.exports=ledgerModel;