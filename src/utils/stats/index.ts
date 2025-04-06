
import { Article, DashboardStats } from "../types";
import {
  getUniqueArticles,
  calculateParticipationStats,
  calculateDepartmentStats,
  calculateJournalStats,
  calculateYearlyDistribution,
  formatYearDistribution,
  calculateTopJournalMetrics,
  calculateGoalContributors
} from "./basicStats";
import { calculateGoalStats } from "./goalStats";
import { calculateTimeStats } from "./timeStats";
import { calculateFacultyStats } from "./facultyStats";

export const calculateStats = (articles: Article[]): DashboardStats => {
  // Get unique articles and basic counts
  const uniqueArticles = getUniqueArticles(articles);
  const totalArticles = uniqueArticles.length;
  const sustainableArticles = uniqueArticles.filter(
    (article) => article.is_sustain === 1
  ).length;

  // Calculate participation metrics
  const {
    uniqueFacultyIds,
    uniqueDepartments,
    facultyWithSustainableArticles,
    facultyWithTopJournals
  } = calculateParticipationStats(uniqueArticles);

  // Calculate department statistics
  const { departmentStats, topDepartments } =
    calculateDepartmentStats(uniqueArticles);

  // Calculate goal statistics
  const { goalDistribution, detailedGoalDistribution, goalMetrics } =
    calculateGoalStats(uniqueArticles);

  // Calculate time-based statistics
  const { annualTrends } = calculateTimeStats(uniqueArticles);

  // Calculate faculty statistics
  const { topFaculty, topSustainableFaculty, topJournalFaculty, allFaculty } = calculateFacultyStats(articles);

  // Calculate yearly distribution
  const yearCounts = calculateYearlyDistribution(uniqueArticles);
  const yearDistribution = formatYearDistribution(yearCounts);

  // Calculate journal distribution
  const journalDistribution = calculateJournalStats(uniqueArticles);

  // Calculate top journal metrics
  const { topJournalArticles, sustainableTopJournalArticles } = calculateTopJournalMetrics(uniqueArticles);

  // Calculate average metrics for engaging faculty
  const engagingFacultyCount = facultyWithSustainableArticles.size;
  const avgArticlesPerEngagingFaculty = engagingFacultyCount > 0 
    ? articles.filter(a => facultyWithSustainableArticles.has(a.person_uuid)).length / engagingFacultyCount 
    : 0;
  
  const avgSustainableArticlesPerEngagingFaculty = engagingFacultyCount > 0 
    ? articles.filter(a => facultyWithSustainableArticles.has(a.person_uuid) && a.is_sustain === 1).length / engagingFacultyCount 
    : 0;
  
  const avgTopJournalArticlesPerEngagingFaculty = engagingFacultyCount > 0 
    ? articles.filter(a => 
        facultyWithSustainableArticles.has(a.person_uuid) && 
        (a.ut_dallas === "1" || a.financial_times === "1")
      ).length / engagingFacultyCount 
    : 0;
  
  // Calculate SDG goal contributors
  const goalContributors = calculateGoalContributors(uniqueArticles);

  return {
    // Basic counts
    totalArticles,
    sustainableArticles,
    uniqueArticles: uniqueArticles.length,

    // Faculty and department metrics
    totalFaculty: uniqueFacultyIds.size,
    engagingFaculty: facultyWithSustainableArticles.size,
    totalDepartments: uniqueDepartments.size,
    avgArticlesPerFaculty: totalArticles / (uniqueFacultyIds.size || 1),
    avgSustainableArticlesPerFaculty:
      sustainableArticles / (uniqueFacultyIds.size || 1),
    sustainabilityRatio:
      totalArticles > 0 ? (sustainableArticles / totalArticles) * 100 : 0,
    facultyEngagementRatio:
      uniqueFacultyIds.size > 0
        ? (facultyWithSustainableArticles.size / uniqueFacultyIds.size) * 100
        : 0,

    // Top journal metrics
    topJournalArticles,
    sustainableTopJournalArticles,
    avgTopJournalArticlesPerFaculty: topJournalArticles / (uniqueFacultyIds.size || 1),
    avgSustainableTopJournalArticlesPerFaculty: sustainableTopJournalArticles / (facultyWithSustainableArticles.size || 1),

    // Department and goal data
    topDepartments,
    departmentStats,
    goalDistribution,
    detailedGoalDistribution,

    // Time-based data
    yearDistribution,
    annualTrends,

    // Journal data
    journalDistribution,

    // Faculty data
    topFaculty,
    // Add the missing properties
    topJournalFaculty,
    topSustainableFaculty,

    // Goal metrics
    goalMetrics,

    // Goal contributors data
    goalContributors,
  };
};
