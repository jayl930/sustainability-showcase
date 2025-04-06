import { useState, useEffect } from 'react';
import { Check, ChevronDown, Filter, X, CalendarIcon, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from '@/lib/utils';

interface FilterBarProps {
  departments: string[];
  years: string[];
  onFilterChange: (
    department: string | null, 
    yearRange: [string | null, string | null], 
    goals: number[] | null, 
    isSustainable: boolean | null,
    generalBusiness: boolean | null,
    topJournals: boolean | null
  ) => void;
}

const GOAL_NAMES = [
  "No Poverty",
  "Zero Hunger",
  "Good Health and Well-being",
  "Quality Education",
  "Gender Equality",
  "Clean Water and Sanitation",
  "Affordable and Clean Energy",
  "Decent Work and Economic Growth",
  "Industry, Innovation and Infrastructure",
  "Reduced Inequality",
  "Sustainable Cities and Communities",
  "Responsible Consumption and Production",
  "Climate Action",
  "Life Below Water",
  "Life on Land",
  "Peace, Justice and Strong Institutions",
  "Partnerships for the Goals"
];

const FilterBar = ({ departments, years, onFilterChange }: FilterBarProps) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedYearStart, setSelectedYearStart] = useState<string | null>(null);
  const [selectedYearEnd, setSelectedYearEnd] = useState<string | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<number[]>([]);
  const [sustainabilityFilter, setSustainabilityFilter] = useState<boolean | null>(null);
  const [generalBusinessFilter, setGeneralBusinessFilter] = useState<boolean>(true);
  const [topJournalsFilter, setTopJournalsFilter] = useState<boolean>(false);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<number>(0);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [useRangeMode, setUseRangeMode] = useState<boolean>(true);

  useEffect(() => {
    if (years.length > 0) {
      const numericYears = years.map(y => parseInt(y)).sort((a, b) => a - b);
      setAvailableYears(numericYears);
      
      setSelectedYearStart(numericYears[0].toString());
      setSelectedYearEnd(numericYears[numericYears.length - 1].toString());
    }
  }, [years]);

  useEffect(() => {
    let count = 0;
    if (selectedDepartment) count++;
    if (selectedYearStart || selectedYearEnd) count++;
    if (selectedGoals.length > 0) count++;
    if (sustainabilityFilter !== null) count++;
    if (generalBusinessFilter) count++;
    if (topJournalsFilter) count++;
    setActiveFilters(count);
  }, [selectedDepartment, selectedYearStart, selectedYearEnd, selectedGoals, sustainabilityFilter, generalBusinessFilter, topJournalsFilter]);

  useEffect(() => {
    onFilterChange(
      selectedDepartment, 
      [selectedYearStart, selectedYearEnd], 
      selectedGoals.length > 0 ? selectedGoals : null,
      sustainabilityFilter,
      generalBusinessFilter,
      topJournalsFilter
    );
  }, [generalBusinessFilter]);

  const handleFilterChange = () => {
    onFilterChange(
      selectedDepartment, 
      [selectedYearStart, selectedYearEnd], 
      selectedGoals.length > 0 ? selectedGoals : null,
      sustainabilityFilter,
      generalBusinessFilter,
      topJournalsFilter
    );
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setSelectedDepartment(null);
    setSelectedYearStart(availableYears.length > 0 ? availableYears[0].toString() : null);
    setSelectedYearEnd(availableYears.length > 0 ? availableYears[availableYears.length - 1].toString() : null);
    setSelectedGoals([]);
    setSustainabilityFilter(null);
    setGeneralBusinessFilter(true);
    setTopJournalsFilter(false);
    onFilterChange(null, [null, null], null, null, true, false);
  };

  const toggleGoal = (goal: number) => {
    setSelectedGoals(prev => {
      if (prev.includes(goal)) {
        return prev.filter(g => g !== goal);
      } else {
        return [...prev, goal];
      }
    });
  };
  
  const handleYearRangeChange = (newValues: number[]) => {
    if (newValues.length === 2) {
      setSelectedYearStart(newValues[0].toString());
      setSelectedYearEnd(newValues[1].toString());
    }
  };

  const handleSingleYearChange = (yearValue: number) => {
    const yearStr = yearValue.toString();
    setSelectedYearStart(yearStr);
    setSelectedYearEnd(yearStr);
  };

  const toggleYearMode = (mode: 'range' | 'single') => {
    setUseRangeMode(mode === 'range');
    if (mode === 'range' && availableYears.length > 0) {
      setSelectedYearStart(availableYears[0].toString());
      setSelectedYearEnd(availableYears[availableYears.length - 1].toString());
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-4 animate-fade-in">
      <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 border-dashed space-x-2 transition-all duration-200 hover:border-primary/50"
          >
            <Filter className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span>Filters</span>
            {activeFilters > 0 && (
              <Badge 
                variant="secondary" 
                className="rounded-full px-1 font-normal text-xs"
              >
                {activeFilters}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search filters..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              
              <CommandGroup heading="Journal Categories">
                <div className="p-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Business Journals Only</span>
                    </div>
                    <Switch 
                      checked={generalBusinessFilter}
                      onCheckedChange={setGeneralBusinessFilter}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Top Journals Only (UTD/FT)</span>
                    </div>
                    <Switch 
                      checked={topJournalsFilter}
                      onCheckedChange={setTopJournalsFilter}
                    />
                  </div>
                </div>
              </CommandGroup>
              
              <CommandSeparator />
              
              <CommandGroup heading="Sustainability">
                <CommandItem 
                  onSelect={() => setSustainabilityFilter(true)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    sustainabilityFilter === true ? "bg-primary text-primary-foreground" : "opacity-50"
                  )}>
                    {sustainabilityFilter === true && <Check className="h-3 w-3" />}
                  </div>
                  <span>Sustainable</span>
                </CommandItem>
                <CommandItem 
                  onSelect={() => setSustainabilityFilter(false)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    sustainabilityFilter === false ? "bg-primary text-primary-foreground" : "opacity-50"
                  )}>
                    {sustainabilityFilter === false && <Check className="h-3 w-3" />}
                  </div>
                  <span>Not Sustainable</span>
                </CommandItem>
                <CommandItem 
                  onSelect={() => setSustainabilityFilter(null)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-sm border border-primary opacity-50"
                  )}>
                    {sustainabilityFilter === null && <Check className="h-3 w-3" />}
                  </div>
                  <span>All</span>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Department">
                <CommandItem
                  onSelect={() => setSelectedDepartment(null)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>All Departments</span>
                  {selectedDepartment === null && <Check className="h-4 w-4 opacity-70" />}
                </CommandItem>
                {departments.map((department) => (
                  <CommandItem
                    key={department}
                    onSelect={() => setSelectedDepartment(department)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span className="truncate max-w-[200px]">{department}</span>
                    {selectedDepartment === department && <Check className="h-4 w-4 flex-shrink-0" />}
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Publication Year">
                {availableYears.length > 0 && (
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant={useRangeMode ? "default" : "outline"} 
                          onClick={() => toggleYearMode('range')}
                          className="text-xs h-8"
                        >
                          Year Range
                        </Button>
                        <Button 
                          size="sm" 
                          variant={!useRangeMode ? "default" : "outline"} 
                          onClick={() => toggleYearMode('single')}
                          className="text-xs h-8"
                        >
                          Single Year
                        </Button>
                      </div>
                    </div>
                    
                    {useRangeMode ? (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Year Range:</span>
                          <span className="text-sm text-muted-foreground">
                            {selectedYearStart} - {selectedYearEnd}
                          </span>
                        </div>
                        <div className="pt-4">
                          <Slider
                            value={[
                              selectedYearStart ? parseInt(selectedYearStart) : availableYears[0],
                              selectedYearEnd ? parseInt(selectedYearEnd) : availableYears[availableYears.length - 1]
                            ]}
                            min={availableYears[0]}
                            max={availableYears[availableYears.length - 1]}
                            step={1}
                            onValueChange={handleYearRangeChange}
                            className="w-full"
                          />
                          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>{availableYears[0]}</span>
                            <span>{availableYears[availableYears.length - 1]}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Selected Year:</span>
                          <span className="text-sm font-medium text-primary">
                            {selectedYearStart}
                          </span>
                        </div>
                        <div className="pt-4">
                          <Slider
                            value={[parseInt(selectedYearStart as string)]}
                            min={availableYears[0]}
                            max={availableYears[availableYears.length - 1]}
                            step={1}
                            onValueChange={(val) => handleSingleYearChange(val[0])}
                            className="w-full"
                          />
                          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>{availableYears[0]}</span>
                            <span>{availableYears[availableYears.length - 1]}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 text-xs w-full"
                      onClick={() => {
                        setSelectedYearStart(availableYears[0].toString());
                        setSelectedYearEnd(availableYears[availableYears.length - 1].toString());
                      }}
                    >
                      Reset Year Filters
                    </Button>
                  </div>
                )}
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="UN Sustainability Goals">
                <div className="p-2 grid grid-cols-3 gap-1">
                  {Array.from({ length: 17 }, (_, i) => i + 1).map((goal) => (
                    <div
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={cn(
                        "flex flex-col items-center justify-center p-2 rounded-md cursor-pointer text-xs font-medium transition-colors",
                        selectedGoals.includes(goal) 
                          ? `bg-goal-${goal} text-white` 
                          : "bg-secondary hover:bg-secondary/80"
                      )}
                      style={{
                        backgroundColor: selectedGoals.includes(goal) 
                          ? getGoalColor(goal)
                          : undefined
                      }}
                    >
                      <span className="font-bold">{goal}</span>
                      <span className="truncate text-[10px] max-w-full text-center">
                        {GOAL_NAMES[goal - 1].split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </CommandGroup>
            </CommandList>
            <div className="flex items-center justify-between p-2 border-t">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
              <Button size="sm" onClick={handleFilterChange}>
                Apply Filters
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      {activeFilters > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          {generalBusinessFilter && (
            <Badge variant="secondary" className="h-9 flex items-center gap-1 animate-slide-in bg-blue-100 text-blue-800">
              <BookOpen className="h-3.5 w-3.5" />
              Business Journals Only
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 rounded-full"
                onClick={() => setGeneralBusinessFilter(false)}
              >
                <span className="sr-only">Remove</span>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {topJournalsFilter && (
            <Badge variant="secondary" className="h-9 flex items-center gap-1 animate-slide-in bg-amber-100 text-amber-800">
              <Award className="h-3.5 w-3.5" />
              Top Journals Only
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 rounded-full"
                onClick={() => setTopJournalsFilter(false)}
              >
                <span className="sr-only">Remove</span>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {selectedDepartment && (
            <Badge variant="outline" className="h-9 flex items-center gap-1 animate-slide-in">
              Department: {selectedDepartment}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 rounded-full"
                onClick={() => {
                  setSelectedDepartment(null); 
                  onFilterChange(
                    null, 
                    [selectedYearStart, selectedYearEnd], 
                    selectedGoals.length > 0 ? selectedGoals : null, 
                    sustainabilityFilter,
                    generalBusinessFilter,
                    topJournalsFilter
                  );
                }}
              >
                <span className="sr-only">Remove</span>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {(selectedYearStart || selectedYearEnd) && (
            <Badge variant="outline" className="h-9 flex items-center gap-1 animate-slide-in">
              Year: {selectedYearStart === selectedYearEnd 
                ? selectedYearStart 
                : `${selectedYearStart} - ${selectedYearEnd}`}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 rounded-full"
                onClick={() => {
                  setSelectedYearStart(availableYears[0].toString());
                  setSelectedYearEnd(availableYears[availableYears.length - 1].toString());
                  onFilterChange(
                    selectedDepartment, 
                    [null, null], 
                    selectedGoals.length > 0 ? selectedGoals : null, 
                    sustainabilityFilter,
                    generalBusinessFilter,
                    topJournalsFilter
                  );
                }}
              >
                <span className="sr-only">Remove</span>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {sustainabilityFilter !== null && (
            <Badge variant="outline" className="h-9 flex items-center gap-1 animate-slide-in">
              {sustainabilityFilter ? 'Sustainable' : 'Not Sustainable'}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 rounded-full"
                onClick={() => {
                  setSustainabilityFilter(null); 
                  onFilterChange(
                    selectedDepartment, 
                    [selectedYearStart, selectedYearEnd], 
                    selectedGoals.length > 0 ? selectedGoals : null, 
                    null,
                    generalBusinessFilter,
                    topJournalsFilter
                  );
                }}
              >
                <span className="sr-only">Remove</span>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {selectedGoals.length > 0 && (
            <Badge variant="outline" className="h-9 flex items-center gap-1 animate-slide-in">
              Goals: {selectedGoals.join(', ')}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 rounded-full"
                onClick={() => {
                  setSelectedGoals([]); 
                  onFilterChange(
                    selectedDepartment, 
                    [selectedYearStart, selectedYearEnd], 
                    null, 
                    sustainabilityFilter,
                    generalBusinessFilter,
                    topJournalsFilter
                  );
                }}
              >
                <span className="sr-only">Remove</span>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

function getGoalColor(goalNumber: number): string {
  const GOAL_COLORS = [
    "#E5243B", "#DDA63A", "#4C9F38", "#C5192D", "#FF3A21", 
    "#26BDE2", "#FCC30B", "#A21942", "#FD6925", "#DD1367", 
    "#FD9D24", "#BF8B2E", "#3F7E44", "#0A97D9", "#56C02B", 
    "#00689D", "#19486A"
  ];
  
  return GOAL_COLORS[goalNumber - 1] || "#3B82F6";
}

export default FilterBar;
