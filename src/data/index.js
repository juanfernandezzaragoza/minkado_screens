import movementsData from './json/movements.json';
import usersData from './json/users.json';
import minkasData from './json/minkas.json';
import actionsData from './json/actions.json';
import valuationsData from './json/valuations.json';
import reportsData from './json/reports.json';
import pactsData from './json/pacts.json';
import recentCasesData from './json/recentCases.json';

// Export all data arrays
export const mockMovements = movementsData.movements;
export const mockUsers = usersData.users;
export const mockMinkas = minkasData.minkas;
export const mockActions = actionsData.actions;
export const mockValuations = valuationsData.valuations;
export const mockReports = reportsData.reports;
export const mockPacts = pactsData.pacts;
export const mockUserMinkas = usersData.userMinkas;
export const mockRecentCases = recentCasesData.recentCases;

// Helper functions
export const getUsers = () => mockUsers;
export const getActions = () => mockActions;
export const getReports = () => mockReports;
export const getMinkas = () => mockMinkas;
export const getValuations = () => mockValuations;

export const getUserById = (id) => mockUsers.find(user => user.id === id);
export const getActionById = (id) => mockActions.find(action => action.id === id);
export const getReportById = (id) => mockReports.find(report => report.id === id);
export const getMinkaById = (id) => mockMinkas.find(minka => minka.id === id);

// Get recent cases for an action
export const getRecentCases = (actionId) => {
  return mockRecentCases[actionId] || [];
};

// Get valuations for a specific minka
export const getMinkaValuations = (minkaId) => {
  return mockValuations[minkaId] || [];
};

// Get a specific valuation for an action by a minka
export const getActionValuation = (minkaId, actionId) => {
  const minkaValuations = getMinkaValuations(minkaId);
  return minkaValuations.find(v => v.actionId === actionId);
};

// Get actions with their valuations for a specific minka
export const getActionsWithValuations = (minkaId) => {
  const minkaValuations = getMinkaValuations(minkaId);
  return minkaValuations.map(valuation => {
    const action = getActionById(valuation.actionId);
    return {
      ...action,
      valuation: valuation
    };
  });
};

export const searchUsers = (query) => {
  if (!query) return [];
  const lowQuery = query.toLowerCase();
  return mockUsers.filter(user => 
    user.name.toLowerCase().includes(lowQuery) ||
    user.username.toLowerCase().includes(lowQuery)
  );
};

export const searchActions = (query) => {
  if (!query) return [];
  const lowQuery = query.toLowerCase();
  return mockActions.filter(action => 
    action.name.toLowerCase().includes(lowQuery) ||
    action.description.toLowerCase().includes(lowQuery)
  );
};

export const getUserMinkas = (userId) => {
  const userMinkaIds = mockUserMinkas[userId] || [];
  return mockMinkas.filter(minka => userMinkaIds.includes(minka.id));
};

export const getMinkaActions = (minkaId) => {
  // Return actions with their valuations for this minka
  return getActionsWithValuations(minkaId);
};

export const getSubMinkas = (minkaId) => {
  const minka = getMinkaById(minkaId);
  if (!minka || !minka.subMinkas) return [];
  return mockMinkas.filter(m => minka.subMinkas.includes(m.id));
};

// Save functions (these modify the in-memory data)
export const saveAction = (actionData) => {
  const newAction = {
    ...actionData,
    id: `action-${Date.now()}`,
    name: actionData.nombre,
    description: actionData.resumen,
    icon: 'FileText',
    createdAt: new Date().toISOString(),
    createdBy: 'juan.mk'
  };
  mockActions.push(newAction);
  return newAction;
};

export const saveReport = (reportData) => {
  const newReport = {
    ...reportData,
    id: `report-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    validationReward: '₭50'
  };
  mockReports.push(newReport);
  return newReport;
};

export const validateReport = (reportId, isValid, validatorId) => {
  const report = getReportById(reportId);
  if (report) {
    report.status = isValid ? 'validated' : 'rejected';
    report.validatedBy = validatorId;
    report.validatedAt = new Date().toISOString();
  }
  return report;
};

// Save new valuation for a minka
export const saveValuation = (minkaId, actionId, valuationData) => {
  if (!mockValuations[minkaId]) {
    mockValuations[minkaId] = [];
  }
  
  // Remove existing valuation for this action if it exists
  mockValuations[minkaId] = mockValuations[minkaId].filter(v => v.actionId !== actionId);
  
  // Add new valuation
  const newValuation = {
    actionId,
    associatedMinka: valuationData.associatedMinka,
    complement: valuationData.complement || false,
    value: valuationData.value,
    medianValue: valuationData.value, // For now, set median same as value
    totalImpact: valuationData.totalImpact,
    userValue: valuationData.value
  };
  
  mockValuations[minkaId].push(newValuation);
  return newValuation;
};

// Additional exports for compatibility with existing code
export { mockUsers as users };
export { mockActions as actions };
export { mockReports as reports };
export { mockMinkas as minkas };
export { mockMovements as movements };
export { mockPacts as pacts };
export { mockValuations as valuations };
export { mockRecentCases as recentCases };

// Default export for convenience
export default {
  users: mockUsers,
  actions: mockActions,
  reports: mockReports,
  minkas: mockMinkas,
  movements: mockMovements,
  pacts: mockPacts,
  valuations: mockValuations,
  userMinkas: mockUserMinkas,
  recentCases: mockRecentCases,
  // Functions
  getUserById,
  getActionById,
  getReportById,
  getMinkaById,
  getMinkaValuations,
  getActionValuation,
  getActionsWithValuations,
  searchUsers,
  searchActions,
  getUserMinkas,
  getMinkaActions,
  getSubMinkas,
  saveAction,
  saveReport,
  validateReport,
  saveValuation,
  getRecentCases
};