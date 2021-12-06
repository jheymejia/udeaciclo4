const { ApolloServer, gql } = require("apollo-server");
const dotenv = require("dotenv");
const { MongoClient, ObjectId } = require("mongodb");
dotenv.config();
const { DB_URI, DB_NAME, JWT_KEY } = process.env;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getToken = (Usuarios) =>
  jwt.sign({ id: Usuarios._id }, JWT_KEY, { expiresIn: "30 days" });
const getUserFromToken = async (token, db) => {
  //if (!token) { return "OK" }
  const tokendata = jwt.verify(token, JWT_KEY);
  return await db
    .collection("Usuarios")
    .findOne({ _id: ObjectId(tokendata.id) });
};
 
const resolvers = {
  Query: {
    // HU_004
    obtenerUsuarios: async (_, __, { db, Usuarios }) => {
      autorizado = false;
 
      if (Usuarios) {
        if (Usuarios.tipo_usuario == "Administrador") {
          if (Usuarios.estado_registro == "Autorizado") {
            autorizado = true;
          }
        }
      }
 
      if (autorizado == true) {
        return await db.collection("Usuarios").find().toArray();
      } else if (autorizado == false) {
        throw new Error("Su usuario no esta habilitado para esta operación");
      }
    },
 
    // HU_006
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
    obtenerInscripcionesLider: async(_,__,{db, Usuarios}) =>{

      autorizado = false;

      if(Usuarios){
        if(Usuarios.tipo_usuario == "Lider" || Usuarios.tipo_usuario == "Administrador"){
          if(Usuarios.estado_registro == "Autorizado"){
            autorizado = true;
          };  
        };
      }

      if(autorizado == true){
        var id_leader = Usuarios.identificacion_usuario
        console.log("El id del líder es", id_leader)
        var proj = await db.collection("Proyectos").find({identificacion_usuario : id_leader}).toArray()
        console.log("EL listado de proyectos de este usuario es", proj)
        var proj_id = proj.map(a => a.id_proyecto) // línea para obtener propiedad de un arreglo de objetos
        console.log("los ids de los proyectos de este usuario son", proj_id)
        return await db.collection('Inscripciones').find({id_proyecto: {$in: proj_id}}).toArray();
      }

      else if(autorizado ==false){ throw new Error("Su usuario no esta habilitado para esta operación"); }    

    },    
 
    // USUARIOS HU_017
 
    // USUARIOS HU_019
 
    // USUARIOS HU_021
  },
 
  //Mutationes
  Mutation: {
    // GENERAL HU_001, HU_002
 
    signUp: async (root, { input }, { db }) => {
      const hashedPassword = bcrypt.hashSync(input.contrasena);
      const newUser = {
        ...input,
        contrasena: hashedPassword,
        estado_registro: "Pendiente",
      };
      const result = await db.collection("Usuarios").insertOne(newUser);
      //Funcion asincrona que puede recibir 3 argumentos y regresa un objeto
 
      return {
        Usuarios: newUser,
        token: getToken(newUser),
      };
    },
 
    signIn: async (root, { input }, { db }) => {
      const Usuarios = await db
        .collection("Usuarios")
        .findOne({ correo: input.correo });
      const IsClaveCorrecta =
        Usuarios && bcrypt.compareSync(input.contrasena, Usuarios.contrasena);
 
      if (!Usuarios || !IsClaveCorrecta) {
        throw new Error("Credenciales no son correctas");
      }
 
      return {
        Usuarios,
        token: getToken(Usuarios),
      };
    },
 
    // USUARIOS HU_003
 
    actualizarUsuario: async (_, { input }, { db, Usuarios }) => {
      if (!Usuarios) {
        console.log("No esta autenticado, por favor inicie sesión.");
      }
 
      // No se almacena en DB la contrasena digitada por el usuario, se debe encriptar
      hashedPassword = bcrypt.hashSync(input.contrasena);
 
      // Si el usuario cambia el tipo de usuario debe esperar a autorizacion por cuestion de seguridad
      if (input.tipo_usuario == Usuarios.tipo_usuario) {
        estado_usuario_ingresar = Usuarios.tipo_usuario;
      } else {
        estado_usuario_ingresar = "Pendiente";
      }
 
      const result = await db.collection("Usuarios").updateOne(
        { _id: ObjectId(Usuarios._id) },
        {
          $set: {
            correo: input.correo,
            identificacion_usuario: input.identificacion_usuario,
            nombre_completo_usuario: input.nombre_completo_usuario,
            contrasena: hashedPassword,
            tipo_usuario: input.tipo_usuario,
            estado_registro: estado_usuario_ingresar,
          },
        }
      );
 
      return await db
        .collection("Usuarios")
        .findOne({ _id: ObjectId(Usuarios._id) });
    },
 
    // USUARIOS HU_005
    aceptarUsuario: async (_, { id, estado_registro }, { db, Usuarios }) => {
      if (!Usuarios) {
        console.log("No esta autenticado, por favor inicie sesión.");
      }
 
      if (Usuarios) {
        if (Usuarios.tipo_usuario == "Administrador") {
          if (Usuarios.estado_registro == "Autorizado") {
            const result = await db
              .collection("Usuarios")
              .updateOne(
                { _id: ObjectId(id) },
                { $set: { estado_registro: estado_registro } }
              );
            return await db
              .collection("Usuarios")
              .findOne({ _id: ObjectId(id) });
          }
        }
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
 
    // USUARIOS HU_014
 
    // USUARIOS HU_016
 
    // USUARIOS HU_018
 
    // USUARIOS HU_020
 
    // USUARIOS HU_022
 
    // USUARIOS HU_023
  },
  Usuarios: {
    id: (root) => {
      return root._id;
    },
  },
};
 
const start = async () => {
  const client = new MongoClient(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db(DB_NAME);
 
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const Usuarios = await getUserFromToken(req.headers.authorization, db);
      console.log(Usuarios);
      return {
        db,
        Usuarios,
      };
    },
  });
 
  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};
start();
 
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Query {
    misProyectos: [Proyectos!]!
    obtenerUsuarios: [Usuarios!]
    listarProyectos: [Proyectos!]
    listarProyectosLider: [Inscripciones!]
    obtenerInscripcionesLider: [Inscripciones!]
  }
 
  type Usuarios {
    id: ID!
    correo: String!
    identificacion_usuario: String!
    nombre_completo_usuario: String!
    contrasena: String!
    tipo_usuario: String!
    estado_registro: String!
  }
  type Proyectos {
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
  type Inscripciones {
    id: ID!
    id_inscripcion: String!
    identificacion_usuario: Int!
    id_proyecto: String!
    estado_inscripcion: String!
    fecha_ingreso: String!
    fecha_egreso: String
  }
  type Avances {
    id: ID!
    id_avance: String!
    identifiacion_usuario: Int!
    fecha_avance: String!
    descripcion_avance: String!
    observaciones_lider: String
  }
 
  type Mutation {
    signUp(input: signUpInput): AuthUser!
    signIn(input: signInInput): AuthUser!
    actualizarUsuario(input: signUpInput): Usuarios!
 
    aceptarUsuario(id: ID!, estado_registro: String!): Usuarios!
    estadoInscripcion(id: ID!, estado_inscripcion: String!): Inscripciones!
    estadoProyecto(id: ID!, estado_proyecto: String!): Proyectos!
    faseProyecto(id: ID!, fase_proyecto: String!): Proyectos!
  }
 
  input signUpInput {
    correo: String!
    identificacion_usuario: String!
    nombre_completo_usuario: String!
    contrasena: String!
    tipo_usuario: String!
  }
 
  input signInInput {
    correo: String!
    contrasena: String!
  }
 
  type AuthUser {
    Usuarios: Usuarios!
    token: String!
  }
`;