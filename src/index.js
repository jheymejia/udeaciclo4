const { ApolloServer, gql } = require('apollo-server');
const dotenv=require("dotenv");
const { MongoClient } = require('mongodb');
dotenv.config();
const {DB_URI,DB_NAME}=process.env;



const resolvers = {
  Query: {
    misProyectos: () => []
},

//Mutationes
Mutation: {
    singUp: async(root,{input},{db})=>{
        const hashedPassword=bcrypt.hashSync(input.password)
        const newUser={
            ...input,
            password:hashedPassword,
        }
    const result= await db.collection("user").insertOne(newUser);
    //Funcion asincrona que puede recibir 3 argumentos y regresa un objeto
    const user=result.ops[0]
    return{
        user,
        token:"token",
    }
}
},
user:{
id:(root)=>{
    return root.Id;
}
}
}




const start= async() =>{
  const client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db=client.db(DB_NAME)


  const server = new ApolloServer({ typeDefs, resolvers });

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
    misProyectos:[proyectos!]!
  }
  
  type Usuarios{
    id: ID!
    mail: String!
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
    presupuesto: int!
    fecha_inicio: date!
    fecha_terminacion_proyecto: date!
    identificacion_usuario: int!
    nombre_completo_usuario: String!
    estado_proyecto: String!
    fase_proyecto: String!
  }
  type Inscripciones{
    id: ID!
    id_inscripciones: String!
    identificacion_usuario: int!
    id_proyecto: String!
    estado_inscripcion: String!
    fecha_ingreso: date!
    fecha_egreso: date
  }
  type Avances{
    
    id: ID!
    id_avance: String!
    identifiacion_usuario: int!
    fecha_avance: date!
    descripcion_avance: String!
    observaciones_lider: String
  }

  type Mutation{
    singUp(input:SingUpInput):AuthUser!
  }

  input SingUpInput{
    mail: String!
    identificacion_usuario: String!
    nombre_completo_usuario: String!
    contrasena: String!
    tipo_usuario: String!
  }

  type AuthUser{
      user:user!
      token: String!
  }
  `;

