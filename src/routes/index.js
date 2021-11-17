const express=require("express")

const router=express.Router()

router.get("/", (req,res)=>{
    res.send("Hola grupos 16, 17 y 18, y demas compañeros! :D ")
})

router.get("/aboutus", (req,res)=>{
    res.send("Esto es Acerca de nosotros ")
})

module.exports=router;