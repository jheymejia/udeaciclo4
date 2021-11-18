const { ApolloServer, gql } = require('apollo-server');
const dotenv=require("dotenv");
const { MongoClient } = require('mongodb');
dotenv.config();
const {DB_URI,DB_NAME}=process.env;

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`

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
    id_proyecto:
    nombre_proyecto:
    objetivo_general:
    objetivos_especificos:
    presupuesto:
    fecha_inicio:
    fecha_terminacion_proyecto:
    identificacion_usuario:[identificacion_usuario!]!
    nombre_completo_usuario:
    estado_proyecto:
    fase_proyecto:
  }

  type Inscripciones{

    id: ID!
    id_inscripciones:
    identificacion_usuario:
    id_proyecto:
    estado_inscripcion:
    fecha_ingreso:
    fecha_egreso:

  }
  type Avances{
    
    id: ID!
    id_avance:
    identifiacion_usuario:
    fecha_avance:
    descripcion_avance:
    observaciones_lider:
  }
 `
;


const books = [
    {
      title: 'The Awakening',
      author: 'Andrea Chopin',
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
    },
  ];


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






  // Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      books: () => books,
    },
  };


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
