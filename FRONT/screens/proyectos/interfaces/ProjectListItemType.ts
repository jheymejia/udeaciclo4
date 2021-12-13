export interface ProjectListItemType {
  id: string;
  id_proyecto: string;
  nombre_proyecto: string;
  objetivo_general: string;
  objetivos_especificos: Array<string>;
  presupuesto: number;
  fecha_inicio: Date;
  fecha_terminacion_proyecto: Date;
  identificacion_usuario: string;
  nombre_completo_usuario: string;
  estado_proyecto: EstadosDelProyect;
  fase_proyecto: FasesDelProyect;
}

export type EstadosDelProyect = 'activo' | 'inactivo';
export type FasesDelProyect = 'En Espera' | 'En Desarrollo' | 'Terminado';
