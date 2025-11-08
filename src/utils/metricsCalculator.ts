// Complete Metrics Calculator with all 5 key metrics and user classification

export interface Transaction {
  id?: string;
  date: string;
  amount: number;
  category: string;
  sub_category?: string;
  description?: string;
}

export interface MetricsInput {
  totalIncome: number;
  totalEssentials: number;
  totalSecondary: number;
  totalLuxury: number;
  goalAmount: number;
  monthsRemaining: number;
  transactions: Transaction[];
  secondaryTransactions: Transaction[];
  luxuryTransactions: Transaction[];
}

export interface CalculatedMetrics {
  TEI: number; // True Expendible Income
  TDS: number; // Total Discretionary Spending
  DO: number; // Discretionary Overspend
  LR: number; // Luxury Ratio
  PSR: number; // Payday Splurge Ratio
  actualSavings: number;
  goalSavingsRequired: number;
  totalSpending: number;
}

export type PersonalityType = 
  | "The Leisurely Spender 🥂"
  | "The Ignorant Spender ☕"
  | "The Impulsive Spender 🛍️"
  | "The Goal-Oriented Saver 🏆"
  | "The Balanced Spender ✅";

/**
 * Calculate all 5 key financial metrics
 */
export function calculateMetrics(input: MetricsInput): CalculatedMetrics {
  // 1. Goal Savings Required
  const goalSavingsRequired = input.goalAmount / input.monthsRemaining;
  
  // 2. True Expendible Income (TEI)
  const TEI = input.totalIncome - input.totalEssentials - goalSavingsRequired;
  
  // 3. Total Discretionary Spending (TDS)
  const TDS = input.totalSecondary + input.totalLuxury;
  
  // 4. Discretionary Overspend (DO)
  const DO = TDS - TEI;
  
  // 5. Luxury Ratio (LR)
  const LR = TDS > 0 ? input.totalLuxury / TDS : 0;
  
  // 6. Payday Splurge Ratio (PSR) - Day 1-10
  let paydaySpend = 0;
  
  input.transactions.forEach(t => {
    const txDate = new Date(t.date);
    const day = txDate.getDate();
    
    // Only count Secondary and Luxury transactions in first 10 days
    if (day >= 1 && day <= 10) {
      if (t.category === 'Secondary' || t.category === 'Luxury') {
        paydaySpend += Math.abs(t.amount);
      }
    }
  });
  
  const PSR = TDS > 0 ? paydaySpend / TDS : 0;
  
  // Calculate total spending and actual savings
  const totalSpending = input.totalEssentials + input.totalSecondary + input.totalLuxury;
  const actualSavings = input.totalIncome - totalSpending;
  
  return {
    TEI,
    TDS,
    DO,
    LR,
    PSR,
    actualSavings,
    goalSavingsRequired,
    totalSpending
  };
}

/**
 * Classify user personality based on spending patterns
 * EXACT PRIORITY ORDER as specified
 */
export function classifyUser(
  metrics: CalculatedMetrics, 
  secondaryTransactionCount: number
): PersonalityType {
  const { DO, LR, PSR, TEI, TDS } = metrics;
  
  // 1. The Leisurely Spender 🥂
  if (DO > 0 && LR > 0.4) {
    return "The Leisurely Spender 🥂";
  }
  
  // 2. The Ignorant Spender ☕
  if (DO > 0 && LR <= 0.15 && secondaryTransactionCount > 50) {
    return "The Ignorant Spender ☕";
  }
  
  // 3. The Impulsive Spender 🛍️
  if (DO > 0 && PSR >= 0.75) {
    return "The Impulsive Spender 🛍️";
  }
  
  // 4. The Goal-Oriented Saver 🏆
  if (DO <= 0 && TDS < (TEI * 0.5)) {
    return "The Goal-Oriented Saver 🏆";
  }
  
  // 5. The Balanced Spender ✅
  return "The Balanced Spender ✅";
}

/**
 * Get personality description and recommendations
 */
export function getPersonalityInfo(personality: PersonalityType) {
  const info: Record<PersonalityType, { description: string; tips: string[] }> = {
    "The Leisurely Spender 🥂": {
      description: "You love the finer things in life and spend heavily on luxury items. Over 40% of your discretionary budget goes to premium purchases.",
      tips: [
        "Set a luxury spending cap each month",
        "Reward yourself with luxury items only after meeting savings goals",
        "Consider one luxury item per month instead of several"
      ]
    },
    "The Ignorant Spender ☕": {
      description: "You make many small purchases that add up quickly. With over 50 secondary transactions, these 'little expenses' are eating your budget.",
      tips: [
        "Track every small purchase for a week to see patterns",
        "Use cash for daily expenses to limit spending",
        "Set a daily spending limit and stick to it"
      ]
    },
    "The Impulsive Spender 🛍️": {
      description: "You spend 75% or more of your monthly discretionary budget in the first 10 days. This leaves you struggling for the rest of the month.",
      tips: [
        "Implement a weekly budget instead of monthly",
        "Use the 24-hour rule before making non-essential purchases",
        "Move money to savings immediately after payday"
      ]
    },
    "The Goal-Oriented Saver 🏆": {
      description: "Excellent! You're under budget and your discretionary spending is less than 50% of your available income. You're on track to meet your financial goals.",
      tips: [
        "Keep up the great work!",
        "Consider increasing your savings goal",
        "Invest your surplus wisely"
      ]
    },
    "The Balanced Spender ✅": {
      description: "You're managing your finances well! You stay within budget and maintain a healthy balance between spending and saving.",
      tips: [
        "Maintain your current habits",
        "Look for opportunities to optimize further",
        "Consider setting more ambitious financial goals"
      ]
    }
  };
  
  return info[personality];
}
