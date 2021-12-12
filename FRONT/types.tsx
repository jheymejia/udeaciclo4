/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;  
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  //General
  Inicio: undefined;
  SignUp: undefined;
  SignIn: undefined;

  //Usuarios
  ActualizarEstado: undefined;
  ActualizarPerfil: undefined;

  //Proyectos
  VerProyectos: undefined;
  verDetallesProyecto: undefined;
  RegistrarProyecto: undefined;
  ActualizarProyecto: undefined;


  //Inscripciones
  CrearInscripcion: undefined;
  VerInscripciones: undefined;
  ActualizarEstadoInscripciones: undefined;

  //Avances
  CrearAvance: undefined;
  VerAvances: undefined;
  ActualizarAvances: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
