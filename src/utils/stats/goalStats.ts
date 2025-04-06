
import { Article } from "../types";

// Use the GoalCoOccurrence interface from types.ts
import { GoalCoOccurrence } from "../types";

// Calculate sustainability goal statistics
export const calculateGoalStats = (uniqueArticles: Article[]) => {
  // Object to count articles by sustainability goal
  const goalCount: Record<
    number,
    { top1: number; top2: number; top3: number; total: number }
  > = {};

  // Metrics for how many goals each article has
  const goalsPerArticle: Record<number, number> = { 1: 0, 2: 0, 3: 0 };

  // Track co-occurrences with a temporary object
  const tempCoOccurrence: Record<string, number> = {};

  uniqueArticles.forEach((article, articleIndex) => {
    if (article.is_sustain === 1) {
      // Get all non-zero goals for this article
      const articleGoals = [article.top_1, article.top_2, article.top_3]
        .filter((g) => g > 0)
        .map((g) => Number(g));

      const articleGoalCount = articleGoals.length;
      console.log(
        `Article ${articleIndex} sustainability goals count:`,
        articleGoalCount
      );

      if (articleGoalCount > 0 && articleGoalCount <= 3) {
        goalsPerArticle[articleGoalCount]++;

        // Calculate co-occurrences for all pairs of goals in this article
        for (let i = 0; i < articleGoals.length; i++) {
          for (let j = i + 1; j < articleGoals.length; j++) {
            const goal1 = Math.min(articleGoals[i], articleGoals[j]);
            const goal2 = Math.max(articleGoals[i], articleGoals[j]);
            const key = `${goal1}-${goal2}`;
            tempCoOccurrence[key] = (tempCoOccurrence[key] || 0) + 1;
          }
        }
      }

      // Process top 1 goal
      if (article.top_1 && article.top_1 > 0) {
        const goal1 = article.top_1;
        if (!goalCount[goal1]) {
          goalCount[goal1] = { top1: 0, top2: 0, top3: 0, total: 0 };
          console.log(`Initializing goalCount for goal ${goal1}`);
        }
        goalCount[goal1].top1 += 1;
        goalCount[goal1].total += 1;
      }

      // Process top 2 goal
      if (article.top_2 && article.top_2 > 0) {
        const goal2 = article.top_2;
        if (!goalCount[goal2]) {
          goalCount[goal2] = { top1: 0, top2: 0, top3: 0, total: 0 };
          console.log(`Initializing goalCount for goal ${goal2}`);
        }
        goalCount[goal2].top2 += 1;
        goalCount[goal2].total += 1;
      }

      // Process top 3 goal
      if (article.top_3 && article.top_3 > 0) {
        const goal3 = article.top_3;
        if (!goalCount[goal3]) {
          goalCount[goal3] = { top1: 0, top2: 0, top3: 0, total: 0 };
          console.log(`Initializing goalCount for goal ${goal3}`);
        }
        goalCount[goal3].top3 += 1;
        goalCount[goal3].total += 1;
      }
    }
  });

  // Convert temporary co-occurrence object to array format and sort by count (descending)
  const coOccurrence: GoalCoOccurrence[] = Object.entries(tempCoOccurrence)
    .map(([key, count]) => {
      const [goal1, goal2] = key.split("-").map(Number);
      return {
        goal1,
        goal2,
        count,
      };
    })
    .sort((a, b) => b.count - a.count);

  console.log("Final goalsPerArticle:", goalsPerArticle);
  console.log("Final goalCount object:", goalCount);
  console.log("Goal co-occurrences:", coOccurrence);

  // Convert goalCount object to an array for goalDistribution
  const goalDistribution = Object.entries(goalCount).map(([key, data]) => ({
    goal: Number(key),
    count: data.total,
  }));

  // Convert goalCount object to detailed distribution with the expected property names
  const detailedGoalDistribution = Object.entries(goalCount).map(
    ([key, data]) => ({
      goal: Number(key),
      top1Count: data.top1,
      top2Count: data.top2,
      top3Count: data.top3,
      totalCount: data.total,
    })
  );

  // Calculate overallFrequency as an array of { goal, count } objects
  const overallFrequency = Object.entries(goalCount).map(([key, data]) => ({
    goal: Number(key),
    count: data.total,
  }));

  // Build goalMetrics with the expected type shape
  const goalMetrics = {
    goalsPerArticle, // e.g. { 1: count, 2: count, 3: count }
    overallFrequency, // array of { goal, count } objects
    coOccurrence, // array of { goal1, goal2, count } objects
  };

  return {
    goalDistribution,
    detailedGoalDistribution,
    goalMetrics,
  };
};
