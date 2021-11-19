import express from "express"

const app=express()
const port=5500

app.get("/",(req, res)=>{
   res.send("Hola mundo")
})

app.listen(port, ()=>{
   console.log("Servidor activo y funcionando")
})