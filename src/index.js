const { ApolloServer, gql } = require("apollo-server");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
dotenv.config();
const { DB_URI, DB_NAME, JWT_SECRET } = process.env;

//Verificación de Autenticación Por Token
const getToken = (Usuarios) =>
  jwt.sign({ id: Usuarios._id }, JWT_SECRET, { expiresIn: "30 days" }); //almacenando token desde el Usuarios id y la libreria jsonwebtoken

//Creación de Metodo getUsuariosFromToken para las mutaciones que lo requieren
const getUsuariosFromToken = async (token, db) => {
  if (!token) {
    return null;
  }
  const tokenData = jwt.verify(token, JWT_SECRET); //funcion de la libreria jsonwebtoken
  if (!tokenData?.id) {
    return null;
  }
  return await db.collection("Usuarios").findOne({ _id: ObjectId(tokenData.id) }); //busca el usuario con el _id igual al que reresa el ObjectId
};

//Resolvers
const resolvers = {
  //Query: {
  //misProyectos: () => []
  //},
  Query: {
    misProyectos: async (_, __, { db, Usuarios }) => {
      //Ver lista de tareas
      if (!Usuarios) {
        throw new Error("Error de Autenticación, por favor inicie Sesión");
      }
      return await db
        .collection("Proyectos") //busqueda
        .find({ UsuariosIds: Usuarios._id })
        .toArray();
    },

    getProyectos: async (_, { id }, { db, Usuarios }) => {
      //Ver tareas por ID
      if (!Usuarios) {
        throw new Error("Error de Autenticación tabla proyectos, por favor inicie Sesión");
      }
      return await db.collection("Proyectos").findOne({ _id: ObjectId(id) });
    },
  },

  //Mutationes
  Mutation: {
    signUp: async (root, { input }, { db }) => {
      //Registrarse
      const hashedcontrasena = bcrypt.hashSync(input.contrasena); //hasheamos la contraseña que viene desde el input
      const newUsuarios = {
        //Creamos al nuevo usuario
        ...input,
        contrasena: hashedcontrasena,
      };
      const result = await db.collection("Usuarios").insertOne(newUsuarios); //Funcion asincrona que puede recibir 3 argumentos y regresa un objeto
      return {
        //el esquema pide que se regrese un usuario cuando el proceso se haga bien, al igual que un token
        Usuarios: newUsuarios,
        token: getToken(newUsuarios),
      };
    },

    signIn: async (root, { input }, { db }) => {
      //Iniciar Sesión
      const Usuarios = await db.collection("Usuarios").findOne({ correo: input.correo }); //compara el correo en el input con los que estan en la collecion Usuarios
      const iscontrasenaCorrect =
        Usuarios && bcrypt.compareSync(input.contrasena, Usuarios.contrasena); //compara el hash del contrasena en el input con los que estan en la collecion Usuarios
      if (!Usuarios || !iscontrasenaCorrect) {
        //Verificamos si ambas respuestas son true
        throw new Error("Credenciales erroneas :("); //sino son true, lanzamos error
      }
      return {
        //si son true retornamos la información completa que hay del usuario en la collecion
        Usuarios,
        token: getToken(Usuarios), //asignamos un getToken al campo token
      };
    },

    createProyectos: async (root, { title }, { db, Usuarios }) => {
      //Registrar una tarea
      if (!Usuarios) {
        console.log("No esta autenticado, por favor inicie sesión.");
      } //Solo usuarios correctamente logueados lo pueden hacer
      const newProyectos = {
        //Creamos un nuevo documento de tipo tasklis que tenga: titulo, fecha de creacion y un arreglo con UsuariosId y nombre del usuario
        title,
        createdAt: new Date().toISOString(),
        UsuariosIds: [Usuarios._id], //Crea un arreglo donde se guardaran los ID de los usuarios relacionados
        UsuariosNames: [Usuarios.nombre], //Crea un arreglo donde se guardaran los Nombres de los usuarios relacionados
      };
      console.log("Tarea Creada Correctamente"); //mensaje de consola
      const result = await db.collection("Proyectos").insertOne(newProyectos); //guardar el documento en la coleccion corespondiente
      return newProyectos; //El metodo en los esquemas pide regresar un documento de tipo Proyectos
    },

    updateProyectos: async (_, { id, title }, { db, Usuarios }) => {
      //Actualizar una tarea, La funcion pide el id del objeto a eliminar y el titulo nuevo a asignar
      if (!Usuarios) {
        console.log("No esta autenticado, por favor inicie sesión.");
      } //Solo usuarios correctamente logueados lo pueden hacer
      const result = await db
        .collection("Proyectos") //La funcion pide el id del objeto a eliminar y el titulo nuevo a asignar
        .updateOne(
          {
            _id: ObjectId(id), //Se actualiza el documento que coincide en su id
          },
          {
            $set: { title }, //Se setea el nuevo titulo
          }
        ); //IMPORTANTE: Si nuestro proyecto necesita que mas campos sean editables, se deben establecer como argumentos y brindarselos a la funcion desde el front(apollo)
      //Si un campo no es editado, es decir, queda en blanco en el front, se puede establecer un if que evalue que si el campo esta en blanco entonces no se ejecuta el update
      console.log("Tarea Actualizada Correctamente");
      return await db.collection("Proyectos").findOne({ _id: ObjectId(id) }); //regresa los nuevos valores de la tarea editada
    },

    deleteProyectos: async (_, { id }, { db, Usuarios }) => {
      //Eliminar una tarea, mutacion pide el id de la tarea a eliminar
      if (!Usuarios) {
        console.log("No esta autenticado, por favor inicie sesión.");
      } //Solo usuarios correctamente logueados lo pueden hacer

      await db.collection("Proyectos").remove({ _id: ObjectId(id) }); //Se elimina la tarea que tiene el id ingresado en el imput
      console.log("Tarea Eliminada Correctamente");
      return true; //regresa booleano
    },

    addUsuariosToProyectos: async (_, { ProyectosId, UsuariosId }, { db, Usuarios }) => {
      if (!Usuarios) {
        console.log("No esta autenticado, por favor inicie sesión.");
      } //Solo usuarios correctamente logueados lo pueden hacer
      const Proyectos = await db
        .collection("Proyectos")
        .findOne({ _id: ObjectId(ProyectosId) });
      const usuario = await db
        .collection("Usuarios")
        .findOne({ _id: ObjectId(UsuariosId) });

      if (!Proyectos) {
        return null; //Cambiar respuesta a su gusto
      }

      if (
        Proyectos.UsuariosIds.find((dbId) => dbId.toString() === UsuariosId.toString())
      ) {
        return Proyectos; //Evitamos duplicidad verificando la existencia previa del usuario
      }
      await db.collection("Proyectos").updateOne(
        {
          //busca la Proyectos a actualizar
          _id: ObjectId(ProyectosId),
        },
        {
          $push: {
            UsuariosIds: ObjectId(UsuariosId), //empuja el objectid(UsuariosId) al arreglo UsuariosIds
            UsuariosNames: usuario.nombre, //empuja el nombre del usuario al arreglo Usuariosnames
          },
        }
      );
      Proyectos.UsuariosIds.push(ObjectId(UsuariosId)); //Confirmación
      Proyectos.UsuariosNames.push(usuario.nombre); //confirmación
      return Proyectos;
    },

    //ToDos (avances)
    createToDo: async (root, { content, ProyectosId }, { db, Usuarios }) => {
      if (!Usuarios) {
        console.log("No esta autenticado, por favor inicie sesión.");
      } //Solo usuarios correctamente logueados lo pueden hacer
      const newToDo = {
        content,
        ProyectosId: ObjectId(ProyectosId),
        isCompleted: false,
      };
      const result = await db.collection("ToDo").insertOne(newToDo);
      return newToDo;
    },

    updateToDo: async (_, data, { db, Usuarios }) => {
      if (!Usuarios) {
        console.log("No esta autenticado, por favor inicie sesión.");
      } //Solo usuarios correctamente logueados lo pueden hacer

      const result = await db.collection("ToDo").updateOne(
        { _id: ObjectId(data.id) },
        {
          $set: data,
        }
      );
      return await db.collection("ToDo").findOne({ _id: ObjectId(data.id) });
    },
    deleteToDo: async (_, { id }, { db, Usuarios }) => {
      //Eliminar una tarea, mutacion pide el id de la tarea a eliminar
      if (!Usuarios) {
        console.log("No esta autenticado, por favor inicie sesión.");
      } //Solo usuarios correctamente logueados lo pueden hacer
      await db.collection("ToDo").remove({ _id: ObjectId(id) }); //Se elimina la tarea que tiene el id ingresado en el imput
      console.log("ToDo Eliminada Correctamente");
      return true; //regresa booleano
    },
  },

  //Parametros inmutables del Usuarios
  Usuarios: {
    id: (root) => {
      return root._id;
    },
  },

  //Parametros inmutables de los Proyectos
  Proyectos: {
    id: ({ _id, id }) => _id || id, //id del objeto sera automaticamente el valor de _id
    progress: async ({ _id }, _, { db }) => {
      const todos = await db
        .collection("ToDo")
        .find({ ProyectosId: ObjectId(_id) })
        .toArray();
      const completed = todos.filter((todo) => todo.isCompleted);
      if (todos.length === 0) {
        return 0;
      }
      return (completed.length / todos.length) * 100;
    },

    Usuarioss: async ({ UsuariosIds }, _, { db }) =>
      Promise.all(
        //Función asincronica que se compromete a traer todos los usuarios relacionados con la Proyectos
        UsuariosIds.map(
          (UsuariosId) => db.collection("Usuarios").findOne({ _id: UsuariosId }) //Consulta usuarios por Id
        )
      ),
    todos: async ({ _id }, _, { db }) =>
      await db
        .collection("ToDo")
        .find({ ProyectosId: ObjectId(_id) })
        .toArray(),
  },

  //Parametros inmutables del Usuarios
  ToDo: {
    id: (root) => {
      return root._id;
    },
    Proyectos: async ({ ProyectosId }, _, { db }) =>
      await db.collection("Proyectos").findOne({ _id: ObjectId(ProyectosId) }),
  },
};

const start = async () => {
  //Iniciar Serviror
  const client = new MongoClient(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db(DB_NAME);

  const server = new ApolloServer({
    //Contextos del servidor(necesarios)
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const Usuarios = await getUsuariosFromToken(req.headers.authorization, db);
      //console.log(Usuarios)
      return {
        db, //base de datos como contexto
        Usuarios, //usuario autenticado como contexto
      };
    },
  });

  // Metodo listen, servidor iniciado
  server.listen().then(({ url }) => {
    console.log(`🚀  Servidor listo y corriendo en ${url}`);
  });
};
start(); //Arrancamos!

//Esquemas para GRAPHL vs MongoDB
const typeDefs = gql`
  type Query {
    misProyectos: [Proyectos!]!
    getProyectos(id: ID!): Proyectos
  }

  type Usuarios {
    id: ID!
    correo: String!
    identificacion_usuario: String!
    nombre_completo_usuario: String!
    contrasena: String!
    tipo_usuario: String!
  }

  type proyectos {
    id: ID!
    nombre: String!
    objGenerales: String!
    objEspecicos: String!
    prespuesto: String!
    fechain: String!
    fechafi: String!
    Usuarios: [Usuarios!]!
  }

  type Mutation {
    signUp(input: SignUpInput): AuthUsuarios!
    signIn(input: SignInInput): AuthUsuarios!

    createProyectos(title: String!): Proyectos!
    updateProyectos(id: ID!, title: String!): Proyectos!
    deleteProyectos(id: ID!): Boolean!
    addUsuariosToProyectos(ProyectosId: ID!, UsuariosId: ID!): Proyectos

    createToDo(content: String!, ProyectosId: ID!): ToDo!
    updateToDo(id: ID!, content: String, isCompleted: Boolean): ToDo!
    deleteToDo(id: ID!): Boolean!
  }

  input SignUpInput {
    correo: String!
    identificacion_usuario: String!
    nombre_completo_usuario: String!
    contrasena: String!
    tipo_usuario: String!
  }

  input SignInInput {
    correo: String!
    contrasena: String!
  }

  type AuthUsuarios {
    Usuarios: Usuarios!
    token: String!
  }

  type Proyectos {
    id: ID!
    createdAt: String!
    title: String!
    progress: Float!
    Usuarioss: [Usuarios!]!
    todos: [ToDo!]!
  }

  type ToDo {
    id: ID!
    content: String!
    isCompleted: Boolean!
    Proyectos: Proyectos!
  }
`;
