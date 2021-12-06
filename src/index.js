const { ApolloServer, gql } = require('apollo-server');
const dotenv=require("dotenv");
const { MongoClient, ObjectId} = require('mongodb');
dotenv.config();
const {DB_URI,DB_NAME,JWT_KEY}=process.env;
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const getToken = (Usuarios)=> jwt.sign({id: Usuarios._id},JWT_KEY, {expiresIn: "30 days"});
const getUserFromToken = async(token, db) => {
  //if (!token) { return "OK" } 
  const tokendata = jwt.verify(token, JWT_KEY);   
  return await db.collection("Usuarios").findOne({_id: ObjectId(tokendata.id)});
 
}
 
const resolvers = {
  Query: {  
    
    // HU_004
    obtenerUsuarios: async(_,__,{db, Usuarios}) =>{

      autorizado = false;

      if(Usuarios){
        if(Usuarios.tipo_usuario == "Administrador"){
          if(Usuarios.estado_registro == "Autorizado"){
            autorizado = true;
          };
        };
      }     

      
      if(autorizado == true){
        return await db.collection('Usuarios').find().toArray();
      }
      
      else if(autorizado ==false){ throw new Error("Su usuario no esta habilitado para esta operación"); }    
            
    },

    // USUARIOS HU_006

    listarProyectos: async (_, __, { db, Usuarios }) => {
      autorizado = false;

      if (Usuarios) {
        if (Usuarios.tipo_usuario == "Administrador") {
          if (Usuarios.estado_registro == "Autorizado") {
            autorizado = true;
          }
        }
      }

      if (autorizado == true) {
        return await db.collection("Proyectos").find().toArray();
      } else if (autorizado == false) {
        throw new Error("Su usuario no esta habilitado para esta operación");
      }
    },

    // USUARIOS HU_010

    // USUARIOS HU_013

    // USUARIOS HU_015

    // USUARIOS HU_017

    obtenerAvancesProyecto: async(_,{id},{db, Usuarios}) =>{

      if(Usuarios){
        if(Usuarios.tipo_usuario == "Lider"){
          if(Usuarios.estado_registro == "Autorizado"){            

            const Proyecto = await db.collection("Proyectos").findOne({_id: ObjectId(id)});    
            
            console.log(Proyecto.identificacion_usuario)
            console.log(Usuarios.identificacion_usuario)
            console.log(Proyecto.id_proyecto)         
            
         
            const Avances = await db.collection("Avances").findOne({id_proyecto:Proyecto.id_proyecto }) 

            console.log(Avances) 
            console.log(Proyecto)
            
            
            if(Proyecto.identificacion_usuario==Usuarios.identificacion_usuario){

              const Avances = await db.collection("Avances").findOne({id_proyecto:Proyecto.id_proyecto })

              return {
                Avances,
                Proyectos:Proyecto
              }

            }
          }
        } 
      }

    


    },

    // USUARIOS HU_019

    // USUARIOS HU_021
    
    avancesProyectoInscrito: async(_,{id_proyecto},{db, Usuarios}) =>{
      

      return await db.collection("Avances").find({id_proyecto:id_proyecto}).toArray();     
 
    
    
    },

  },

  //Mutationes
  Mutation: {

    // GENERAL HU_001, HU_002

    signUp: async(root,{input},{db})=>{
        const hashedPassword=bcrypt.hashSync(input.contrasena)
        const newUser={
            ...input,
            contrasena:hashedPassword,
            estado_registro:"Pendiente",

        }
    const result= await db.collection("Usuarios").insertOne(newUser);
    //Funcion asincrona que puede recibir 3 argumentos y regresa un objeto
   

    return{
      Usuarios:newUser,
      token:getToken(newUser),
    }
    },
  
    signIn: async(root,{input},{db})=>{
      const Usuarios = await db.collection("Usuarios").findOne({correo:input.correo});
      const IsClaveCorrecta = Usuarios && bcrypt.compareSync(input.contrasena, Usuarios.contrasena );

      

      if(!Usuarios || !IsClaveCorrecta){
        throw new Error("Credenciales no son correctas");    
      }  
      
      return{
        Usuarios,
        token:getToken(Usuarios),             
      } 
    },  

    // USUARIOS HU_003

    actualizarUsuario: async(_,{input},{db, Usuarios }) =>{

      if(!Usuarios){console.log("No esta autenticado, por favor inicie sesión.")} 

      // No se almacena en DB la contrasena digitada por el usuario, se debe encriptar
      hashedPassword = bcrypt.hashSync(input.contrasena)
      
      // Si el usuario cambia el tipo de usuario debe esperar a autorizacion por cuestion de seguridad
      if(input.tipo_usuario==Usuarios.tipo_usuario){estado_usuario_ingresar=Usuarios.tipo_usuario}
      else {estado_usuario_ingresar="Pendiente"}

      const result= await db.collection("Usuarios").updateOne({_id:ObjectId( Usuarios._id)},{$set:
        {correo: input.correo ,
          identificacion_usuario: input.identificacion_usuario,
          nombre_completo_usuario: input.nombre_completo_usuario,
          contrasena: hashedPassword,
          tipo_usuario: input.tipo_usuario,
          estado_registro: estado_usuario_ingresar
          }  
      });
      
      return await db.collection("Usuarios").findOne({_id:ObjectId( Usuarios._id)});
      

    },  

    // USUARIOS HU_005 
    aceptarUsuario: async(_,{id ,estado_registro },{db, Usuarios }) =>{

      if(!Usuarios){console.log("No esta autenticado, por favor inicie sesión.")}

      if(Usuarios){
        if(Usuarios.tipo_usuario == "Administrador"){
          if(Usuarios.estado_registro == "Autorizado"){
            const result= await db.collection("Usuarios").updateOne({_id: ObjectId(id)},
            {$set:
              { estado_registro: estado_registro }  
            })            
            return await db.collection("Usuarios").findOne({_id: ObjectId(id)});
          };
        };
      }
    },

    

    // USUARIOS HU_007

    estadoInscripcion: async (_, { id, estado_inscripcion }, { db, Usuarios }) => {
      if (!Usuarios) {
        console.log("No esta autenticado, por favor inicie sesión.");
      }

      const result = await db.collection("Inscripciones").updateOne(
        { _id: ObjectId(id) },
        {
          $set: {     
            id: ObjectId(id),      
            estado_inscripcion: estado_inscripcion,
          },
        }
      );

      return await db.collection("Inscripciones").findOne({ _id: ObjectId(id) });
    },


    // USUARIOS HU_008

    estadoProyecto: async (_, { id, estado_proyecto }, { db, Usuarios }) => {
      if (!Usuarios) {
        console.log("No esta autenticado, por favor inicie sesión.");
      }

      const result = await db.collection("Proyectos").updateOne(
        { _id: ObjectId(id) },
        {
          $set: {     
            id: ObjectId(id),      
            estado_proyecto: estado_proyecto,
          },
        }
      );

      return await db.collection("Proyectos").findOne({ _id: ObjectId(id) });
    },


    // USUARIOS HU_009    

    faseProyecto: async (_, { id, fase_proyecto }, { db, Usuarios }) => {
      if (!Usuarios) {
        console.log("No esta autenticado, por favor inicie sesión.");
      }

      const result = await db.collection("Proyectos").updateOne(
        { _id: ObjectId(id) },
        {
          $set: {  
            id:   ObjectId(id),       
            fase_proyecto: fase_proyecto,
          },
        }
      );

      return await db.collection("Proyectos").findOne({ _id: ObjectId(id) });
    },

    // USUARIOS HU_011

    // USUARIOS HU_012

    crearProyecto: async(root,{input},{db, Usuarios }) =>{

      if(!Usuarios){console.log("No esta autenticado, por favor inicie sesión.")}

      if(Usuarios){
        if(Usuarios.tipo_usuario == "Lider"){

          const nuevoProyecto={
            ...input,          
            identificacion_usuario: Usuarios.identificacion_usuario,
            nombre_completo_usuario: Usuarios.nombre_completo_usuario,
            estado_proyecto: "Inactivo",
            fase_proyecto: "Null"
          }

          const result= await db.collection("Proyectos").insertOne(nuevoProyecto);   

          return  {
            Proyectos:nuevoProyecto,
            
            
            }    
          
        }
        else{ throw new Error("Su usuario no esta habilitado para esta operación")}        
      }


    },

    // USUARIOS HU_014

    modificarProyecto: async(_,{input},{db, Usuarios }) => {

      if(Usuarios){
        if(Usuarios.tipo_usuario == "Lider"){
          if(Usuarios.estado_registro == "Autorizado"){

            const Proyecto = await db.collection("Proyectos").findOne({_id: ObjectId(input.id)});  

            if(Proyecto.estado_proyecto=="Activo" && Proyecto.identificacion_usuario == Usuarios.identificacion_usuario){

              const result= await db.collection("Proyectos").updateOne({_id: ObjectId(input.id)},
                {$set:
                  { nombre_proyecto: input.nombre_proyecto,
                    objetivo_general: input.objetivo_general,
                    objetivos_especificos: input.objetivos_especificos,
                    presupuesto: input.presupuesto}  
                })  
              return await db.collection("Proyectos").findOne({_id: ObjectId(input.id)});

            }
          }
        }
      }




    },

    // USUARIOS HU_016

    aceptarInscripcion: async(_,{id ,estado_inscripcion },{db, Usuarios }) => {

      if(Usuarios){
        if(Usuarios.tipo_usuario == "Lider"){
          if(Usuarios.estado_registro == "Autorizado"){


            const result= await db.collection("Inscripciones").updateOne({_id: ObjectId(id)},
            {$set:
              { estado_inscripcion: estado_inscripcion }  
            })            
            return await db.collection("Inscripciones").findOne({_id: ObjectId(id)});



          }
        }
      }




    },

    // USUARIOS HU_018

    // USUARIOS HU_020

    registrarIncripcion: async(_,{id},{db, Usuarios})=>{
      if(Usuarios){
        if(Usuarios.tipo_usuario == "Estudiante"){
          if(Usuarios.estado_registro == "Autorizado"){
            
            const Proyecto = await db.collection("Proyectos").findOne({_id: ObjectId(id)});    

            console.log(Proyecto)

            const inscripcion ={
                              
              identificacion_usuario: Usuarios.identificacion_usuario,      
              id_proyecto: Proyecto.id_proyecto ,
              estado_inscripcion: "Pendiente",
              fecha_ingreso:"Null",
              fecha_egreso:Proyecto.fecha_terminacion_proyecto
            }

            console.log(inscripcion)

            const result= await db.collection("Inscripciones").insertOne(inscripcion);   
            
            return{
              Inscripciones:inscripcion
            }
          }
        }
      }
    },

    // USUARIOS HU_022

    registrarAvance: async(_,{id_proyecto,avanceIn},{db, Usuarios})=>{

      if(Usuarios){
        if(Usuarios.tipo_usuario == "Estudiante"){
          if(Usuarios.estado_registro == "Autorizado"){

          const nuevoAvance={
            id_avance: "00004",
            identificacion_usuario: Usuarios.identificacion_usuario,
            id_proyecto: id_proyecto,
            fecha_avance: new Date().toISOString(),
            descripcion_avance: avanceIn, 
            observaciones_lider: "Null" 
          }

          console.log(nuevoAvance)

          const result= await db.collection("Avances").insertOne(nuevoAvance);   

          return  {Avances:nuevoAvance,    }   
          }
        }
      }
    },

    // USUARIOS HU_023

    actualizarAvance: async(_,{id,avanceIn},{db, Usuarios})=>{

      if(Usuarios){
        if(Usuarios.tipo_usuario == "Estudiante"){
          if(Usuarios.estado_registro == "Autorizado"){          
            const result= await db.collection("Avances").updateOne({_id:ObjectId(id)},{
              $set:
              {descripcion_avance:avanceIn}
            }); 

          return  await db.collection("Avances").findOne({_id: ObjectId(id)})
          }
        }
      }
    },



    
      
  },
  
  Usuarios:{ id:(root)=>{ return root._id;},
    
}
}


const start= async() =>{
  const client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db=client.db(DB_NAME)


    
  const server = new ApolloServer({
    typeDefs, 
    resolvers,     
    context: async({req})=>{
      const Usuarios = await getUserFromToken(req.headers.authorization, db)
      console.log(Usuarios)
      return{
        db,
        Usuarios,
      } 
    },
  }); 

    


  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
  });
}  
start();






// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`

  type Query{
    misProyectos:[Proyectos!]!
    obtenerUsuarios:[Usuarios!]
    listarProyectos: [Proyectos!]
    avancesProyectoInscrito(id_proyecto:String!): [Avances!]!
    obtenerAvancesProyecto(id:ID!): AvancesProyectos!
  }
  
  type Usuarios{
    id: ID!
    correo: String!
    identificacion_usuario:String!
    nombre_completo_usuario: String!
    contrasena: String!
    tipo_usuario: String!
    estado_registro: String!
  }
  type Proyectos{  
    id: ID!
    id_proyecto: String!
    nombre_proyecto: String!
    objetivo_general: String!
    objetivos_especificos: [String!]
    presupuesto: String!
    fecha_inicio: String!
    fecha_terminacion_proyecto: String!
    identificacion_usuario: String!
    nombre_completo_usuario: String!
    estado_proyecto: String!
    fase_proyecto: String!
  }
  type Inscripciones{
    id: ID!    
    identificacion_usuario: Int!
    id_proyecto: String!
    estado_inscripcion: String!
    fecha_ingreso: String!
    fecha_egreso: String
  }
  type Avances{
    
    id: ID!
    id_avance: String!
    id_proyecto: String!
    identificacion_usuario: Int!
    fecha_avance: String!
    descripcion_avance: String!
    observaciones_lider: String
  }

  type Mutation{
    signUp(input:signUpInput):AuthUser!
    signIn(input:signInInput):AuthUser!
    actualizarUsuario(input:signUpInput): Usuarios!

    aceptarUsuario(id:ID!, estado_registro:String!): Usuarios! 

    crearProyecto(input: proyectoInput): Cproyectos
    modificarProyecto(input: modificadorProyecto): Proyectos!

    aceptarInscripcion(id:ID!, estado_inscripcion: String!): Inscripciones!

    registrarAvance(id_proyecto:String!, avanceIn:String!): Cavances!
    actualizarAvance(id:ID!,avanceIn:String!):Avances!
   
    registrarIncripcion(id:ID!): Cinscripciones!

    estadoInscripcion(id: ID!, estado_inscripcion: String!): Inscripciones!
    estadoProyecto(id: ID!, estado_proyecto: String!): Proyectos!
    faseProyecto(id: ID!, fase_proyecto: String!): Proyectos!
    
  }

  input signUpInput{
    correo: String!
    identificacion_usuario: String!
    nombre_completo_usuario: String!
    contrasena: String!
    tipo_usuario: String!
  }

  input signInInput{
    correo: String!   
    contrasena: String!
  }

  input proyectoInput{
    id_proyecto: String!
    nombre_proyecto: String!
    objetivo_general: String!
    objetivos_especificos: [String!]
    presupuesto: Int!
    fecha_inicio: String!
    fecha_terminacion_proyecto: String!    
  }

  input modificadorProyecto{
    id:ID!
    nombre_proyecto: String!
    objetivo_general: String!
    objetivos_especificos: [String!]
    presupuesto: String!
   
  }

  type AuthUser{
      Usuarios:Usuarios!
      token: String!

  }

  type Cproyectos{
    Proyectos: Proyectos!
  }

  type Cavances{
    Avances:Avances!
  }

  type AvancesProyectos{
    Avances:Avances
    Proyectos:Proyectos!
  }


  type Cinscripciones{
    Inscripciones: Inscripciones!
  }
 

  `;

