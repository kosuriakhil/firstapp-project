const express = require("express")
const cors =require("cors")
const mongoose = require("mongoose")
require("dotenv").config() 
const authRoutes=require("./routes/auth.js")
const app = express() 
const port=4000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
//db connection
mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("db connected")
    })
    .catch((err)=>{
        console.log(err)
    })
// console.log(authRoutes)
app.use("/api",authRoutes)

app.get("/",(req,res)=>{
    console.log("get route")
    res.json({"message":"server is running"})
})
app.listen(port,()=>console.log("it is working on",port))