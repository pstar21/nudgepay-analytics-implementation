import { useState, useEffect } from 'react';
import { calculateMetrics, classifyUser, getPersonalityInfo } from '@/utils/metricsCalculator';
import {
  prepareGoalVsActualData,
  prepareSpendingBreakdownData,
  prepareDiscretionaryComparisonData,
  prepareTopCategoriesData,
  prepareSpendingVelocityData
} from '@/utils/chartHelpers';
import PersonalityCard from '@/components/PersonalityCard';
import GoalVsActual from '@/components/charts/GoalVsActual';
import SpendingBreakdown from '@/components/charts/SpendingBreakdown';
import DiscretionaryComparison from '@/components/charts/DiscretionaryComparison';
import TopCategories from '@/components/charts/TopCategories';
import SpendingVelocity from '@/components/charts/SpendingVelocity';
import { Card } from '@/components/ui/card';

const Analytics = () => {
  const [transactions, setTransactions] = useState([]);
  const [userInputs, setUserInputs] = useState({
    income: 50000,
    essentialSpending: 30000,
    goalSavings: 5000,
    plannedDiscretionary: 10000
  });

  const [metrics, setMetrics] = useState(null);
  const [personalityType, setPersonalityType] = useState(null);
  const [personalityInfo, setPersonalityInfo] = useState(null);

  useEffect(() => {
    // Sample transactions for testing
    const sampleTransactions = [
      { date: '2025-11-01', amount: 1500, category: 'Groceries', type: 'essential' },
      { date: '2025-11-05', amount: 3000, category: 'Shopping', type: 'discretionary' },
      { date: '2025-11-10', amount: 2500, category: 'Electronics', type: 'discretionary' },
      { date: '2025-11-15', amount: 1200, category: 'Dining', type: 'discretionary' },
      { date: '2025-11-20', amount: 800, category: 'Entertainment', type: 'discretionary' }
    ];
    setTransactions(sampleTransactions);
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      const calculatedMetrics = calculateMetrics({
        income: userInputs.income,
        essentialSpending: userInputs.essentialSpending,
        goalSavings: userInputs.goalSavings,
        transactions
      });
      setMetrics(calculatedMetrics);

      const userType = classifyUser(calculatedMetrics, transactions);
      setPersonalityType(userType);
      setPersonalityInfo(getPersonalityInfo(userType));
    }
  }, [transactions, userInputs]);

  if (!metrics || !personalityInfo) {
    return <div className=\"p-8\">Loading analytics...</div>;
  }

  const goalData = prepareGoalVsActualData(userInputs.goalSavings, metrics.actualSavings);
  const breakdownData = prepareSpendingBreakdownData(userInputs.essentialSpending, metrics.TDS);
  const comparisonData = prepareDiscretionaryComparisonData(userInputs.plannedDiscretionary, metrics.TDS);
  const categoriesData = prepareTopCategoriesData(transactions);
  const velocityData = prepareSpendingVelocityData(transactions);

  return (
    <div className=\"container mx-auto p-6 space-y-6\">
      <h1 className=\"text-3xl font-bold\">Financial Analytics Dashboard</h1>
      
      {/* Personality Card */}
      <PersonalityCard personalityInfo={personalityInfo} />

      {/* Charts Grid */}
      <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">
        <GoalVsActual data={goalData} />
        <SpendingBreakdown data={breakdownData} />
        <DiscretionaryComparison data={comparisonData} />
        <TopCategories data={categoriesData} />
      </div>

      {/* Full Width Chart */}
      <SpendingVelocity data={velocityData} />
    </div>
  );
};

export default Analytics;
