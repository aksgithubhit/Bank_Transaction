const mongoose = require('mongoose');
const bcrypt=require('bcryptjs')

const userSchema = new mongoose.Schema({
  // User's full name - required field, automatically trims whitespace
  name: {
    type: String,
    required: [true,"name is required for creating an account"], // Must be provided when creating a user
    trim: true // Removes leading and trailing whitespace before saving
  },
  // User's email address - must be unique, converted to lowercase, trimmed
  email: {
    type: String,
    required: true,
    unique:[true,"email already exist"], // No two users can have the same email
    lowercase: true, // Converts email to lowercase before saving
    trim: true, // Removes leading and trailing whitespace,
    match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"inavlaid email address"] // for email validation

  },
  // User's password - minimum 6 characters required
  password: {
    type: String,
    required: true,
    minlength: 6, // Password must be at least 6 characters long
    select:false // password is not selected until we make a request for password when we raised a query
  },
  systemUser:{
    type:Boolean,
    default:false,
    immutable:true,
    select:false
  },
  // Unique account number for banking transactions
//   accountNumber: {
//     type: String,
//     required: true,
//     unique: true // Each user must have a unique account number
//   },
  // Current account balance - defaults to 0, cannot be negative
//   balance: {
//     type: Number,
//     default: 0, // If not provided, balance starts at 0
//     min: 0 // Balance cannot be less than 0
//   },
  // Optional phone number - trimmed if provided
//   phone: {
//     type: String,
//     trim: true // Removes whitespace if phone number is provided
//   },
  // Optional address - trimmed if provided
//   address: {
//     type: String,
//     trim: true // Removes whitespace if address is provided
//   },
//   // Account status - true for active accounts, false for deactivated
//   isActive: {
//     type: Boolean,
//     default: true // New accounts are active by default
//   }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create indexes for better query performance on frequently searched fields
// userSchema.index({ email: 1 }); // Index on email for fast lookups
// userSchema.index({ accountNumber: 1 }); // Index on account number for fast lookups

// we use pre middleware 
userSchema.pre("save",async function(){
    //check if password is changed 
  if(!this.isModified("password")){
    return ;
  }
  // convert into hash 
  const hash=await bcrypt.hash(this.password,10);
  this.password=hash;
 return ;
})
//we create user methods also
 userSchema.methods.comparePassword=async function(password){
    // it return true or false
    return await bcrypt.compare(password,this.password);
 }
 const userModel=mongoose.model("userModel",userSchema);
 module.exports=userModel;