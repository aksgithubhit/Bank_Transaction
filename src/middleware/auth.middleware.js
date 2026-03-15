const userModel = require('../models/user.models');
const jwt = require('jsonwebtoken');
// it is used to verify the user is valid or not
async function authMiddleware(req, res, next) {
    try {
        // Get token from cookies or Authorization header
        const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                message: "Access denied. No token provided.",
                status: "failed"
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Find the user
        const user = await userModel.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({
                message: "Invalid token. User not found.",
                status: "failed"
            });
        }

        // Attach user to request object
        req.user = user;
        next();

    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            message: "Invalid token.",
            status: "failed"
        });
    }
}
async function authSystemUserMiddleware(req,res,next){
 const token=req.cookies.token || req.header.authorization?.split(" ")[ 1 ]
   if(!token){
    return res.status(401).json({
        message:"Unauthorized access, token is missing"
    })
   }
   try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
    const user=await userModel.findById(decoded.userId).select("+systemUser")
    if(!user.systemUser){
        return res.status(403).json({
            message:"Forbidden access, not a system user"
        })
    }
    req.user=user
    return next()

   }catch(err){
    return res.status(401).json({
        message:"Unauthorized access,token is invalid"
    })

   }

}

module.exports = {authMiddleware,authSystemUserMiddleware};



