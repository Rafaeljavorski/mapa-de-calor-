import React, { useMemo } from 'react';
import { Activity } from '../types';

interface DashboardStatsProps {
  data: Activity[];
}

// FIX: Changed icon type from JSX.Element to React.ReactNode to resolve potential namespace issues.
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700 flex items-center space-x-4 transition-transform duration-300 hover:scale-105 hover:border-cyan-400">
    <div className="bg-gray-700 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

export const DashboardStats: React.FC<DashboardStatsProps> = ({ data }) => {
  const stats = useMemo(() => {
    const statusCounts = data.reduce((acc, curr) => {
      const status = curr['Status da Atividade'];
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeCounts = data.reduce((acc, curr) => {
      const type = curr['Tipo de Atividade'];
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: data.length,
      statusCounts,
      topType: Object.entries(typeCounts).sort(([, a], [, b]) => b - a)[0] || ['N/A', 0],
    };
  }, [data]);

  const concludedCount = stats.statusCounts['Concluída'] || 0;
  // FIX: Default potentially undefined counts to 0 before adding them together to prevent arithmetic errors.
  const issuesCount = (stats.statusCounts['Cancelada'] || 0) + (stats.statusCounts['Não Concluída'] || 0);


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      <StatCard title="Total Activities" value={stats.total} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
      <StatCard title="Completed" value={concludedCount} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
      <StatCard title="Canceled / Not Completed" value={issuesCount} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
      <StatCard title="Most Common Type" value={stats.topType[0]} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} />
    </div>
  );
};