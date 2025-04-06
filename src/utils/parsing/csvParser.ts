
import { Article, FilterOptions } from "../types";
import Papa from "papaparse";

// Parse CSV data into Article objects
export const parseCSV = async (file: File): Promise<Article[]> => {
  return new Promise((resolve, reject) => {
    const articles: Article[] = [];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validResults = results.data.filter(
          (row: any) => row.person_uuid && row.article_uuid
        );

        const parsedData = validResults.map((row: any) => ({
          person_uuid: row.person_uuid,
          name: row.name || "",
          email: row.email || "",
          department: row.department || "",
          article_uuid: row.article_uuid,
          title: row.title || "",
          publication_year: row.publication_year || "",
          doi: row.doi || "",
          abstract: row.abstract || "",
          journal_title: row.journal_title || "",
          journal_issn: row.journal_issn || "",
          is_sustain: parseInt(row.is_sustain) || 0,
          top_1: parseInt(row["top 1"]) || 0,
          top_2: parseInt(row["top 2"]) || 0,
          top_3: parseInt(row["top 3"]) || 0,
          financial_times: row["Financial Times"],
          ut_dallas: row["UT Dallas"],
          general_business: row["General Business"],
          active: row.active || "",
        }));

        resolve(parsedData);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

// Get unique values from an array of articles for a specific field
export const getUniqueValues = (
  articles: Article[],
  field: keyof Article
): string[] => {
  const uniqueValues = new Set<string>();

  articles.forEach((article) => {
    const value = article[field];
    if (value && typeof value === "string" && value.trim() !== "") {
      uniqueValues.add(value);
    }
  });

  return Array.from(uniqueValues).sort();
};

// Filter articles based on various criteria
export const filterArticles = (
  articles: Article[],
  department: string | null,
  yearRange: [string | null, string | null],
  goals: number[] | null,
  isSustainable: boolean | null
): Article[] => {
  return articles.filter(article => {
    // Filter by department
    if (department && article.department !== department) {
      return false;
    }

    // Filter by year range
    if (yearRange[0] && yearRange[1]) {
      const year = parseInt(article.publication_year);
      const startYear = parseInt(yearRange[0]);
      const endYear = parseInt(yearRange[1]);
      
      if (isNaN(year) || year < startYear || year > endYear) {
        return false;
      }
    }

    // Filter by sustainability
    if (isSustainable !== null) {
      const isArticleSustainable = article.is_sustain === 1;
      if (isArticleSustainable !== isSustainable) {
        return false;
      }
    }

    // Filter by goals
    if (goals && goals.length > 0 && article.is_sustain === 1) {
      // Check if the article has any of the selected goals
      const articleGoals = [
        article.top_1, 
        article.top_2, 
        article.top_3
      ].filter(g => g > 0);
      
      const hasMatchingGoal = articleGoals.some(goal => goals.includes(goal));
      if (!hasMatchingGoal) {
        return false;
      }
    }
    
    return true;
  });
};
