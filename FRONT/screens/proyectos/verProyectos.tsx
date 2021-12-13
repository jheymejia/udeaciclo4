import React, { Fragment, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import API from '../../api';

import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import ProjectsList from './ProjectList';

export default function VerProyectos({ navigation }: RootTabScreenProps<'VerProyectos'>) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    const apiData = await API.getSomething();
    setData(apiData);
  }

  const navigateToCreate = () => {
    navigation.navigate('RegistrarProyecto');
  }

  return (
    <View style={styles.container}>
      {true ? (
        <div style={{ display: 'flex', width: '100%', height: '60px', alignItems: 'center', justifyContent: 'right', padding: '10px', boxSizing: 'border-box' }}>
          <Pressable onPress={navigateToCreate} style={styles.createButton}><Text>Crear Proyecto</Text></Pressable>
        </div>
      ) : null}
      {data.length > 0 ? (
        <ScrollView style={styles.scrollView}>
          <ProjectsList projects={data} />
        </ScrollView>
      ) : (
        <>
          <Text style={styles.title}>No hay datos</Text>
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        </>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    backgroundColor: '#2c3ee2',
    borderRadius: 5,
    padding: 5,
  },
  scrollView: {
    flex: 1,
    width: '100%',
    padding: 15,
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
