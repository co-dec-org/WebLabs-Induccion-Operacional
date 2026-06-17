export const modules = [
  {
    number: 1,
    title: 'Induccion operacional',
    subtitle: 'Sistema de Monitoreo Telematico - Ley 21.378',
    objective: 'Presentar la finalidad protectora del sistema y el rol de apoyo visual para operadores.',
    keyMessage:
      'La unidad protege a la victima y supervisa el cumplimiento de medidas cautelares mediante monitoreo territorial preventivo.',
    keywords: ['portada', 'monitoreo', 'victima', 'medida cautelar'],
  },
  {
    number: 2,
    title: 'Marco normativo y objetivo',
    subtitle: 'Base juridica y sentido preventivo del sistema',
    objective: 'Explicar Ley 21.378, Decreto N 19 y objetivo preventivo.',
    keyMessage: 'La tecnologia esta al servicio de la finalidad protectora de la medida.',
    keywords: ['ley 21.378', 'decreto 19', 'objetivo', 'prevencion'],
  },
  {
    number: 3,
    title: 'Marco juridico-operacional',
    subtitle: 'Relacion entre la ley, el reglamento y el protocolo',
    objective: 'Ordenar la relacion entre norma legal, reglamento y protocolo operacional.',
    keyMessage: 'La ley manda, el reglamento ordena y el protocolo operacionaliza.',
    keywords: ['ley', 'reglamento', 'protocolo', '9 protocolo'],
  },
  {
    number: 4,
    title: 'Principios operacionales',
    subtitle: 'Criterios que ordenan la toma de decisiones',
    objective:
      'Aplicar proteccion, finalidad, contexto, oportunidad, trazabilidad, gradualidad y objetividad.',
    keyMessage:
      'No todas las alarmas son iguales; todas se analizan segun riesgo, continuidad y contexto.',
    keywords: ['proteccion', 'contexto', 'trazabilidad', 'objetividad'],
  },
  {
    number: 5,
    title: 'Actores y coordinacion',
    subtitle: 'Visualizacion de datos y coordinacion interinstitucional',
    objective: 'Identificar Central, victima, PSC, CENCO, Carabineros, soporte tecnico y tribunal.',
    keyMessage:
      'La operacion integra visualizacion de datos, georreferenciacion y coordinacion interinstitucional.',
    keywords: ['central', 'psc', 'cenco', 'tribunal', 'carabineros'],
  },
  {
    number: 6,
    title: 'Conceptos criticos',
    subtitle: 'Terminos que el operador debe dominar',
    objective: 'Definir ultimo trazo valido, zona de exclusion, pre-exclusion, halo y triangulacion.',
    keyMessage: 'Siempre se analiza fecha, hora, continuidad, desplazamiento y contexto.',
    keywords: ['ultimo trazo valido', 'zona de exclusion', 'halo', 'triangulacion'],
  },
  {
    number: 7,
    title: 'Logica operacional general',
    subtitle: 'Secuencia base para el tratamiento de una alarma',
    objective: 'Verificar riesgo, clasificar evento, contactar, escalar y documentar.',
    keyMessage: 'Primero se comprende el evento; luego se decide la respuesta.',
    keywords: ['verificar', 'clasificar', 'contactar', 'escalar', 'documentar'],
  },
  {
    number: 8,
    title: 'Alarmas tecnicas',
    subtitle: 'Eventos orientados a continuidad operativa y soporte',
    objective: 'Agrupar eventos de energia, senal, ubicacion, integridad fisica y perifericos.',
    keyMessage: 'Estas alarmas pueden escalar si afectan la capacidad de proteccion.',
    keywords: ['bateria', 'gps', 'senal', 'beacon', 'correa'],
  },
  {
    number: 9,
    title: 'Alarmas de riesgo y mixtas',
    subtitle: 'Eventos que pueden comprometer directamente la proteccion',
    objective: 'Distinguir proximidad, violacion de area, SOS y eventos mixtos con contexto critico.',
    keyMessage: 'La gravedad depende de la cercania, la continuidad y el contexto.',
    keywords: ['proximidad', 'exclusion', 'sos', 'riesgo', 'mixta'],
  },
  {
    number: 10,
    title: 'CENCO y contacto telefonico',
    subtitle: 'Escalamiento policial preventivo y comunicacion segura',
    objective: 'Ordenar contacto con victima, CENCO y PSC cuando corresponda.',
    keyMessage: 'La comunicacion debe ser calmada, segura, objetiva y trazable.',
    keywords: ['cenco', 'victima', 'psc', 'telefono', 'contacto'],
  },
  {
    number: 11,
    title: 'Activacion CENCO',
    subtitle: 'Cuando escalar y como comunicar',
    objective: 'Definir criterios de escalamiento y medidas basicas de resguardo.',
    keyMessage: 'El escalamiento procede cuando el riesgo o la perdida de control lo justifican.',
    keywords: ['cenco', 'resguardo', 'escalar', 'riesgo', 'medidas'],
  },
  {
    number: 12,
    title: 'Tribunal y documentacion',
    subtitle: 'La dimension juridica de la operacion diaria',
    objective: 'Reforzar documentacion obligatoria, objetividad y consistencia de informes.',
    keyMessage: 'Lo no registrado, no existe operativamente.',
    keywords: ['tribunal', 'documentacion', 'tracker', 'ift', 'bitacora'],
  },
  {
    number: 13,
    title: 'Criterios del operador',
    subtitle: 'Como debe pensar y actuar el operador',
    objective: 'Promover verificacion, lectura de trazos, contexto y escalamiento proporcional.',
    keyMessage: 'Comprender el evento para decidir la respuesta mas pertinente.',
    keywords: ['operador', 'distancia', 'trazos', 'contexto', 'escalamiento'],
  },
  {
    number: 14,
    title: 'Rol hibrido de la unidad',
    subtitle: 'Tecnologia, operacion y derecho al servicio de la proteccion',
    objective: 'Integrar evidencia tecnica, decision operativa y finalidad juridica.',
    keyMessage:
      'La unidad integra evidencia tecnica, decision operativa y finalidad juridica para proteger a la victima.',
    keywords: ['tecnologia', 'operacion', 'derecho', 'evidencia', 'proteccion'],
  },
];

export const templates = [
  {
    title: 'Registro minimo de alarma',
    category: 'Documentacion',
    body:
      'Se verifica tipo de alarma, fecha, hora, ultimo trazo valido, distancia entre victima y PSC, continuidad de senal y contexto operacional. Se deja registro en sistema y se mantiene seguimiento segun protocolo.',
  },
  {
    title: 'Contacto con victima sin respuesta',
    category: 'Contacto',
    body:
      'Se intenta contacto telefonico con la victima en numeros disponibles, sin respuesta. Se verifica ultimo trazo valido y contexto de riesgo. Se mantiene monitoreo y se evalua escalamiento segun continuidad, cercania y tipo de alarma.',
  },
  {
    title: 'Activacion CENCO preventiva',
    category: 'CENCO',
    body:
      'Por evento con riesgo de proximidad/exclusion o perdida de control operacional, se informa a CENCO con antecedentes objetivos disponibles: tipo de alarma, hora, ubicacion referencial autorizada, estado de contacto y medidas de resguardo indicadas.',
  },
  {
    title: 'Cierre operacional sin riesgo observado',
    category: 'Cierre',
    body:
      'Se revisan trazos, distancia, continuidad y contexto. No se observan antecedentes actuales de riesgo inmediato. Se registra actuacion y se mantiene monitoreo regular.',
  },
];

