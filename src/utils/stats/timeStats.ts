
import { Article } from '../types';

// Calculate detailed time-based statistics
export const calculateTimeStats = (uniqueArticles: Article[]) => {
  // Count articles by publication year with detailed breakdowns
  const yearData: Record<string, {
    total: number,
    sustainable: number,
    generalBusiness: number,
    utDallas: number,
    financialTimes: number,
    topJournals: number,
    other: number
  }> = {};
  
  uniqueArticles.forEach(article => {
    if (article.publication_year) {
      if (!yearData[article.publication_year]) {
        yearData[article.publication_year] = {
          total: 0,
          sustainable: 0,
          generalBusiness: 0,
          utDallas: 0,
          financialTimes: 0,
          topJournals: 0,
          other: 0
        };
      }
      
      yearData[article.publication_year].total += 1;
      
      if (article.is_sustain === 1) {
        yearData[article.publication_year].sustainable += 1;
      }
      
      if (article.general_business === "1") {
        yearData[article.publication_year].generalBusiness += 1;
      }
      
      if (article.ut_dallas === "1" || article.financial_times === "1") {
        yearData[article.publication_year].topJournals += 1;
      } else if (article.ut_dallas === "1") {
        yearData[article.publication_year].utDallas += 1;
      } else if (article.financial_times === "1") {
        yearData[article.publication_year].financialTimes += 1;
      } else {
        yearData[article.publication_year].other += 1;
      }
    }
  });

  // Calculate year-over-year growth rates and 5-year rolling averages
  const yearsSorted = Object.keys(yearData).sort((a, b) => parseInt(a) - parseInt(b));
  
  // Filter out 1971 when calculating growth rates (as requested)
  const yearsForGrowth = yearsSorted.filter(year => year !== "1971");
  
  // Calculate 5-year rolling averages for each metric
  const calculateRollingAverage = (years: string[], metric: keyof typeof yearData[string]) => {
    const rollingAvgs: Record<string, number> = {};
    
    years.forEach((year, index) => {
      // Need at least 5 years of data before the current year
      if (index >= 4) {
        const fiveYearWindow = years.slice(index - 4, index + 1);
        const sum = fiveYearWindow.reduce((acc, y) => acc + yearData[y][metric], 0);
        rollingAvgs[year] = sum / 5;
      }
    });
    
    return rollingAvgs;
  };
  
  // Calculate the rolling averages for each metric
  const totalRollingAvgs = calculateRollingAverage(yearsForGrowth, 'total');
  const sustainableRollingAvgs = calculateRollingAverage(yearsForGrowth, 'sustainable');
  const topJournalRollingAvgs = calculateRollingAverage(yearsForGrowth, 'topJournals');
  
  // Calculate rolling growth rates based on the rolling averages
  const calculateRollingGrowthRates = (rollingAvgs: Record<string, number>) => {
    const growthRates: Record<string, number> = {};
    const years = Object.keys(rollingAvgs).sort((a, b) => parseInt(a) - parseInt(b));
    
    years.forEach((year, index) => {
      if (index > 0) {
        const prevYear = years[index - 1];
        const currentAvg = rollingAvgs[year];
        const prevAvg = rollingAvgs[prevYear];
        
        if (prevAvg > 0) {
          growthRates[year] = ((currentAvg - prevAvg) / prevAvg) * 100;
        }
      }
    });
    
    return growthRates;
  };
  
  // Calculate rolling growth rates
  const totalRollingGrowthRates = calculateRollingGrowthRates(totalRollingAvgs);
  const sustainableRollingGrowthRates = calculateRollingGrowthRates(sustainableRollingAvgs);
  const topJournalRollingGrowthRates = calculateRollingGrowthRates(topJournalRollingAvgs);
  
  const annualTrends = yearsSorted.map((year, index) => {
    const data = yearData[year];
    let growthRate = null;
    let sustainableGrowthRate = null;
    
    if (index > 0 && year !== "1971") {
      const prevYear = yearsSorted[index - 1];
      const prevData = yearData[prevYear];
      
      growthRate = prevData.total > 0 
        ? ((data.total - prevData.total) / prevData.total) * 100 
        : null;
      
      sustainableGrowthRate = prevData.sustainable > 0 
        ? ((data.sustainable - prevData.sustainable) / prevData.sustainable) * 100 
        : null;
    }
    
    return {
      year,
      totalArticles: data.total,
      sustainableArticles: data.sustainable,
      growthRate,
      sustainableGrowthRate,
      generalBusiness: data.generalBusiness,
      utDallas: data.utDallas,
      financialTimes: data.financialTimes,
      topJournalArticles: data.topJournals,
      other: data.other,
      // Add rolling growth rates if available
      totalRollingGrowthRate: totalRollingGrowthRates[year],
      sustainableRollingGrowthRate: sustainableRollingGrowthRates[year],
      topJournalRollingGrowthRate: topJournalRollingGrowthRates[year]
    };
  });
  
  return { annualTrends };
};
