import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import DatePicker from "react-datepicker";

import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import "react-datepicker/dist/react-datepicker.css";

export default function RegistrarProyecto({ navigation }: RootTabScreenProps<'RegistrarProyecto'>) {
  const [idProyecto, setIdProyecto] = useState('');
  const [nombreProyecto, setNombreProyecto] = useState('');
  const [objetivoProyecto, setObjetivoProyecto] = useState('');
  const [presupuestoProyecto, setPresupuestoProyecto] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const saveProject = () => {
    const data = {
      id_proyecto: idProyecto,
      nombre_proyecto: nombreProyecto,
      objetivo_proyecto: objetivoProyecto,
      presupuesto: presupuestoProyecto,
      fecha_inicio: startDate,
    };
    console.log(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <TextInput
          style={{ height: 40, backgroundColor: 'white', marginBottom: 10, borderRadius: 10 }}
          placeholder="Id del Proyecto"
          onChangeText={text => setIdProyecto(text)}
          defaultValue={idProyecto}
        />
        <TextInput
          style={{ height: 40, backgroundColor: 'white', marginBottom: 10, borderRadius: 10 }}
          placeholder="Nombre del Proyecto"
          onChangeText={text => setNombreProyecto(text)}
          defaultValue={nombreProyecto}
        />
        <TextInput
          style={{ height: 40, backgroundColor: 'white', marginBottom: 10, borderRadius: 10 }}
          placeholder="Objetivo del Proyecto"
          onChangeText={text => setObjetivoProyecto(text)}
          defaultValue={objetivoProyecto}
        />
        <TextInput
          keyboardType='numeric'
          style={{ height: 40, backgroundColor: 'white', marginBottom: 10, borderRadius: 10 }}
          placeholder="Presupuesto del Proyecto"
          onChangeText={(text) => setPresupuestoProyecto(Number(text))}
          defaultValue={presupuestoProyecto}
        />
        <DatePicker placeholderText='Fecha de Inicio' selected={startDate} onChange={(date) => setStartDate(date)} />
        <DatePicker placeholderText='Fecha de Fin' selected={endDate} onChange={(date) => setEndDate(date)} />
        <div style={{ display: 'flex', width: '100%', height: '60px', alignItems: 'center', justifyContent: 'right', padding: '10px', boxSizing: 'border-box', borderRadius: 10}}>
          <Pressable onPress={saveProject} style={styles.saveButton}><Text>Crear Proyecto</Text></Pressable>
        </div>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    display: 'flex',
    width: '35%',
    borderColor: '#B2FF59',
    borderRadius: 15,
    borderStyle: 'solid',
    borderWidth: 0,
    padding: 50,
    backgroundColor: '#1A237E',
  },
  saveButton: {
    backgroundColor: '#B2FF59',
    borderRadius: 5,
    padding: 5,
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
