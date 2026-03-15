const userModel=require('../models/user.models.js')
const jwt=require('jsonwebtoken')
const emailService=require('../services/email.services.js')

async function register(req,res){
    /** get data */
    const {name,email,password}=req.body;
    // check email if same user exist
    const isExist=await userModel.findOne({
        email
    })
    // if same user exist then return 
  if(isExist)
return res.status(422).json({
    message:"user already exist with email",
    status:"failed"
})

// if user doesnot exist then create a new account
const user=await userModel.create({
    email,password,name
})
   // create a token
   const token=await jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,
    {expiresIn:'3d'}
   )

   res.cookie('token',token);
   // new response send 
   res.status(201).json({
    message:"user Register succesfully",
    user:{
        _id:user._id,
        email:user.email,
        name:user.name
    },
    token

   })

   await emailService.sendRegistrationEmail(user.email,user.name)



}


// Login controller - authenticates user with email and password
async function login(req, res) {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Validate that both email and password are provided
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
            status: "failed"
        });
    }

    // Find the user in the database by their email
    const user = await userModel.findOne({ email }).select("+password")

    // Check if user exists in the database
    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password",
            status: "failed"
        });
    }

    // Compare the provided password with the stored password
    // Note: In production, use bcrypt to compare hashed passwords
   const isValidPassword=await user.comparePassword(password)
   if(!isValidPassword){
    return res.status(401).json({
        message:"Email or Password is Invalid",
    })
   }
    // Generate a JWT token for the authenticated user
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '3d' }
    );

    // Set the token in a cookie for secure client-side storage
    res.cookie('token', token);

    // Send success response with user info and token
    res.status(200).json({
        message: "Login successful",
        status: "success",
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    });
}
module.exports={
    register,
    login
}