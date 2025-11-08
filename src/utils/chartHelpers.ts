src/utils/chartHelpers.tsimport { Transaction } from './metricsCalculator';

// Chart 1: Goal vs Actual Savings
export interface GoalVsActualData {
  goalAmount: number;
  savedAmount: number;
  percentage: number;
}

export const prepareGoalVsActualData = (
  goalSavings: number,
  actualSavings: number
): GoalVsActualData => {
  const percentage = goalSavings > 0 ? (actualSavings / goalSavings) * 100 : 0;
  return {
    goalAmount: goalSavings,
    savedAmount: actualSavings,
    percentage: Math.min(percentage, 100)
  };
};

// Chart 2: Total Spending Breakdown (Pie Chart)
export interface SpendingBreakdownData {
  name: string;
  value: number;
  color: string;
}

export const prepareSpendingBreakdownData = (
  essentialSpending: number,
  discretionarySpending: number
): SpendingBreakdownData[] => {
  return [
    {
      name: 'Essential Spending',
      value: essentialSpending,
      color: '#3b82f6' // blue
    },
    {
      name: 'Discretionary Spending',
      value: discretionarySpending,
      color: '#10b981' // green
    }
  ];
};

// Chart 3: Discretionary Spending Comparison (Bar Chart)
export interface DiscretionaryComparisonData {
  category: string;
  planned: number;
  actual: number;
}

export const prepareDiscretionaryComparisonData = (
  tei: number,
  tds: number
): DiscretionaryComparisonData[] => {
  return [
    {
      category: 'Discretionary Budget',
      planned: tei,
      actual: tds
    }
  ];
};

// Chart 4: Top Spending Categories (Horizontal Bar)
export interface TopCategoriesData {
  category: string;
  amount: number;
  count: number;
}

export const prepareTopCategoriesData = (
  transactions: Transaction[]
): TopCategoriesData[] => {
  const categoryMap = new Map<string, { amount: number; count: number }>();
  
  transactions.forEach(tx => {
    const existing = categoryMap.get(tx.category) || { amount: 0, count: 0 };
    categoryMap.set(tx.category, {
      amount: existing.amount + tx.amount,
      count: existing.count + 1
    });
  });
  
  const categoriesArray = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    amount: data.amount,
    count: data.count
  }));
  
  // Sort by amount descending and return top 10
  return categoriesArray
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);
};

// Chart 5: Spending Velocity (Cumulative Line Chart)
export interface SpendingVelocityData {
  day: number;
  cumulativeAmount: number;
  transactionCount: number;
}

export const prepareSpendingVelocityData = (
  transactions: Transaction[]
): SpendingVelocityData[] => {
  // Sort transactions by date
  const sortedTx = [...transactions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  if (sortedTx.length === 0) return [];
  
  const firstDate = new Date(sortedTx[0].date);
  const lastDate = new Date(sortedTx[sortedTx.length - 1].date);
  const daysDiff = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  const dailyData: SpendingVelocityData[] = [];
  let cumulativeAmount = 0;
  let txIndex = 0;
  
  for (let day = 0; day < daysDiff; day++) {
    const currentDate = new Date(firstDate);
    currentDate.setDate(currentDate.getDate() + day);
    const currentDateStr = currentDate.toISOString().split('T')[0];
    
    let dayCount = 0;
    while (txIndex < sortedTx.length) {
      const txDate = new Date(sortedTx[txIndex].date).toISOString().split('T')[0];
      if (txDate === currentDateStr) {
        cumulativeAmount += sortedTx[txIndex].amount;
        dayCount++;
        txIndex++;
      } else if (txDate > currentDateStr) {
        break;
      } else {
        txIndex++;
      }
    }
    
    dailyData.push({
      day: day + 1,
      cumulativeAmount,
      transactionCount: dayCount
    });
  }
  
  return dailyData;
};
