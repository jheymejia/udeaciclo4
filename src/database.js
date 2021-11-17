const mongoose=require("mongoose")
const atlasUrl="mongodb+srv://Administradores:skqy9wN171XtzZRF@capiresoft.jpkzj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

try {
    //conexion con el cluster de bases de datos
    connect(
        atlasUrl, {useNewUrlParser: true, useUnifiedTopology: true}, 
        ()=> console.log("Estamos conectados a MongoDB en Atlas con Mongoose")
    );
} catch(e){
    console.log("Error en la conexion :( ");
}
