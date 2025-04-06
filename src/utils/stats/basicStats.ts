
import { Article, DashboardStats } from '../types';

// Helper function to get unique articles by ID
export const getUniqueArticles = (articles: Article[]) => {
  const uniqueArticleIds = new Set<string>();
  const uniqueArticles = articles.filter(article => {
    const isDuplicate = uniqueArticleIds.has(article.article_uuid);
    uniqueArticleIds.add(article.article_uuid);
    return !isDuplicate;
  });
  
  return uniqueArticles;
};

// Count faculty and department metrics
export const calculateParticipationStats = (uniqueArticles: Article[]) => {
  const uniqueFacultyIds = new Set<string>();
  const uniqueDepartments = new Set<string>();
  const facultyWithSustainableArticles = new Set<string>();
  const facultyWithTopJournals = new Set<string>();
  
  uniqueArticles.forEach(article => {
    uniqueFacultyIds.add(article.person_uuid);
    if (article.department) uniqueDepartments.add(article.department);
    
    if (article.is_sustain === 1) {
      facultyWithSustainableArticles.add(article.person_uuid);
    }
    
    if (article.ut_dallas === "1" || article.financial_times === "1") {
      facultyWithTopJournals.add(article.person_uuid);
    }
  });
  
  return {
    uniqueFacultyIds,
    uniqueDepartments,
    facultyWithSustainableArticles,
    facultyWithTopJournals
  };
};

// Calculate department statistics
export const calculateDepartmentStats = (uniqueArticles: Article[]) => {
  const departmentCount: Record<string, { 
    total: number, 
    sustainable: number, 
    faculty: Set<string>,
    topJournals: number,
    topJournalSustainable: number,
    sdgGoals: Record<number, number>,
    yearlySDGCounts: Record<string, Record<number, number>>
  }> = {};
  
  uniqueArticles.forEach(article => {
    if (article.department) {
      if (!departmentCount[article.department]) {
        departmentCount[article.department] = { 
          total: 0, 
          sustainable: 0, 
          faculty: new Set<string>(),
          topJournals: 0,
          topJournalSustainable: 0,
          sdgGoals: {},
          yearlySDGCounts: {}
        };
      }
      
      const deptStats = departmentCount[article.department];
      
      deptStats.total += 1;
      deptStats.faculty.add(article.person_uuid);
      
      const isTopJournal = article.ut_dallas === "1" || article.financial_times === "1";
      
      if (isTopJournal) {
        deptStats.topJournals += 1;
      }
      
      if (article.is_sustain === 1) {
        deptStats.sustainable += 1;
        
        if (isTopJournal) {
          deptStats.topJournalSustainable += 1;
        }
        
        const goals = [article.top_1, article.top_2, article.top_3].filter(g => g > 0);
        goals.forEach(goal => {
          deptStats.sdgGoals[goal] = (deptStats.sdgGoals[goal] || 0) + 1;
        });
        
        if (article.publication_year) {
          if (!deptStats.yearlySDGCounts[article.publication_year]) {
            deptStats.yearlySDGCounts[article.publication_year] = {};
          }
          
          goals.forEach(goal => {
            deptStats.yearlySDGCounts[article.publication_year][goal] = 
              (deptStats.yearlySDGCounts[article.publication_year][goal] || 0) + 1;
          });
        }
      }
    }
  });
  
  const calculateGrowingGoals = (yearlySDGCounts: Record<string, Record<number, number>>) => {
    const goalGrowthRates: {goal: number; growthRate: number}[] = [];
    const years = Object.keys(yearlySDGCounts).sort();
    
    const allGoals = new Set<number>();
    Object.values(yearlySDGCounts).forEach(yearData => {
      Object.keys(yearData).forEach(goal => allGoals.add(parseInt(goal)));
    });
    
    allGoals.forEach(goal => {
      if (years.length >= 5) {
        const recentYears = years.slice(-5);
        let earlierSum = 0;
        let laterSum = 0;
        
        recentYears.slice(0, 2).forEach(year => {
          earlierSum += yearlySDGCounts[year][goal] || 0;
        });
        
        recentYears.slice(2).forEach(year => {
          laterSum += yearlySDGCounts[year][goal] || 0;
        });
        
        const earlierAvg = earlierSum / 2 || 0.1;
        const laterAvg = laterSum / 3;
        
        const growthRate = ((laterAvg - earlierAvg) / earlierAvg) * 100;
        
        if (!isNaN(growthRate) && laterSum > 0) {
          goalGrowthRates.push({ goal, growthRate });
        }
      }
    });
    
    return goalGrowthRates.sort((a, b) => b.growthRate - a.growthRate).slice(0, 3);
  };
  
  const departmentStats = Object.entries(departmentCount)
    .map(([department, data]) => {
      const topSDGGoals = Object.entries(data.sdgGoals)
        .map(([goal, count]) => ({ goal: parseInt(goal), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
      
      const growingSDGGoals = calculateGrowingGoals(data.yearlySDGCounts);
      
      return {
        department,
        totalArticles: data.total,
        sustainableArticles: data.sustainable,
        sustainabilityRatio: data.total > 0 ? data.sustainable / data.total : 0,
        facultyCount: data.faculty.size,
        avgArticlesPerFaculty: data.total / (data.faculty.size || 1),
        topJournalArticles: data.topJournals,
        topJournalSustainable: data.topJournalSustainable,
        departmentSDGGoals: topSDGGoals,
        growingSDGGoals
      };
    });
    
  const topDepartments = departmentStats
    .sort((a, b) => b.totalArticles - a.totalArticles)
    .slice(0, 5)
    .map(dept => ({ department: dept.department, count: dept.totalArticles }));
    
  return { departmentStats, topDepartments };
};

// Calculate journal distribution
export const calculateJournalStats = (uniqueArticles: Article[]) => {
  const utDallasCount = uniqueArticles.filter(a => 
    a.ut_dallas === "1"
  ).length;
  
  const financialTimesCount = uniqueArticles.filter(a => 
    a.financial_times === "1" && a.ut_dallas !== "1"
  ).length;
  
  const regularBusinessCount = uniqueArticles.filter(a => 
    a.general_business === "1" && a.ut_dallas !== "1" && a.financial_times !== "1"
  ).length;
  
  const nonBusiness = uniqueArticles.filter(a => 
    a.general_business !== "1"
  ).length;
  
  return {
    generalBusiness: regularBusinessCount + utDallasCount + financialTimesCount,
    utDallas: utDallasCount,
    financialTimes: financialTimesCount,
    other: nonBusiness
  };
};

// Calculate basic timeline stats
export const calculateYearlyDistribution = (uniqueArticles: Article[]) => {
  return uniqueArticles
    .reduce((acc: Record<string, number>, article) => {
      if (article.publication_year) {
        acc[article.publication_year] = (acc[article.publication_year] || 0) + 1;
      }
      return acc;
    }, {});
};

export const formatYearDistribution = (yearCounts: Record<string, number>) => {
  return Object.entries(yearCounts)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));
};

export const calculateTopJournalMetrics = (uniqueArticles: Article[]) => {
  const topJournalArticles = uniqueArticles.filter(
    article => article.ut_dallas === "1" || article.financial_times === "1"
  ).length;
  
  const sustainableTopJournalArticles = uniqueArticles.filter(
    article => (article.ut_dallas === "1" || article.financial_times === "1") && article.is_sustain === 1
  ).length;
  
  return { topJournalArticles, sustainableTopJournalArticles };
};

export const calculateGoalContributors = (uniqueArticles: Article[]) => {
  const goalContributors: Record<number, Record<string, { count: number; name: string; department: string; }>> = {};
  
  uniqueArticles.forEach(article => {
    if (article.is_sustain === 1) {
      const goals = [article.top_1, article.top_2, article.top_3].filter(g => g > 0);
      
      goals.forEach(goal => {
        if (!goalContributors[goal]) {
          goalContributors[goal] = {};
        }
        
        if (!goalContributors[goal][article.person_uuid]) {
          goalContributors[goal][article.person_uuid] = {
            count: 0, 
            name: article.name,
            department: article.department
          };
        }
        
        goalContributors[goal][article.person_uuid].count += 1;
      });
    }
  });
  
  const formattedContributors = Object.entries(goalContributors).map(([goal, contributors]) => {
    const sortedContributors = Object.values(contributors)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
      
    return {
      goal: parseInt(goal),
      contributors: sortedContributors
    };
  });
  
  return formattedContributors;
};
