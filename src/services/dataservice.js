// src/services/dataService.js
import { 
  mockUsers, 
  mockActions, 
  mockReports,
  mockMinkas,
  mockActionDetails,
  mockMovements,
  mockUserMinkas,
  searchUsers as mockSearchUsers,
  searchActions as mockSearchActions,
  getUserMinkas as mockGetUserMinkas,
  getMinkaActions as mockGetMinkaActions,
  getSubMinkas as mockGetSubMinkas,
  saveAction as mockSaveAction,
  saveReport as mockSaveReport,
  validateReport as mockValidateReport,
  getUserById,
  getActionById
} from '@/data';

class DataService {
  constructor(useMockData = true) {
    this.useMockData = useMockData;
    // In the future, initialize API client here
  }

  // Minka related methods
  async getMinkas() {
    if (this.useMockData) {
      return mockMinkas;
    }
    // return await api.get('/minkas');
  }

  async getMinka(minkaId) {
    if (this.useMockData) {
      return mockMinkas.find(m => m.id === minkaId);
    }
    // return await api.get(`/minkas/${minkaId}`);
  }

  async getUserMinkas(userId) {
    if (this.useMockData) {
      return mockGetUserMinkas(userId);
    }
    // return await api.get(`/users/${userId}/minkas`);
  }

  async getSubMinkas(minkaId) {
    if (this.useMockData) {
      return mockGetSubMinkas(minkaId);
    }
    // return await api.get(`/minkas/${minkaId}/subminkas`);
  }

  // Action related methods
  async getActions() {
    if (this.useMockData) {
      return mockActions;
    }
    // return await api.get('/actions');
  }

  async getAction(actionId) {
    if (this.useMockData) {
      // Return extended action details for action pages
      return mockActionDetails[actionId] || null;
    }
    // return await api.get(`/actions/${actionId}`);
  }

  async getMinkaActions(minkaId) {
    if (this.useMockData) {
      return mockGetMinkaActions(minkaId);
    }
    // return await api.get(`/minkas/${minkaId}/actions`);
  }

  async searchActions(query) {
    if (this.useMockData) {
      return mockSearchActions(query);
    }
    // return await api.get(`/actions/search?q=${query}`);
  }

  // User related methods
  async getUsers() {
    if (this.useMockData) {
      return mockUsers;
    }
    // return await api.get('/users');
  }

  async getUser(userId) {
    if (this.useMockData) {
      return mockUsers.find(u => u.id === userId);
    }
    // return await api.get(`/users/${userId}`);
  }

  async getCurrentUser() {
    if (this.useMockData) {
      // Hardcoded for now - Juan
      return {
        id: '1',
        name: 'Juan',
        username: 'juan.mk',
        balance: 26950.81,
        lastChange: 25
      };
    }
    // return await api.get('/users/me');
  }

  async searchUsers(query) {
    if (this.useMockData) {
      return mockSearchUsers(query);
    }
    // return await api.get(`/users/search?q=${query}`);
  }

  // Report related methods
  async getReports(filters = {}) {
    if (this.useMockData) {
      let reports = [...mockReports];
      
      if (filters.status) {
        reports = reports.filter(r => r.status === filters.status);
      }
      
      if (filters.actorId) {
        reports = reports.filter(r => r.actorId === filters.actorId);
      }
      
      return reports;
    }
    // return await api.get('/reports', { params: filters });
  }

  async createReport(reportData) {
    if (this.useMockData) {
      return mockSaveReport(reportData);
    }
    // return await api.post('/reports', reportData);
  }

  async validateReport(reportId, isValid, validatorId) {
    if (this.useMockData) {
      return mockValidateReport(reportId, isValid, validatorId);
    }
    // return await api.post(`/reports/${reportId}/validate`, { isValid, validatorId });
  }

  // Movement/Transaction methods
  async getUserMovements(userId) {
    if (this.useMockData) {
      return mockMovements.filter(m => m.userId === userId);
    }
    // return await api.get(`/users/${userId}/movements`);
  }

  // Action creation
  async saveAction(actionData) {
    if (this.useMockData) {
      return mockSaveAction(actionData);
    }
    // return await api.post('/actions', actionData);
  }

  // Pact related methods
  async createPact(pactData) {
    if (this.useMockData) {
      const newPact = {
        id: Date.now().toString(),
        ...pactData,
        status: 'proposed',
        createdAt: new Date().toISOString()
      };
      // In a real implementation, we would save this to the mock data
      return newPact;
    }
    // return await api.post('/pacts', pactData);
  }

  // Valuation methods
  async getActionValuations(actionId, minkaId) {
    if (this.useMockData) {
      // Mock implementation
      return {
        userValuation: 12,
        medianValuation: 10,
        totalImpact: 500,
        canModify: true
      };
    }
    // return await api.get(`/actions/${actionId}/valuations/${minkaId}`);
  }

  async submitValuation(actionId, minkaId, karmaValue) {
    if (this.useMockData) {
      return {
        success: true,
        newValuation: karmaValue
      };
    }
    // return await api.post(`/actions/${actionId}/valuations`, { minkaId, karmaValue });
  }

  // Transfer methods
  async createTransfer(transferData) {
    if (this.useMockData) {
      const toUser = getUserById(transferData.toUserId);
      const newMovement = {
        id: Date.now().toString(),
        userId: transferData.fromUserId,
        type: 'transfer',
        text: `₭${Math.abs(transferData.amount)} ${transferData.amount > 0 ? 'a' : 'para penalizar a'} ${toUser?.name || 'Usuario'}`,
        amount: Math.abs(transferData.amount),
        isPositive: false,
        scopeIcon: 'User',
        scopeLabel: 'Particular',
        reason: transferData.motivo,
        alignment: 'right',
        timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0],
        fromUserId: transferData.fromUserId,
        toUserId: transferData.toUserId
      };
      
      // Add to movements array
      mockMovements.push(newMovement);
      
      return {
        success: true,
        movement: newMovement
      };
    }
    // return await api.post('/transfers', transferData);
  }

  // Additional helper methods for specific screens
  async getActionWithDetails(actionId) {
    if (this.useMockData) {
      // This is used by ReportarActoScreen and ValorarAccionScreen
      const action = getActionById(actionId);
      const actionDetail = mockActionDetails[actionId];
      
      if (!action) return null;
      
      return {
        ...action,
        detalles: actionDetail?.fullDescription || `# ${action.nombre}\n\n${action.resumen}`
      };
    }
    // return await api.get(`/actions/${actionId}/full`);
  }

  // Mock data for CrearMinkaScreen
  async getUserMinkasForCreation(userId) {
    if (this.useMockData) {
      // Return minkas where user is member for selecting parent minka
      const userMinkas = await this.getUserMinkas(userId);
      return userMinkas.map(minka => ({
        id: minka.id,
        nombre: minka.name,
        miembros: minka.members
      }));
    }
    // return await api.get(`/users/${userId}/minkas/simple`);
  }

  // NEW METHODS FOR MISSING FUNCTIONALITY

  // Get individual users by ID (used by ValidarActoScreen)
  async getUserById(userId) {
    if (this.useMockData) {
      return getUserById(userId);
    }
    // return await api.get(`/users/${userId}`);
  }

  // Get individual actions by ID with basic info (used by ValidarActoScreen)  
  async getActionById(actionId) {
    if (this.useMockData) {
      return getActionById(actionId);
    }
    // return await api.get(`/actions/${actionId}/basic`);
  }

  // Get pending reports for validation (used by ValidarActoScreen)
  async getPendingReports() {
    if (this.useMockData) {
      return mockReports.filter(report => report.status === 'pending');
    }
    // return await api.get('/reports?status=pending');
  }

  // Get valoration data for specific action and minka (used by ValorarAccionScreen)
  async getValorationData(actionId, minkaId = null) {
    if (this.useMockData) {
      const action = getActionById(actionId);
      const actionDetail = mockActionDetails[actionId];
      
      if (!action) return null;

      // Mock valorando/afectada minka data
      const minkaValorando = minkaId ? 
        mockMinkas.find(m => m.id === minkaId) || { id: 'pescadores', name: 'Pescadores', members: 85 } :
        { id: 'pescadores', name: 'Pescadores', members: 85 };

      // For this example, assume same minka unless it's global
      const minkaAfectada = action.scope === 'global' ? 
        { id: 'global', name: 'Global', members: 10000 } : 
        minkaValorando;

      return {
        accion: {
          id: action.id,
          nombre: action.nombre,
          descripcion: actionDetail?.fullDescription || `# ${action.nombre}\n\n${action.resumen}`
        },
        minkaValorandoId: minkaValorando.id,
        minkaValorando: {
          id: minkaValorando.id,
          nombre: minkaValorando.name,
          miembros: minkaValorando.members
        },
        minkaAfectada: {
          id: minkaAfectada.id,
          nombre: minkaAfectada.name,
          miembros: minkaAfectada.members
        }
      };
    }
    // return await api.get(`/actions/${actionId}/valoration-data?minkaId=${minkaId}`);
  }

  // Submit karma valuation (used by ValorarAccionScreen)
  async submitKarmaValuation(valorationData) {
    if (this.useMockData) {
      // Mock implementation - in real app this would update the database
      console.log('Karma valuation submitted:', valorationData);
      return {
        success: true,
        message: 'Valoración guardada exitosamente'
      };
    }
    // return await api.post('/valuations', valorationData);
  }

  // Create new minka (used by CrearMinkaScreen)
  async createMinka(minkaData) {
    if (this.useMockData) {
      const newMinka = {
        id: `minka-${Date.now()}`,
        name: minkaData.nombre,
        description: minkaData.descripcion,
        icon: minkaData.icon,
        iconColor: minkaData.iconColor,
        parentId: minkaData.parentMinkaId,
        creatorId: minkaData.creatorId,
        members: 1, // Creator starts as first member
        balance: '₭ 0',
        isPositive: true,
        actions: [],
        subMinkas: [],
        createdAt: minkaData.createdAt
      };

      // Add to minkas array
      mockMinkas.push(newMinka);

      // Add creator to minka membership
      if (!mockUserMinkas[minkaData.creatorId]) {
        mockUserMinkas[minkaData.creatorId] = [];
      }
      mockUserMinkas[minkaData.creatorId].push(newMinka.id);

      // If there's a parent, add this as a sub-minka
      if (minkaData.parentMinkaId) {
        const parentMinka = mockMinkas.find(m => m.id === minkaData.parentMinkaId);
        if (parentMinka) {
          if (!parentMinka.subMinkas) {
            parentMinka.subMinkas = [];
          }
          parentMinka.subMinkas.push(newMinka.id);
        }
      }

      return {
        success: true,
        minka: newMinka,
        invitedUserIds: minkaData.invitedUserIds
      };
    }
    // return await api.post('/minkas', minkaData);
  }
}

// Export singleton instance
export const dataService = new DataService(true); // true = use mock data

// Export class for testing
export default DataService;