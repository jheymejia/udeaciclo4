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
    misProyectos: () => []
  },

  //Mutationes
  Mutation: {
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
      
  },
  Usuarios:{
  id:(root)=>{
    return root._id;
  }
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
    presupuesto: Int!
    fecha_inicio: String!
    fecha_terminacion_proyecto: String!
    identificacion_usuario: Int!
    nombre_completo_usuario: String!
    estado_proyecto: String!
    fase_proyecto: String!
  }
  type Inscripciones{
    id: ID!
    id_inscripciones: String!
    identificacion_usuario: Int!
    id_proyecto: String!
    estado_inscripcion: String!
    fecha_ingreso: String!
    fecha_egreso: String
  }
  type Avances{
    
    id: ID!
    id_avance: String!
    identifiacion_usuario: Int!
    fecha_avance: String!
    descripcion_avance: String!
    observaciones_lider: String
  }

  type Mutation{
    signUp(input:signUpInput):AuthUser!
    signIn(input:signInInput):AuthUser!
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

  type AuthUser{
      Usuarios:Usuarios!
      token: String!
  }
  `;

