import React from 'react';
import { Pressable } from 'react-native';
import { Text } from '../../../components/Themed';

const ActionsLider = ({id}) => { 
  // const navigateToCreate = () => {
  //   navigation.navigate('VerDetalles'); //poner el proud que viene desde el ver proyectos desde la lista y luego lo paso a las acciones
  // }
  return(
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Pressable>
      <Text>Editar</Text>
    </Pressable>
    <Pressable>
      <Text>Ver Detalles</Text>
    </Pressable>
  </div>
)};

const ActionsEstudiante = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Pressable>
      <Text>Solicitar Inscripción</Text>
    </Pressable>
  </div>
);

const ActionsAdmin = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Pressable>
      <Text>Aprobar</Text>
      <Text>Rechazar</Text>
    </Pressable>
  </div>
);

const Actions = ({ tipoUsuario }: { tipoUsuario: string }) => {
  switch (tipoUsuario) {
    case 'lider':
      return <ActionsLider />;
    case 'administrador':
      return <ActionsAdmin />
    case 'estudiante':
      return <ActionsEstudiante />
    default:
      return null;
  }
};

export default Actions;
