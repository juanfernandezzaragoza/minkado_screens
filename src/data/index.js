import movementsData from './json/movements.json';
import usersData from './json/users.json';
import minkasData from './json/minkas.json';
import actionsData from './json/actions.json';
import reportsData from './json/reports.json';
import pactsData from './json/pacts.json';

// Export all data arrays (same as mockData.js had)
export const mockMovements = movementsData.movements;
export const mockUsers = usersData.users;
export const mockMinkas = minkasData.minkas;
export const mockActions = actionsData.actions;
export const mockActionDetails = actionsData.actionDetails;
export const mockReports = reportsData.reports;
export const mockPacts = pactsData.pacts;
export const mockUserMinkas = usersData.userMinkas;

// Helper functions (same as mockData.js had)
export const getUsers = () => mockUsers;
export const getActions = () => mockActions;
export const getReports = () => mockReports;
export const getMinkas = () => mockMinkas;

export const getUserById = (id) => mockUsers.find(user => user.id === id);
export const getActionById = (id) => mockActions.find(action => action.id === id);
export const getReportById = (id) => mockReports.find(report => report.id === id);
export const getMinkaById = (id) => mockMinkas.find(minka => minka.id === id);

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
    action.nombre.toLowerCase().includes(lowQuery) ||
    action.resumen.toLowerCase().includes(lowQuery)
  );
};

export const getUserMinkas = (userId) => {
  const userMinkaIds = mockUserMinkas[userId] || [];
  return mockMinkas.filter(minka => userMinkaIds.includes(minka.id));
};

export const getMinkaActions = (minkaId) => {
  const minka = getMinkaById(minkaId);
  if (!minka || !minka.actions) return [];
  return minka.actions.map(actionId => mockActionDetails[actionId]).filter(Boolean);
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

// Additional exports for compatibility with existing code
export { mockUsers as users };
export { mockActions as actions };
export { mockReports as reports };
export { mockMinkas as minkas };
export { mockMovements as movements };
export { mockPacts as pacts };

// Default export for convenience
export default {
  users: mockUsers,
  actions: mockActions,
  reports: mockReports,
  minkas: mockMinkas,
  movements: mockMovements,
  pacts: mockPacts,
  userMinkas: mockUserMinkas,
  actionDetails: mockActionDetails,
  // Functions
  getUserById,
  getActionById,
  getReportById,
  getMinkaById,
  searchUsers,
  searchActions,
  getUserMinkas,
  getMinkaActions,
  getSubMinkas,
  saveAction,
  saveReport,
  validateReport
};