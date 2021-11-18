const express=require("express")

const router=express.Router()

router.get("/", (req,res)=>{
    res.render("../Home")
})

router.get("/aboutus", (req,res)=>{
    res.send("Esto es Acerca de nosotros ")
})

module.exports=router;