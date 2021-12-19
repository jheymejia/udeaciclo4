import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { useState } from 'react';
import { ActivityIndicator, Alert, Picker, Pressable, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import { useMutation, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';



const SIGN_UP_MUTATION = gql`
mutation singUp(
  $correo: String!
  $identificacion_usuario: String!
  $nombre_completo_usuario: String!
  $contrasena: String!
  $tipo_usuario: String!
) {
  signUp(
    input: {
      correo: $correo
      identificacion_usuario: $identificacion_usuario
      nombre_completo_usuario: $nombre_completo_usuario
      contrasena: $contrasena
      tipo_usuario: $tipo_usuario
    }
  ) {
    token
    Usuarios {
      id
      nombre_completo_usuario
    }
  }
}
`;

const SignUpScreen = () => {
  const [correo, setCorreo] = useState("")
  const [nombre_completo_usuario, setNombre] = useState("")
  const [identificacion_usuario, setIdentificacion] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [tipo_usuario, setRol] = useState("");
  const navegation = useNavigation();

  // mutation[0] : A function to trigger the mutation
  // mutation[1] : result object 
  //    { data,error, loading }
  const [signUp, { data, error, loading }] = useMutation(SIGN_UP_MUTATION);
  if (error) {
    Alert.alert('Error registrandose, por favor intente de nuevo')
  }

  {/*if (data){
    AsyncStorage.setItem("token",data.signUp.token)
    .then(()=>{
      AsyncStorage.setItem("rol",data.signUp.rol)
      if (data.signUp.rol=="Estudiante"){
        navegation.navigate("Home")
      }
    })
  }*/}

  if (data) {
    AsyncStorage.setItem('token', data.signUp.token)
      .then(() => {
        navegation.navigate("Home");
      })
  }

  const onSubmit = () => {
    signUp({ variables: { correo, identificacion_usuario, nombre_completo_usuario, contrasena, tipo_usuario } })
  }


  return (
    <View style={{ padding: 20, backgroundColor: "#90a4ae", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
     <Text style={{
          alignSelf:"center",
          fontSize:25,
          fontWeight:"bold",
          margin: "2rem 0",
          color: "rgb(49, 54, 64)",
          paddingTop: 32,
          paddingBottom: 32,
      }}>Regístrese</Text>

      <TextInput
        placeholder="Nombre Completo"
        value={nombre_completo_usuario}
        onChangeText={setNombre}
        style={{
          backgroundColor: "white",
          padding: 10,
          borderColor: "1px solid #777",
          borderRadius: 10,
           fontSize: 18,
           width: '50%',
           marginVertical: 10
        }}
      />

      <TextInput
        placeholder="Identificacion"
        value={identificacion_usuario}
        onChangeText={setIdentificacion}
        style={{
          backgroundColor: "white",
          padding: 10,
          borderColor: "1px solid #777",
          borderRadius: 10,
           fontSize: 18,
           width: '50%',
           marginVertical: 10
        }}
      />


      <TextInput
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
        style={{
          backgroundColor: "white",
          padding: 10,
          borderColor: "1px solid #777",
          borderRadius: 10,
           fontSize: 18,
           width: '50%',
           marginVertical: 10
        }}

      />

      <TextInput
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
        style={{
        backgroundColor: "white",
        padding: 10,
        borderColor: "1px solid #777",
        borderRadius: 10,
         fontSize: 18,
         width: '50%',
         marginVertical: 10
      }}
      />

      <Picker
        selectedValue={tipo_usuario}
        style={{
          backgroundColor: "white",
          padding: 10,
          borderColor: "1px solid #777",
          borderRadius: 10,
           fontSize: 18,
           width: '50%',
           marginVertical: 10
        }}
        onValueChange={(itemValue, itemIndex) => setRol(itemValue)}
      >
        <Picker.Item label="Estudiante" value="Estudiante" />
        <Picker.Item label="Administrador" value="Administrador" />
        <Picker.Item label="Lider" value="Lider" />

      </Picker>

      <Pressable
        onPress={onSubmit}
        style={{
          backgroundColor: '#313640',
          height: 50,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: "center",
          marginTop: 30,
          width: '50%',
          marginHorizontal: "25%",
        }}
      >
        {loading && <ActivityIndicator />}
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "bold"
          }} >
          Registrarse
        </Text>
      </Pressable>

      <Pressable
        onPress={() => navegation.navigate("SignIn")}
        style={{
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 30,
          width: '50%',
          marginHorizontal: "25%",
        }}>
        <Text
          style={{
            color: "#313640",
            fontSize: 18,
            fontWeight: "bold"
          }}>
          Ya tienes cuenta? Inicia Sesión Aquí
        </Text>

      </Pressable>

    </View>
  );


}

export default SignUpScreen