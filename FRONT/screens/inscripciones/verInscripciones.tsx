import * as React from 'react';
import { StyleSheet } from 'react-native';


import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';

export default function VerInscripciones({ navigation }: RootTabScreenProps<'VerInscripciones'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aqui se mostrará las inscripciones registradas en la base de datos</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
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
    color: '#15168F'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
