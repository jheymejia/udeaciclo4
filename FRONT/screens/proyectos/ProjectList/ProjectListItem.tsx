import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text } from '../../../components/Themed';
import { ProjectListItemType } from '../interfaces/ProjectListItemType';
import Actions from './Actions';

const ProjectListItem = ({
  id, id_proyecto, nombre_proyecto,
  objetivo_general, fase_proyecto, nombre_completo_usuario,
  estado_proyecto,
}: ProjectListItemType) => {
  const tipoUsuario = 'estudiante';
  return (
    <tr style={styles.tableRow}>
      <td style={styles.tableData}><Text>{id}</Text></td>
      <td style={styles.tableData}><Text>{id_proyecto}</Text></td>
      <td style={styles.tableData}><Text>{nombre_proyecto}</Text></td>
      <td style={styles.tableData}><Text>{objetivo_general}</Text></td>
      <td style={styles.tableData}><Text>{fase_proyecto}</Text></td>
      <td style={styles.tableData}><Text>{nombre_completo_usuario}</Text></td>
      <td style={styles.tableData}><Text>{estado_proyecto}</Text></td>
      <td style={styles.tableData}>
        {<Actions tipoUsuario={tipoUsuario} />}
      </td>
    </tr>
  );
};

const styles = {
  tableRow: {
  },
  tableData: {
    padding: '10px',
    borderBottom: '1px solid #eee',
  }
};


export default ProjectListItem;
