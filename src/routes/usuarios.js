const express=require("express")

const router=express.Router()

router.get("/usuarios/singup", (req,res)=>{
    res.send("Aqui te vas a registrar")
})

router.get("/usuarios/singin", (req,res)=>{
    res.send("Aqui inicias sesion")
})

module.exports=router;