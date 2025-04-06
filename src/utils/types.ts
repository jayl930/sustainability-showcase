
export interface Article {
  person_uuid: string;
  name: string;
  email: string;
  department: string;
  article_uuid: string;
  title: string;
  publication_year: string;
  doi: string;
  abstract: string;
  journal_title: string;
  journal_issn: string;
  is_sustain: number; 
  top_1: number;
  top_2: number;
  top_3: number;
  financial_times: string;
  ut_dallas: string;
  general_business: string;
  active: string;
}

export interface FilterOptions {
  department: string[];
  publicationYear: string[];
  sustainabilityGoals: number[];
  generalBusiness: boolean;
  topJournals: boolean;
}

export interface GoalCoOccurrence {
  goal1: number;
  goal2: number;
  count: number;
}

export interface GoalMetrics {
  goalsPerArticle: Record<number, number>;
  overallFrequency: { goal: number; count: number }[];
  coOccurrence: GoalCoOccurrence[];
}

export interface DashboardStats {
  // Original stats
  totalArticles: number;
  sustainableArticles: number;
  topDepartments: { department: string; count: number }[];
  goalDistribution: { goal: number; count: number }[];
  yearDistribution: { year: string; count: number }[];
  
  // New metrics for enhanced Dashboard
  uniqueArticles: number;
  totalFaculty: number;
  engagingFaculty: number;
  totalDepartments: number;
  avgArticlesPerFaculty: number;
  avgSustainableArticlesPerFaculty: number;
  sustainabilityRatio: number;
  facultyEngagementRatio: number;
  
  // Added metrics for the new dashboard
  topJournalArticles: number;
  sustainableTopJournalArticles: number;
  avgTopJournalArticlesPerFaculty: number;
  avgSustainableTopJournalArticlesPerFaculty: number;
  
  // Journal metrics
  journalDistribution: {
    generalBusiness: number;
    utDallas: number;
    financialTimes: number;
    other: number;
  };
  
  // Faculty metrics
  topFaculty: { name: string; total: number; sustainable: number; topJournals: number }[];
  topJournalFaculty: { name: string; total: number; sustainable: number; topJournals: number }[];
  topSustainableFaculty: { name: string; total: number; sustainable: number; topJournals: number }[];
  
  // Department metrics
  departmentStats: {
    department: string;
    totalArticles: number;
    sustainableArticles: number;
    sustainabilityRatio: number;
    facultyCount: number;
    avgArticlesPerFaculty: number;
    topJournalArticles: number;
    topJournalSustainable: number;
    departmentSDGGoals: { goal: number; count: number }[];
    growingSDGGoals: { goal: number; growthRate: number }[];
  }[];
  
  // Detailed goal metrics
  detailedGoalDistribution: {
    goal: number;
    top1Count: number;
    top2Count: number;
    top3Count: number;
    totalCount: number;
  }[];
  
  // Annual trends with 5-year rolling averages
  annualTrends: {
    year: string;
    totalArticles: number;
    sustainableArticles: number;
    growthRate?: number;
    sustainableGrowthRate?: number;
    generalBusiness: number;
    utDallas: number;
    financialTimes: number;
    other: number;
    topJournalArticles: number;
    totalRollingGrowthRate?: number;
    sustainableRollingGrowthRate?: number;
    topJournalRollingGrowthRate?: number;
  }[];
  
  // SDG goal contributors 
  goalContributors: {
    goal: number;
    contributors: { name: string; count: number; department: string }[];
  }[];
  
  // New goal metrics
  goalMetrics?: GoalMetrics;
}

export interface FacultyContribution {
  person_uuid: string;
  name: string;
  department: string;
  totalArticles: number;
  sustainableArticles: number;
  sustainabilityRatio: number;
  topJournalArticles: number;
}

export interface DepartmentGoalBreakdown {
  department: string;
  goals: {
    goalNumber: number;
    count: number;
  }[];
  totalSustainable: number;
  totalArticles: number;
}

export interface JournalAnalysis {
  type: 'General Business' | 'UT Dallas' | 'Financial Times' | 'Other';
  totalArticles: number;
  sustainableArticles: number;
  sustainabilityRatio: number;
  yearlyTrends: {
    year: string;
    totalArticles: number;
    sustainableArticles: number;
  }[];
}
