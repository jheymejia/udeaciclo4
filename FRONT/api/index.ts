const API = {
  getSomething: async (): Promise<any> => {
    const request = new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = [{
          id: 'asdasdasd1',
          id_proyecto: '6e42',
          nombre_proyecto: 'Investigación sobre el efecto de las fracturas sobre la permeabilidad de las formaciones geológicas no convencionales',
          objetivo_general: 'Investigar sobre los factores incidentes',
          objetivos_especificos: ['1.caracterizar', '2.Recomendar', '3.Desarrollar'],
          presupuesto: '6000000',
          fecha_inicio: '2021-10-12',
          fecha_terminacion_proyecto: '2022-06-30',
          identificacion_usuario: '1128054970',
          nombre_completo_usuario: 'Cristian Alberto Ariza Garcia',
          estado_proyecto: 'activo',
          fase_proyecto: 'Inicial',
        },
        {
          id: 'asdasdasd2',
          id_proyecto: '6e42',
          nombre_proyecto: 'Investigación sobre el efecto de las fracturas sobre la permeabilidad de las formaciones geológicas no convencionales',
          objetivo_general: 'Investigar sobre los factores incidentes',
          objetivos_especificos: ['1.caracterizar', '2.Recomendar', '3.Desarrollar'],
          presupuesto: '6000000',
          fecha_inicio: '2021-10-12',
          fecha_terminacion_proyecto: '2022-06-30',
          identificacion_usuario: '1128054970',
          nombre_completo_usuario: 'Cristian Alberto Ariza Garcia',
          estado_proyecto: 'activo',
          fase_proyecto: 'Inicial',
        },
        {
          id: 'asdasdasd3',
          id_proyecto: '6e42',
          nombre_proyecto: 'Investigación sobre el efecto de las fracturas sobre la permeabilidad de las formaciones geológicas no convencionales',
          objetivo_general: 'Investigar sobre los factores incidentes',
          objetivos_especificos: ['1.caracterizar', '2.Recomendar', '3.Desarrollar'],
          presupuesto: '6000000',
          fecha_inicio: '2021-10-12',
          fecha_terminacion_proyecto: '2022-06-30',
          identificacion_usuario: '1128054970',
          nombre_completo_usuario: 'Cristian Alberto Ariza Garcia',
          estado_proyecto: 'activo',
          fase_proyecto: 'Inicial',
        }
        ];
        resolve(data);
      }, 300);
    });
    return request;
  }
};

export default API;
