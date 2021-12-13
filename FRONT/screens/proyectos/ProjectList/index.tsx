import React from 'react';
import ProjectListItem from './ProjectListItem';
import { ProjectListItemType } from '../interfaces/ProjectListItemType';
import { Text, useThemeColor } from '../../../components/Themed';

interface ProjectsListProps {
  projects: Array<ProjectListItemType>;
}

const ProjectsList = ({ projects }: ProjectsListProps) => {
  return (
    <table>
      <thead>
        <tr>
        <td><Text>Id</Text></td>
        <td><Text>Id Proyecto</Text></td>
        <td><Text>Nombre</Text></td>
        <td><Text>Obj. General</Text></td>
        <td><Text>Fase</Text></td>
        <td><Text>Creado Por</Text></td>
        <td><Text>Estado</Text></td>
        <td><Text>Acciones</Text></td>
        </tr>
      </thead>
      <tbody>
        {projects.map(({
          id, id_proyecto, nombre_proyecto,
          objetivo_general, fase_proyecto, nombre_completo_usuario,
          estado_proyecto,
        }) => (
          <ProjectListItem
            key={id}
            id={id}
            id_proyecto={id_proyecto}
            nombre_proyecto={nombre_proyecto}
            objetivo_general={objetivo_general}
            fase_proyecto={fase_proyecto}
            nombre_completo_usuario={nombre_completo_usuario}
            estado_proyecto={estado_proyecto}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ProjectsList;
