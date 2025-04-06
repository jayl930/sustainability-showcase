
import { useState, useMemo, useRef, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Article } from "@/utils/types";

interface ArticleTableProps {
  articles: Article[];
  className?: string;
}

const ArticleTable = ({ articles, className }: ArticleTableProps) => {
  const [page, setPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const articlesPerPage = 10;
  const tableRef = useRef<HTMLDivElement>(null);

  const displayedArticles = useMemo(() => {
    const start = (page - 1) * articlesPerPage;
    const end = start + articlesPerPage;
    return articles.slice(start, end);
  }, [articles, page]);

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  useEffect(() => {
    setPage(1);
  }, [articles]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (tableRef.current) {
      observer.observe(tableRef.current);
    }

    return () => {
      if (tableRef.current) {
        observer.unobserve(tableRef.current);
      }
    };
  }, []);

  function getGoalBadge(goalNumber: number) {
    if (!goalNumber || goalNumber === 0) return null;
    
    if (goalNumber < 1 || goalNumber > 17) return null;
    
    return (
      <Badge 
        className="text-white" 
        style={{ backgroundColor: `var(--tw-colors-goal-${goalNumber})` }}
      >
        Goal {goalNumber}
      </Badge>
    );
  }

  function handlePageChange(newPage: number) {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      tableRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center opacity-0 animate-fade-in" ref={tableRef}>
        <div className="text-3xl font-light text-muted-foreground mb-2">No articles found</div>
        <p className="text-muted-foreground">Try adjusting your filters or upload a different file.</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4 opacity-0", className)} ref={tableRef}>
      <ScrollArea className="h-[calc(100vh-24rem)] border rounded-lg">
        <Table className="relative">
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Sustainable</TableHead>
              <TableHead>Goals</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedArticles.map((article, index) => (
              <TableRow 
                key={article.article_uuid} 
                className="cursor-pointer transition-colors hover:bg-muted/30"
                style={{ '--index': index } as React.CSSProperties}
                onClick={() => setSelectedArticle(article)}
              >
                <TableCell className="font-medium truncate max-w-[300px]">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div>{article.title || "Untitled"}</div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl">{article.title || "Untitled"}</DialogTitle>
                        <DialogDescription className="flex flex-wrap gap-2 mt-2">
                          {article.publication_year && (
                            <Badge variant="outline">
                              Published: {article.publication_year}
                            </Badge>
                          )}
                          {article.journal_title && (
                            <Badge variant="outline">
                              Journal: {article.journal_title}
                            </Badge>
                          )}
                          {article.is_sustain === 1 && (
                            <Badge variant="default">
                              Sustainable
                            </Badge>
                          )}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="md:col-span-2 space-y-4">
                          {article.abstract && (
                            <div>
                              <h3 className="text-sm font-semibold mb-1">Abstract</h3>
                              <p className="text-sm text-muted-foreground">
                                {article.abstract}
                              </p>
                            </div>
                          )}
                          
                          {article.doi && (
                            <div>
                              <h3 className="text-sm font-semibold mb-1">DOI</h3>
                              <a 
                                href={`https://doi.org/${article.doi}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                {article.doi}
                              </a>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-4 border-l pl-4">
                          <div>
                            <h3 className="text-sm font-semibold mb-1">Author</h3>
                            <p className="text-sm text-muted-foreground">{article.name}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-semibold mb-1">Department</h3>
                            <p className="text-sm text-muted-foreground">{article.department}</p>
                          </div>
                          
                          {article.is_sustain === 1 && (
                            <div>
                              <h3 className="text-sm font-semibold mb-1">UN Sustainability Goals</h3>
                              <div className="flex flex-wrap gap-2">
                                {getGoalBadge(article.top_1)}
                                {getGoalBadge(article.top_2)}
                                {getGoalBadge(article.top_3)}
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <h3 className="text-sm font-semibold mb-1">Journal Details</h3>
                            {article.journal_issn && (
                              <p className="text-sm text-muted-foreground">ISSN: {article.journal_issn}</p>
                            )}
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div className="flex items-center gap-1">
                                <span className="text-xs">Financial Times:</span>
                                {article.financial_times === "1" ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <X className="h-3 w-3 text-red-500" />
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs">UT Dallas:</span>
                                {article.ut_dallas === "1" ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <X className="h-3 w-3 text-red-500" />
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs">Gen. Business:</span>
                                {article.general_business === "1" ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <X className="h-3 w-3 text-red-500" />
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs">Active:</span>
                                {article.active === "1" ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <X className="h-3 w-3 text-red-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>{article.name}</TableCell>
                <TableCell>{article.department}</TableCell>
                <TableCell>{article.publication_year}</TableCell>
                <TableCell>
                  {article.is_sustain === 1 ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      No
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {getGoalBadge(article.top_1)}
                    {getGoalBadge(article.top_2)}
                    {getGoalBadge(article.top_3)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * articlesPerPage + 1} to {Math.min(page * articlesPerPage, articles.length)} of {articles.length} articles
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logic to show current page and pages around it
              let pageToShow = page;
              if (page <= 3) {
                pageToShow = i + 1;
              } else if (page >= totalPages - 2) {
                pageToShow = totalPages - 4 + i;
              } else {
                pageToShow = page - 2 + i;
              }
              
              if (pageToShow > totalPages || pageToShow < 1) return null;
              
              return (
                <button
                  key={pageToShow}
                  onClick={() => handlePageChange(pageToShow)}
                  className={`h-8 w-8 rounded-md text-sm ${
                    page === pageToShow 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  }`}
                >
                  {pageToShow}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleTable;
