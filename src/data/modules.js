export const modules = [
  {
    number: 1,
    title: 'Inducción operacional',
    subtitle: 'Sistema de Monitoreo Telemático - Ley 21.378',
    objective: 'Presentar la finalidad protectora del sistema y el rol de apoyo visual para operadores.',
    keyMessage:
      'La unidad protege a la víctima y supervisa el cumplimiento de medidas cautelares mediante monitoreo territorial preventivo.',
    keywords: ['portada', 'monitoreo', 'víctima', 'medida cautelar'],
  },
  {
    number: 2,
    title: 'Marco normativo y objetivo',
    subtitle: 'Base jurídica y sentido preventivo del sistema',
    objective: 'Explicar Ley 21.378, Decreto N° 19 y objetivo preventivo.',
    keyMessage: 'La tecnología está al servicio de la finalidad protectora de la medida.',
    keywords: ['ley 21.378', 'decreto 19', 'objetivo', 'prevención'],
  },
  {
    number: 3,
    title: 'Marco jurídico-operacional',
    subtitle: 'Relación entre la ley, el reglamento y el protocolo',
    objective: 'Ordenar la relación entre norma legal, reglamento y protocolo operacional.',
    keyMessage: 'La ley manda, el reglamento ordena y el protocolo operacionaliza.',
    keywords: ['ley', 'reglamento', 'protocolo', '9 protocolo'],
  },
  {
    number: 4,
    title: 'Principios operacionales',
    subtitle: 'Criterios que ordenan la toma de decisiones',
    objective:
      'Aplicar protección, finalidad, contexto, oportunidad, trazabilidad, gradualidad y objetividad.',
    keyMessage:
      'No todas las alarmas son iguales; todas se analizan según riesgo, continuidad y contexto.',
    keywords: ['protección', 'contexto', 'trazabilidad', 'objetividad'],
  },
  {
    number: 5,
    title: 'Actores y coordinación',
    subtitle: 'Visualización de datos y coordinación interinstitucional',
    objective: 'Identificar Central, víctima, PSC, CENCO, Carabineros, soporte técnico y tribunal.',
    keyMessage:
      'La operación integra visualización de datos, georreferenciación y coordinación interinstitucional.',
    keywords: ['central', 'psc', 'cenco', 'tribunal', 'carabineros'],
  },
  {
    number: 6,
    title: 'Conceptos críticos',
    subtitle: 'Términos que el operador debe dominar',
    objective: 'Definir último trazo válido, zona de exclusión, pre-exclusión, halo y triangulación.',
    keyMessage: 'Siempre se analiza fecha, hora, continuidad, desplazamiento y contexto.',
    keywords: ['último trazo válido', 'zona de exclusión', 'halo', 'triangulación'],
  },
  {
    number: 7,
    title: 'Lógica operacional general',
    subtitle: 'Secuencia base para el tratamiento de una alarma',
    objective: 'Verificar riesgo, clasificar evento, contactar, escalar y documentar.',
    keyMessage: 'Primero se comprende el evento; luego se decide la respuesta.',
    keywords: ['verificar', 'clasificar', 'contactar', 'escalar', 'documentar'],
  },
  {
    number: 8,
    title: 'Alarmas técnicas',
    subtitle: 'Eventos orientados a continuidad operativa y soporte',
    objective: 'Agrupar eventos de energía, señal, ubicación, integridad física y periféricos.',
    keyMessage: 'Estas alarmas pueden escalar si afectan la capacidad de protección.',
    keywords: ['batería', 'gps', 'señal', 'beacon', 'correa'],
  },
  {
    number: 9,
    title: 'Alarmas de riesgo y mixtas',
    subtitle: 'Eventos que pueden comprometer directamente la protección',
    objective: 'Distinguir proximidad, violación de área, SOS y eventos mixtos con contexto crítico.',
    keyMessage: 'La gravedad depende de la cercanía, la continuidad y el contexto.',
    keywords: ['proximidad', 'exclusión', 'sos', 'riesgo', 'mixta'],
  },
  {
    number: 10,
    title: 'CENCO y contacto telefónico',
    subtitle: 'Escalamiento policial preventivo y comunicación segura',
    objective: 'Ordenar contacto con víctima, CENCO y PSC cuando corresponda.',
    keyMessage: 'La comunicación debe ser calmada, segura, objetiva y trazable.',
    keywords: ['cenco', 'víctima', 'psc', 'teléfono', 'contacto'],
  },
  {
    number: 11,
    title: 'Activación CENCO',
    subtitle: 'Cuándo escalar y cómo comunicar',
    objective: 'Definir criterios de escalamiento y medidas básicas de resguardo.',
    keyMessage: 'El escalamiento procede cuando el riesgo o la pérdida de control lo justifican.',
    keywords: ['cenco', 'resguardo', 'escalar', 'riesgo', 'medidas'],
  },
  {
    number: 12,
    title: 'Tribunal y documentación',
    subtitle: 'La dimensión jurídica de la operación diaria',
    objective: 'Reforzar documentación obligatoria, objetividad y consistencia de informes.',
    keyMessage: 'Lo no registrado, no existe operativamente.',
    keywords: ['tribunal', 'documentación', 'tracker', 'ift', 'bitácora'],
  },
  {
    number: 13,
    title: 'Criterios del operador',
    subtitle: 'Cómo debe pensar y actuar el operador',
    objective: 'Promover verificación, lectura de trazos, contexto y escalamiento proporcional.',
    keyMessage: 'Comprender el evento para decidir la respuesta más pertinente.',
    keywords: ['operador', 'distancia', 'trazos', 'contexto', 'escalamiento'],
  },
  {
    number: 14,
    title: 'Rol híbrido de la unidad',
    subtitle: 'Tecnología, operación y derecho al servicio de la protección',
    objective: 'Integrar evidencia técnica, decisión operativa y finalidad jurídica.',
    keyMessage:
      'La unidad integra evidencia técnica, decisión operativa y finalidad jurídica para proteger a la víctima.',
    keywords: ['tecnología', 'operación', 'derecho', 'evidencia', 'protección'],
  },
];

export const templates = [
  {
    title: 'Registro mínimo de alarma',
    category: 'Documentación',
    body:
      'Se verifica tipo de alarma, fecha, hora, último trazo válido, distancia entre víctima y PSC, continuidad de señal y contexto operacional. Se deja registro en sistema y se mantiene seguimiento según protocolo.',
  },
  {
    title: 'Contacto con víctima sin respuesta',
    category: 'Contacto',
    body:
      'Se intenta contacto telefónico con la víctima en números disponibles, sin respuesta. Se verifica último trazo válido y contexto de riesgo. Se mantiene monitoreo y se evalúa escalamiento según continuidad, cercanía y tipo de alarma.',
  },
  {
    title: 'Activación CENCO preventiva',
    category: 'CENCO',
    body:
      'Por evento con riesgo de proximidad/exclusión o pérdida de control operacional, se informa a CENCO con antecedentes objetivos disponibles: tipo de alarma, hora, ubicación referencial autorizada, estado de contacto y medidas de resguardo indicadas.',
  },
  {
    title: 'Cierre operacional sin riesgo observado',
    category: 'Cierre',
    body:
      'Se revisan trazos, distancia, continuidad y contexto. No se observan antecedentes actuales de riesgo inmediato. Se registra actuación y se mantiene monitoreo regular.',
  },
];
