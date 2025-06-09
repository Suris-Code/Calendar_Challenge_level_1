export interface DashboardStatistics {
  // This should match the response from the server
  // Will be filled based on the actual response
  [key: string]: any;
}

export interface DayEventInfo {
  date: string;
  eventCount: number;
}

export interface DayHoursInfo {
  date: string;
  totalHours: number;
}

export interface DailyOccupancy {
  date: string;
  occupancyPercentage: number;
}

export interface DateRangeParams {
  startDate?: Date;
  endDate?: Date;
  weekStart?: Date;
}

// Helper function to ensure we have a valid Date object
const ensureDate = (date: any): Date | null => {
  if (!date) return null;
  
  if (date instanceof Date) {
    return date;
  }
  
  try {
    return new Date(date);
  } catch (error) {
    console.error('Error converting to Date:', error);
    return null;
  }
};

const buildQueryParams = (params?: DateRangeParams): string => {
  if (!params) return '';
  
  const queryParams = [];
  
  if (params.startDate) {
    const startDate = ensureDate(params.startDate);
    if (startDate) {
      queryParams.push(`startDate=${startDate.toISOString()}`);
    }
  }
  
  if (params.endDate) {
    const endDate = ensureDate(params.endDate);
    if (endDate) {
      queryParams.push(`endDate=${endDate.toISOString()}`);
    }
  }
  
  if (params.weekStart) {
    const weekStart = ensureDate(params.weekStart);
    if (weekStart) {
      queryParams.push(`weekStart=${weekStart.toISOString()}`);
    }
  }
  
  return queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
};

const dashboardService = {
  /**
   * Get dashboard statistics
   */
  getStatistics: async (params?: DateRangeParams): Promise<DashboardStatistics> => {
    try {
      const queryParams = buildQueryParams(params);
      const response = await fetch(`/dashboard/statistics${queryParams}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch statistics: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      return {};
    }
  },

  /**
   * Get weekly events total
   */
  getWeeklyEventsTotal: async (params?: DateRangeParams): Promise<number> => {
    try {
      const queryParams = buildQueryParams(params);
      const response = await fetch(`/api/Dashboard/weekly-events${queryParams}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch weekly events: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching weekly events total:', error);
      return 0;
    }
  },

  /**
   * Get day with most events
   */
  getDayWithMostEvents: async (params?: DateRangeParams): Promise<DayEventInfo> => {
    try {
      const queryParams = buildQueryParams(params);
      const response = await fetch(`/api/Dashboard/day-with-most-events${queryParams}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch day with most events: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching day with most events:', error);
      return { date: 'Unknown', eventCount: 0 };
    }
  },

  /**
   * Get day with most hours
   */
  getDayWithMostHours: async (params?: DateRangeParams): Promise<DayHoursInfo> => {
    try {
      const queryParams = buildQueryParams(params);
      const response = await fetch(`/api/Dashboard/day-with-most-hours${queryParams}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch day with most hours: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching day with most hours:', error);
      return { date: 'Unknown', totalHours: 0 };
    }
  },

  /**
   * Get daily occupancy percentages
   */
  getDailyOccupancy: async (params?: DateRangeParams): Promise<DailyOccupancy[]> => {
    try {
      const queryParams = buildQueryParams(params);
      const response = await fetch(`/api/Dashboard/daily-occupancy${queryParams}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch daily occupancy: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching daily occupancy:', error);
      return [];
    }
  }
};

export default dashboardService; 