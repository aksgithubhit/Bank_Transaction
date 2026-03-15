require("dotenv").config();
const app=require('./src/app.js')
const connectDB=require("./src/config/database.js")
connectDB();
app.listen(4000,()=>{
    console.log("server is running on port 4000")
})