
import { Article } from "@/utils/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GOAL_COLORS } from "./charts/GoalDistributionChart";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DetailsTabProps {
  articles: Article[];
}

const ITEMS_PER_PAGE = 10;

const DetailsTab = ({ articles }: DetailsTabProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter articles based on search term
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.journal_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalArticles = filteredArticles.length;
  const totalPages = Math.ceil(totalArticles / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedArticles = filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Full Article Table */}
      <Card className="animate-fade-in opacity-0" style={{ '--index': 0 } as React.CSSProperties}>
        <CardHeader>
          <CardTitle>Detailed Article Data</CardTitle>
          <CardDescription>
            Searchable table of all articles in the dataset
          </CardDescription>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-2">
            <Input 
              type="text" 
              placeholder="Search articles..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <ScrollArea className="h-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Journal</TableHead>
                    <TableHead>Sustainable</TableHead>
                    <TableHead>Goals</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedArticles.map((article) => (
                    <TableRow key={article.article_uuid}>
                      <TableCell className="max-w-[300px] truncate">
                        {article.title || "N/A"}
                      </TableCell>
                      <TableCell>{article.name || "N/A"}</TableCell>
                      <TableCell>{article.department || "N/A"}</TableCell>
                      <TableCell>{article.publication_year || "N/A"}</TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {article.journal_title || "N/A"}
                      </TableCell>
                      <TableCell>
                        {article.is_sustain === 1 ? (
                          <Badge variant="success" className="bg-green-100 text-green-800">
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-500">
                            No
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {article.top_1 > 0 && (
                            <Badge 
                              style={{ 
                                backgroundColor: GOAL_COLORS[article.top_1 - 1],
                                color: 'white'
                              }}
                              className="text-xs"
                            >
                              {article.top_1}
                            </Badge>
                          )}
                          {article.top_2 > 0 && (
                            <Badge
                              style={{ 
                                backgroundColor: GOAL_COLORS[article.top_2 - 1],
                                color: 'white'
                              }}
                              className="text-xs"
                            >
                              {article.top_2}
                            </Badge>
                          )}
                          {article.top_3 > 0 && (
                            <Badge
                              style={{ 
                                backgroundColor: GOAL_COLORS[article.top_3 - 1],
                                color: 'white'
                              }}
                              className="text-xs"
                            >
                              {article.top_3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, totalArticles)} of {totalArticles} articles
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailsTab;
