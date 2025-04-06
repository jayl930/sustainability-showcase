import { useState, useEffect } from "react";
import { parseCSV } from "@/utils/parsing/csvParser";
import { Article } from "@/utils/types";
import Dashboard from "@/components/Dashboard";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUp } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadCSVData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("./data/person_research_outputs.csv");
        const csvText = await response.text();
        const csvBlob = new Blob([csvText], { type: "text/csv" });
        const csvFile = new File([csvBlob], "person_research_outputs.csv", {
          type: "text/csv",
        });

        // Get the last modified date from the response headers
        const lastModified = response.headers.get("last-modified");
        if (lastModified) {
          const date = new Date(lastModified);
          setLastUpdated(format(date, "MMM d, yyyy"));
        } else {
          // If no last-modified header, use current date
          setLastUpdated(format(new Date(), "MMM d, yyyy"));
        }

        const parsedData = await parseCSV(csvFile);
        setArticles(parsedData);

        toast({
          title: "Data loaded successfully",
          description: `Loaded ${parsedData.length} articles from the dataset`,
        });
      } catch (error) {
        console.error("Error loading CSV:", error);
        toast({
          title: "Error loading data",
          description:
            "Could not load the CSV file. Please check the console for details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCSVData();
  }, [toast]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background relative">
      <header className="bg-background border-b sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto py-4 px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img
                src="./src/components/Icons/uiuc.png"
                alt="Illinois Logo"
                className="h-8 w-8"
              />
              <h1 className="text-xl font-semibold tracking-tight">
                Gies Sustainability Dashboard
              </h1>
            </div>
            {lastUpdated && (
              <div className="text-sm text-muted-foreground">
                Last Update: <span className="font-medium">{lastUpdated}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-[100px] rounded-lg" />
              <Skeleton className="h-[100px] rounded-lg" />
              <Skeleton className="h-[100px] rounded-lg" />
            </div>
          </div>
        ) : (
          <Dashboard articles={articles} />
        )}
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-6">
          <p>Gies Sustainability Dashboard &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>

      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-white shadow-lg opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Index;
