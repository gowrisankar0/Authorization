const express = require("express");

const app = express();
const users= require("./user.json");
const cars = require("./cars.json");
const jwt =require("jsonwebtoken")


const secretKey ="sankar"
// console.log(users,cars);

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Api is working");
})

app.post("/login",(req,res)=>{
    const user = users.find((user)=>user.username===req.body.username);



    if(user){
        if(req.body.password===user.password){
            const token =jwt.sign({userId:user.id},secretKey);
            return res.json(token)
        }else{
            return res.json({msg:"Wrong Password"})
        }
    }else{
        return res.json({msg:"No user Found"});
    }
});

function checkToken(req,res,next){

     const token =req.headers["authorization"];
    if(token){
        jwt.verify(token,secretKey,(err,decoded)=>{
            if(err){
                console.log(err);
                return res.json({msg:"token invalid"})
            }else{
                req.userID=decoded.userID;
                next();
            }
        })
    }else{
        res.json({msg:"Token is missing"})
    }
}


app.get("/data",checkToken,(req,res)=>{
    const data  = cars.filter((car)=>car.userId===req.params.userID);

    return res.json(data);
})



app.listen(process.env.PORT || 4000,()=>{
    console.log("server is up and running");
})