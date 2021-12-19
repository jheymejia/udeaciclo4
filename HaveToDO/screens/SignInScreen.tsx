import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import { useMutation, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SIGN_IN_MUTATION = gql`
mutation HU_002(  $correo: String!,   $contrasena: String! )
  {
  signIn(input: { correo:$correo,   contrasena:$contrasena}) 
  {
    token
    Usuarios {
      nombre_completo_usuario    
      contrasena  
    }       
  }
}

`;

const SignInScreen =() => {
  const [correo, setCorreo]=useState("")
  const [contrasena, setContrasena]=useState("")
  const navegation= useNavigation();

  const [signIn, { data, error, loading }] = useMutation(SIGN_IN_MUTATION);

  useEffect(() => {
    if (error) {
      alert("Credeciales login equivocadas, por favor intente de nuevo")
    }
  }, [error])

  if (data) {
    AsyncStorage.setItem('token', data.signIn.token)
      .then(() => {
        navegation.navigate("Home")
      })
  }

  const onSubmit = () => {
    signIn({ variables: { correo, contrasena }})
  }

  return (
    <View style={{padding:20, backgroundColor: "#90a4ae", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
      <Text style={{
          alignSelf:"center",
          fontSize:25,
          fontWeight:"bold",
          margin: "2rem 0",
          color: "rgb(49, 54, 64)",
          paddingTop: 32,
          paddingBottom: 32,
      }}>Bienvenido</Text>
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
         marginVertical: 25
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
       marginVertical: 25
    }}
    />

<Pressable
onPress={onSubmit} 
  style={{
    backgroundColor:'#313640',
    height:50,
    borderRadius:5,
    alignItems:'center',
    justifyContent:"center",
    marginTop:30,
    width:'50%',
    marginHorizontal:"25%",
  }}
  >
    <Text
      style={{
        color:"white",
        fontSize:18,
        fontWeight:"bold"
      }} >
        Ingresar
        </Text>
  </Pressable>

  <Pressable
  onPress={() => navegation.navigate("SignUp")}
    style={{
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginTop:30,
      width:'50%',
      marginHorizontal:"25%",
    }}>
      {loading && <ActivityIndicator />}
        <Text
        style={{
          color:"#313640",
          fontSize:18,
          fontWeight:"bold"
        }}>
          Nuevo? Registrese aquí!
        </Text>

    </Pressable>
    </View>
  );

  
}

export default SignInScreen;