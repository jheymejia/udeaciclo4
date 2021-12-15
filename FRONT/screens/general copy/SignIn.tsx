import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useMutation, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { RootTabScreenProps } from '../../types';


// export default function SignIn({ navigation }: RootTabScreenProps<'SignIn'>) {
  
const SIGN_IN_MUTATION = gql`
mutation signIn($correo:String!,$contrasena:String!){
  signIn(input: {
    correo:$correo,
    contrasena:$contrasena,
  }) {
    token
    Usuarios {
      id
      nombre_completo_usuario
    }
  }
}
`;
  
// Your ESLint configuration

const SignIn =() =>{
  const [correo, setCorreo] = useState("")
  const [contrasena, setContrasena] = useState("")
  const navegacion = useNavigation()
  
  const [signIn, { data, error, loading }] = useMutation(SIGN_IN_MUTATION);

  useEffect(() => {
    if (error) {
      alert("Credeciales equivocadas, por favor intente de nuevo")
    }
  }, [error])

  if (data) {
    AsyncStorage.setItem('token', data.signIn.token)
      .then(() => {
        navegacion.navigate("Inicio")
      })
  }

  const onSubmit = () => {
    signIn({ variables: { correo, contrasena } })
  }
  
  return (
    <View style={{ padding: 20 }}>
      <Text style={{
        alignSelf: "center",
        fontSize: 25,
        fontWeight: "bold"
      }}>Inicio de Sesión</Text>
      <TextInput
        placeholder="Email Aqui!"
        value={correo}
        onChangeText={setCorreo}
        style={{
          color: "gray",
          fontSize: 18,
          marginVertical: 25,
          width: '50%',
          marginHorizontal: "25%"
        }}

      />

      <TextInput
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
        style={{
          color: "gray",
          fontSize: 18,
          marginVertical: 25,
          width: '50%',
          marginHorizontal: "25%"
        }}
      />

      <Pressable
        onPress={onSubmit}
        style={{
          backgroundColor: '#004080',
          height: 50,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: "center",
          marginTop: 30,
          width: '50%',
          marginHorizontal: "25%",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "bold"
          }} >
          Iniciar Sesión
        </Text>
      </Pressable>

      <Pressable
        onPress={() => navegacion.navigate("SignUp")}
        style={{
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 30,
          width: '50%',
          marginHorizontal: "25%",
        }}>
        {loading && <ActivityIndicator />}
        <Text
          style={{
            color: "#004080",
            fontSize: 18,
            fontWeight: "bold"
          }}>
          Nuevo? Registrese aquí!
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

export default SignIn;