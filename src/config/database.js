const mongoose=require('mongoose');

 async function connectDB() {
    //    console.log(process);
        await mongoose.connect(process.env.MONGODB_URI)
        .then(()=>{
    console.log("Database connected successfully")

        })
        .catch(err=>{
         console.log("Error to connected Database",err)

          process.exit(1);
        })
}

module.exports=connectDB