const express=require("express")

const router=express.Router()

router.get("/proyectos", (req,res)=>{
    res.send("Aqui estan los proyectos guardados en nuestra BD de CapireSoft")
})

module.exports=router;