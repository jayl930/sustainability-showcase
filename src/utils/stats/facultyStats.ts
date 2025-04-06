
import { Article } from '../types';

// Calculate faculty-related statistics
export const calculateFacultyStats = (articles: Article[]) => {
  // Group articles by faculty member
  const facultyArticles: Record<string, {
    name: string;
    department: string;
    articles: Article[];
  }> = {};
  
  articles.forEach(article => {
    if (!facultyArticles[article.person_uuid]) {
      facultyArticles[article.person_uuid] = {
        name: article.name,
        department: article.department,
        articles: []
      };
    }
    
    facultyArticles[article.person_uuid].articles.push(article);
  });
  
  // Calculate metrics for each faculty member
  const facultyMetrics = Object.entries(facultyArticles).map(([uuid, data]) => {
    const uniqueArticleIds = new Set<string>();
    let sustainableCount = 0;
    let topJournalCount = 0;
    let topJournalSustainableCount = 0;
    
    // Count unique articles, sustainable articles, and top journal articles
    data.articles.forEach(article => {
      if (!uniqueArticleIds.has(article.article_uuid)) {
        uniqueArticleIds.add(article.article_uuid);
        
        const isTopJournal = article.ut_dallas === "1" || article.financial_times === "1";
        const isSustainable = article.is_sustain === 1;
        
        if (isSustainable) sustainableCount++;
        if (isTopJournal) topJournalCount++;
        if (isSustainable && isTopJournal) topJournalSustainableCount++;
      }
    });
    
    // Calculate faculty metrics
    return {
      person_uuid: uuid,
      name: data.name,
      department: data.department,
      totalArticles: uniqueArticleIds.size,
      sustainableArticles: sustainableCount,
      topJournalArticles: topJournalCount,
      topJournalSustainableArticles: topJournalSustainableCount,
      sustainabilityRatio: uniqueArticleIds.size > 0 ? sustainableCount / uniqueArticleIds.size : 0
    };
  });
  
  // Get top faculty by total articles
  const topFaculty = facultyMetrics
    .filter(f => f.totalArticles > 0)
    .sort((a, b) => b.totalArticles - a.totalArticles)
    .slice(0, 10)
    .map(f => ({
      name: f.name,
      total: f.totalArticles,
      sustainable: f.sustainableArticles,
      topJournals: f.topJournalArticles
    }));
  
  // Get top faculty by sustainable articles
  const topSustainableFaculty = facultyMetrics
    .filter(f => f.sustainableArticles > 0)
    .sort((a, b) => b.sustainableArticles - a.sustainableArticles)
    .slice(0, 10)
    .map(f => ({
      name: f.name,
      total: f.totalArticles,
      sustainable: f.sustainableArticles,
      topJournals: f.topJournalArticles
    }));
    
  // Get top faculty by top journal articles
  const topJournalFaculty = facultyMetrics
    .filter(f => f.topJournalArticles > 0)
    .sort((a, b) => b.topJournalArticles - a.topJournalArticles)
    .slice(0, 10)
    .map(f => ({
      name: f.name,
      total: f.totalArticles,
      sustainable: f.sustainableArticles,
      topJournals: f.topJournalArticles
    }));
  
  return { 
    topFaculty,
    topSustainableFaculty,
    topJournalFaculty,
    allFaculty: facultyMetrics 
  };
};
