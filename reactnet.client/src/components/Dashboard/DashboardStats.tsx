import React, { useEffect, useState } from 'react';
import dashboardService, { 
  DayEventInfo, 
  DayHoursInfo, 
  DailyOccupancy,
  DateRangeParams
} from '../../services/dashboardService';
import { useDateRangeStore } from '../../stores/dateRangeStore';

// Individual stat card component
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon?: string;
  description?: string;
  loading?: boolean;
}> = ({ title, value, icon, description, loading = false }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {icon && <span className="text-blue-500 text-xl">{icon}</span>}
      </div>
      <div className="flex-grow">
        {loading ? (
          <div className="animate-pulse h-8 bg-gray-200 rounded w-16 mb-2"></div>
        ) : (
          <p className="text-3xl font-bold text-gray-800 mb-2">{value}</p>
        )}
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </div>
  );
};

const DashboardStats: React.FC = () => {
  const [weeklyEvents, setWeeklyEvents] = useState<number | null>(null);
  const [dayWithMostEvents, setDayWithMostEvents] = useState<DayEventInfo | null>(null);
  const [dayWithMostHours, setDayWithMostHours] = useState<DayHoursInfo | null>(null);
  const [dailyOccupancy, setDailyOccupancy] = useState<DailyOccupancy[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { dateRange } = useDateRangeStore();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!dateRange.startDate || !dateRange.endDate) return;
      
      setLoading(true);
      try {
        // Create date range params object - convert null values to undefined
        const dateRangeParams: DateRangeParams = {
          startDate: dateRange.startDate || undefined,
          endDate: dateRange.endDate || undefined,
          weekStart: dateRange.weekStart || undefined
        };

        // Fetch all dashboard data in parallel, passing the date range params
        const [
          weeklyEventsData,
          dayWithMostEventsData,
          dayWithMostHoursData,
          dailyOccupancyData
        ] = await Promise.all([
          dashboardService.getWeeklyEventsTotal(dateRangeParams),
          dashboardService.getDayWithMostEvents(dateRangeParams),
          dashboardService.getDayWithMostHours(dateRangeParams),
          dashboardService.getDailyOccupancy(dateRangeParams)
        ]);

        //Testing value to check rendering
        setWeeklyEvents(0);
        setDayWithMostEvents(dayWithMostEventsData);
        setDayWithMostHours(dayWithMostHoursData);
        setDailyOccupancy(dailyOccupancyData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dateRange.startDate, dateRange.endDate, dateRange.weekStart]);

  // Find the busiest day based on occupancy
  const busiestDay = dailyOccupancy
    ? dailyOccupancy.reduce(
        (max, day) => (day.occupancyPercentage > max.occupancyPercentage ? day : max),
        dailyOccupancy[0] || { date: 'Unknown', occupancyPercentage: 0 }
      )
    : null;

    const getDayOfWeek = (date: string) => {
        const day = new Date(date);
        return day.toLocaleDateString('en-US', { weekday: 'long' });
    }

  // Helper function to format date strings
  const formatDate = (date: Date | string | null): string => {
    if (!date) return '';
    
    // If it's already a Date object, use toLocaleDateString
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    
    // If it's a string, convert to Date first
    try {
      return new Date(date).toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {dateRange?.startDate && dateRange?.endDate 
          ? `Statistics (${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)})`
          : 'Weekly Statistics'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-6">
        <StatCard
          title="Total Events"
          value={weeklyEvents !== null ? weeklyEvents : '-'}
          icon="📅"
          description="Events in selected period"
          loading={loading}
        />
        <StatCard
          title="Busiest Day (Events)"
          value={dayWithMostEvents ? `${getDayOfWeek(dayWithMostEvents.date)} (${dayWithMostEvents.eventCount})` : '-'}
          icon="📊"
          description="Day with most scheduled events"
          loading={loading}
        />
        <StatCard
          title="Longest Day"
          value={dayWithMostHours ? `${getDayOfWeek(dayWithMostHours.date)} (${dayWithMostHours.totalHours}h)` : '-'}
          icon="⏱️"
          description="Day with most hours scheduled"
          loading={loading}
        />
        <StatCard
          title="Peak Occupancy"
          value={busiestDay ? `${getDayOfWeek(busiestDay.date)} (${busiestDay.occupancyPercentage.toFixed(2)}%)` : '-'}
          icon="📈"
          description="Day with highest schedule occupancy"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DashboardStats; 