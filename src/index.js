const { ApolloServer, gql } = require('apollo-server');
const dotenv=require("dotenv");
const { MongoClient } = require('mongodb');
dotenv.config();
const {DB_URI,DB_NAME}=process.env;
const bcrypt=require("bcryptjs");




const resolvers = {
  Query: {
    misProyectos: () => []
  },

  //Mutationes
  Mutation: {
    singUp: async(root,{input},{db})=>{
        const hashedPassword=bcrypt.hashSync(input.contrasena)
        const newUser={
            ...input,
            contrasena:hashedPassword,
            estado_registro:"Pendiente",

        }
    const result= db.collection("Usuarios").insertOne(newUser);
    //Funcion asincrona que puede recibir 3 argumentos y regresa un objeto
    const id_usuario=result.ops[0]

    return{
      id_usuario,
      token:"token"
    }
    }
  },
  Usuarios:{
  id:(root)=>{
    return root.id;
  }
  }
}


const start= async() =>{
  const client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db=client.db(DB_NAME)

  const context={
      db,
  }

  const server = new ApolloServer({ typeDefs, resolvers, context });

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
    singUp(input:SingUpInput):AuthUser!
  }

  input SingUpInput{
    correo: String!
    identificacion_usuario: String!
    nombre_completo_usuario: String!
    contrasena: String!
    tipo_usuario: String!
  }

  type AuthUser{
      Usuarios:Usuarios!
      token: String!
  }
  `;

