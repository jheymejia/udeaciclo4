const express = require("express")
const path=require("path")
const exphbs = require("express-handlebars")
const methodOverride=require("method-override")

//variables
const app=express()
require("./database")

//Configuracion
app.set("port", 5500)
app.set("views", path.join(__dirname, "views"))


app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", exphbs({
    defaultLayout: "main", //marco por defecto 
    layoutsDir: path.join(app.get("views"), "layouts"),  //directorio de las plantillas, obtene direccion de views y concatena con layouts
    partialsDir: path.join(app.get("views"), "partials"),  //partes reutilizables preconfigurados
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs"); //utilizar la configuracion del engine, revisar luego


//funciones
app.use(express.urlencoded({extended: false})) //no se acepta formatos diferentes  a datos
app.use(methodOverride("_method")) //extiende las funcionalidades de los formularios
//pendiente configurar sessions

//rutas
app.use(require("./routes/index"))
app.use(require("./routes/proyectos"))
app.use(require("./routes/usuarios"))

//archivos
app.use(express.static(path.join(__dirname, "public")))

//Servidor escucha
app.listen(app.get("port"), ()=>{
    console.log("Servidor activo y funcionando desde el puerto:", app.get("port"))
})