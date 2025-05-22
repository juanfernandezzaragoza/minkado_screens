// src/data/mockData.js

// Mock Users Data
export const mockUsers = [
  { id: '1', name: 'Juan', username: 'juan.mk' },
  { id: '2', name: 'Vanna', username: 'vanna.pescadora' },
  { id: '3', name: 'Roberto', username: 'roberto.atun' },
  { id: '4', name: 'Rubén', username: 'ruben.musico' },
  { id: '5', name: 'Germán', username: 'german.mecanico' },
  { id: '6', name: 'María', username: 'maria.ambientalista' },
  { id: '7', name: 'Carlos', username: 'carlos.networkista' },
];

// Mock Actions Data
export const mockActions = [
  {
    id: '1',
    nombre: 'Emprender viaje',
    resumen: 'Salir de pesca con barco mediano a mar abierto',
    detalles: `# Emprender viaje de pesca

## Descripción
Esta acción consiste en organizar y emprender un viaje de pesca en mar abierto utilizando una embarcación mediana.

## Requisitos
- Embarcación pesquera de más de 8 metros
- Tripulación de 8 pescadores con experiencia
- Salir de Puerto Alegro o Río de La Plata

## Evidencia requerida
Para demostrar que esta acción sucedió, se necesita:
- Foto del barco saliendo del puerto
- Lista de tripulación firmada
- Coordenadas GPS del viaje
- Registro de pesca obtenida`,
    createdAt: '2025-01-15T10:00:00Z',
    createdBy: 'juan.mk'
  },
  {
    id: '2',
    nombre: 'Vender pescado',
    resumen: 'Comercializar la pesca del día en el mercado local',
    detalles: `# Venta de pescado

## Descripción
Comercialización de productos pesqueros frescos en mercados locales o puntos de venta autorizados.

## Condiciones
- Pescado debe ser fresco (menos de 24 horas)
- Cumplir con normativas sanitarias
- Registro de venta con comprobante

## Evidencia requerida
- Foto del puesto de venta
- Comprobantes de venta
- Certificado de frescura del producto`,
    createdAt: '2025-01-14T15:30:00Z',
    createdBy: 'vanna.pescadora'
  },
  {
    id: '3',
    nombre: 'Pescar trucha bebé',
    resumen: 'Perjudicar la sustentabilidad del ecosistema marino',
    detalles: `# Pesca de trucha bebé

## Descripción
Esta acción perjudicial consiste en pescar truchas de menos de 5 cm de largo, afectando gravemente la sustentabilidad del ecosistema acuático.

## Impacto negativo
- Reduce la población futura de truchas
- Afecta la cadena alimentaria
- Va contra las regulaciones pesqueras

## Evidencia requerida
Para reportar esta acción se necesita:
- Foto clara de las truchas pescadas con medida visible
- Ubicación GPS donde ocurrió la pesca
- Testigos presenciales si los hay
- Hora y fecha del incidente`,
    createdAt: '2025-01-13T09:15:00Z',
    createdBy: 'maria.ambientalista'
  }
];

// Mock Reports Data
export const mockReports = [
  {
    id: '1',
    actionId: '1', // Emprender viaje
    actorId: '1', // Juan
    reporterId: '2', // Vanna
    evidencia: `# Evidencia: Juan emprendió viaje de pesca

## Fecha y hora
10 de febrero de 2025, 11:36 AM

## Evidencia presentada
- **Foto del barco**: Embarcación "Mar Azul" saliendo del Puerto Alegro
- **Lista de tripulación**: 8 pescadores registrados y firmados
- **Coordenadas GPS**: Lat: -34.6118, Lng: -58.3960
- **Registro de pesca**: 300kg de pescado variado obtenido

## Testigos
- Capitán del puerto confirma la salida
- Otros pescadores presentes en el muelle

La evidencia es clara y cumple con todos los requisitos establecidos en la descripción de la acción.`,
    status: 'pending', // pending, validated, rejected
    createdAt: '2025-02-10T11:36:00Z',
    validationReward: '₭50'
  },
  {
    id: '2',
    actionId: '2', // Vender pescado
    actorId: '2', // Vanna
    reporterId: '3', // Roberto
    evidencia: `# Evidencia: Vanna vendió pescado

## Detalles de la venta
- **Fecha**: 11 de enero de 2025, 10:02 AM
- **Lugar**: Mercado Central de Puerto Alegro
- **Cantidad**: Aproximadamente 50kg de pescado fresco

## Evidencia
- Foto del puesto de venta con Vanna atendiendo
- Comprobantes de 3 ventas realizadas
- Certificado sanitario del pescado (menos de 12 horas de pesca)

## Observaciones
Todo el pescado se veía fresco y cumplía con las normativas. La venta fue exitosa y transparente.`,
    status: 'validated',
    createdAt: '2025-01-11T10:02:00Z',
    validationReward: '₭50',
    validatedBy: '4', // Rubén
    validatedAt: '2025-01-11T14:30:00Z'
  },
  {
  id: '3',
  actionId: '3', // Pescar trucha bebé
  actorId: '3', // Roberto
  reporterId: '2', // Vanna
  evidencia: `# Evidencia: Roberto pescó trucha bebé

## Fecha y hora
12 de febrero de 2025, 14:20 PM

## Ubicación
Río de La Plata, zona norte

## Evidencia presentada
- **Foto**: Roberto con una red llena de truchas muy pequeñas
- **Testigo**: Vi personalmente como pescaba truchas de menos de 3cm
- **Medición**: Las truchas medían entre 2-4cm de largo

## Descripción
Roberto estaba pescando sistemáticamente truchas bebé sin respetar las tallas mínimas.`,
  status: 'pending',
  createdAt: '2025-02-12T14:20:00Z',
  validationReward: '₭50'
},
{
  id: '4',
  actionId: '1', // Emprender viaje
  actorId: '5', // Germán
  reporterId: '6', // María
  evidencia: `# Evidencia: Germán emprendió viaje de pesca

## Fecha y hora
13 de febrero de 2025, 08:30 AM

## Evidencia presentada
- **Foto del barco**: Embarcación "Neptuno" saliendo del puerto
- **Lista de tripulación**: 8 pescadores confirmados
- **GPS**: Coordenadas registradas del viaje
- **Catch**: 150kg de pescado obtenido

## Testigos
El capitán del puerto confirmó la salida y el regreso exitoso.`,
  status: 'pending',
  createdAt: '2025-02-13T08:30:00Z',
  validationReward: '₭50'
}
];

// Data access functions
export const getUsers = () => mockUsers;
export const getActions = () => mockActions;
export const getReports = () => mockReports;

export const getUserById = (id) => mockUsers.find(user => user.id === id);
export const getActionById = (id) => mockActions.find(action => action.id === id);
export const getReportById = (id) => mockReports.find(report => report.id === id);

export const searchUsers = (query) => {
  if (!query) return mockUsers;
  return mockUsers.filter(user => 
    user.name.toLowerCase().includes(query.toLowerCase()) ||
    user.username.toLowerCase().includes(query.toLowerCase())
  );
};

export const searchActions = (query) => {
  if (!query) return mockActions;
  return mockActions.filter(action => 
    action.nombre.toLowerCase().includes(query.toLowerCase()) ||
    action.resumen.toLowerCase().includes(query.toLowerCase())
  );
};

// Save functions (using localStorage for now)
export const saveAction = (actionData) => {
  const actions = getActions();
  const newAction = {
    ...actionData,
    id: (actions.length + 1).toString(),
    createdAt: new Date().toISOString(),
    createdBy: 'juan.mk' // Current user
  };
  
  // In a real app, this would be an API call
  console.log('Saving action:', newAction);
  return newAction;
};

export const saveReport = (reportData) => {
  const reports = getReports();
  const newReport = {
    ...reportData,
    id: (reports.length + 1).toString(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    validationReward: '₭50'
  };
  
  console.log('Saving report:', newReport);
  return newReport;
};

export const validateReport = (reportId, isValid, validatorId) => {
  const report = getReportById(reportId);
  if (report) {
    report.status = isValid ? 'validated' : 'rejected';
    report.validatedBy = validatorId;
    report.validatedAt = new Date().toISOString();
    console.log('Report validated:', report);
  }
  return report;
};


