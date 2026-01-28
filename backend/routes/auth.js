const express = require("express")
const User = require("../models/User.js")
const route = express.Router()
const bcrypt = require("bcrypt")

route.post("/create-user", async (req, res) => {
    console.log("create api")
   try {
        const { name, email, password, mobile, address } = req.body
        console.log(email,name)
        let user =await User.findOne({ email })
        console.log(user)
        if (user) {
            return res.status(400).json({ "message": "user already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        user = new User({
            name, email, password:hashedPassword, mobile, address
        })
        await user.save()
        return res.status(201).json({ "message": "user created successfully" })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ "message": "internal server error while creating user" })
    }
})

route.post("/login",async (req,res)=>{
    try{
        const {email,password}=req.body 
        console.log("from login",email,password)
        const adminEmail="admin@gmail.com"
        const adminPassword="Admin1@"
        if(adminEmail==email && adminPassword==password){
            return res.status(200).json({"message":"Admin login successful", role:"admin"})
        }
        const user=await User.findOne({email})
        console.log("user checking",user)
        if(!user){
            return res.status(400).json({"message":"Invalid email"})
        }
        const isMatch=await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({"message":"Invalid password"})
        }
        return res.status(200).json({"message":"Login succesful", role:"user",userId:user._id})
    }
    catch(err){
        console.log("error from user login",err)
    }
})

module.exports = route