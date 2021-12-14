import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';

const MY_PROJECTS = gql`
query HU_013{
  obtenerProyectosLider{
    id_proyecto,
    nombre_proyecto,
    objetivo_general,
    objetivos_especificos,
    presupuesto,
    fecha_inicio,
    fecha_terminacion_proyecto,
    identificacion_usuario,
    nombre_completo_usuario,
    estado_proyecto,
    fase_proyecto
  }
}
`

export default function VerProyectos({ navigation }: RootTabScreenProps<'VerProyectos'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aqui se mostrará los proyectos</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
    </View>
  );
//}

// export default function ProjectsScreen() {
//   const navegation= useNavigation();
//   const logOut = async () => {
//     await AsyncStorage.removeItem('token');
//     navegation.navigate("SignIn")
//   }

//   const newProyect = async () =>{
//     navegation.navigate("NewProject")
//   }

//   const [project, setProjects] = useState([]);

//   const { data, error, loading } = useQuery(MY_PROJECTS)

//   useEffect(() => {
//     if (error) {
//       alert("Error Cargando los proyectos. Intenta de Nuevo")
//     }
//   }, [error]);

//   useEffect(() => {
//     if (data) {
//       setProjects(data.myTaskLists);
//     }
//   }, [data]);



  return (
    <View style={styles.container}>
      <Pressable
      onPress={logOut} 
      style={{
        backgroundColor:'#004080',
        height:50,
        borderRadius:5,
        alignItems:"center",
        justifyContent:"center",
        marginHorizontal:"85%",
        width:'15%',
        position:"absolute"

      }}>  
      <Text
        style={{
          color:"white",
          fontSize:18,
          fontWeight:"bold"
        }}>
          Cerrar Sesión
        </Text>
      </Pressable>
      <Text style={styles.title}>LISTA DE TAREAS/PROYECTOS</Text>
      <FlatList
        data={project}
        renderItem={({item}) => <><ProjectItem project={item} /></>}
        style={{ width: '100%' }}
      />
       <Pressable
      onPress={newProyect} 
      style={{
        backgroundColor:'#004080',
        height:50,
        borderRadius:5,
        alignItems:'center',
        justifyContent:"center",
        marginTop:30,
        width:'20%',
        marginHorizontal:"5%",
      }}>  
      <Text
        style={{
          color:"white",
          fontSize:18,
          fontWeight:"bold"
        }}>
          Insertar Nuevo Proyecto
        </Text>
      </Pressable>
      
    </View>

    

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
