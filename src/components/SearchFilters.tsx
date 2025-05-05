
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchQuery } from "@/types";
import { industries, counties } from "@/utils/mockData";
import { Search, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SearchFiltersProps {
  onSearch: (query: SearchQuery) => void;
}

const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const currentYear = new Date().getFullYear();
  
  const [query, setQuery] = useState<SearchQuery>({
    name: "",
    industry: [],
    county: [],
    revenue: [null, null],
    employees: [null, null],
    foundedYear: [null, null]
  });
  
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery({ ...query, name: e.target.value });
  };
  
  const handleIndustryChange = (industry: string, checked: boolean) => {
    setQuery(prev => {
      const currentIndustries = prev.industry || [];
      if (checked) {
        return { ...prev, industry: [...currentIndustries, industry] };
      } else {
        return { ...prev, industry: currentIndustries.filter(i => i !== industry) };
      }
    });
    
    updateActiveFilters("industry", industry, checked);
  };
  
  const handleCountyChange = (county: string, checked: boolean) => {
    setQuery(prev => {
      const currentCounties = prev.county || [];
      if (checked) {
        return { ...prev, county: [...currentCounties, county] };
      } else {
        return { ...prev, county: currentCounties.filter(c => c !== county) };
      }
    });
    
    updateActiveFilters("county", county, checked);
  };
  
  const handleRevenueChange = (values: number[]) => {
    setQuery({
      ...query,
      revenue: [values[0] * 1000000, values[1] * 1000000]
    });
    
    if (values[0] > 0 || values[1] < 300) {
      if (!activeFilters.includes("revenue")) {
        setActiveFilters([...activeFilters, "revenue"]);
      }
    } else {
      setActiveFilters(activeFilters.filter(f => f !== "revenue"));
    }
  };
  
  const handleEmployeesChange = (values: number[]) => {
    setQuery({
      ...query,
      employees: [values[0], values[1]]
    });
    
    if (values[0] > 0 || values[1] < 500) {
      if (!activeFilters.includes("employees")) {
        setActiveFilters([...activeFilters, "employees"]);
      }
    } else {
      setActiveFilters(activeFilters.filter(f => f !== "employees"));
    }
  };
  
  const updateActiveFilters = (type: string, value: string, add: boolean) => {
    const filterKey = `${type}:${value}`;
    
    if (add) {
      if (!activeFilters.includes(filterKey)) {
        setActiveFilters([...activeFilters, filterKey]);
      }
    } else {
      setActiveFilters(activeFilters.filter(f => f !== filterKey));
    }
  };
  
  const removeFilter = (filter: string) => {
    const [type, value] = filter.split(':');
    
    if (type === "industry") {
      handleIndustryChange(value, false);
    } else if (type === "county") {
      handleCountyChange(value, false);
    } else if (type === "revenue") {
      setQuery({
        ...query,
        revenue: [null, null]
      });
      setActiveFilters(activeFilters.filter(f => f !== "revenue"));
    } else if (type === "employees") {
      setQuery({
        ...query,
        employees: [null, null]
      });
      setActiveFilters(activeFilters.filter(f => f !== "employees"));
    }
  };
  
  const clearAllFilters = () => {
    setQuery({
      name: query.name,
      industry: [],
      county: [],
      revenue: [null, null],
      employees: [null, null],
      foundedYear: [null, null]
    });
    setActiveFilters([]);
  };
  
  const handleSearch = () => {
    onSearch(query);
  };
  
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Søk etter bedriftsnavn..."
            value={query.name || ""}
            onChange={handleNameChange}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="hidden md:flex gap-2"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <Filter size={18} />
            <span>Filter</span>
            {activeFilters.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1 flex items-center justify-center">
                {activeFilters.length}
              </Badge>
            )}
          </Button>
          <Button className="flex-1 md:flex-none" onClick={handleSearch}>
            Søk
          </Button>
        </div>
      </div>
      
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map(filter => {
            let label = filter;
            
            if (filter.startsWith("industry:")) {
              label = filter.replace("industry:", "");
            } else if (filter.startsWith("county:")) {
              label = filter.replace("county:", "");
            } else if (filter === "revenue") {
              const [min, max] = query.revenue || [null, null];
              if (min && max) {
                label = `Omsetning: ${min/1000000}-${max/1000000} mill`;
              } else if (min) {
                label = `Omsetning: >${min/1000000} mill`;
              } else if (max) {
                label = `Omsetning: <${max/1000000} mill`;
              }
            } else if (filter === "employees") {
              const [min, max] = query.employees || [null, null];
              if (min && max) {
                label = `Ansatte: ${min}-${max}`;
              } else if (min) {
                label = `Ansatte: >${min}`;
              } else if (max) {
                label = `Ansatte: <${max}`;
              }
            }
            
            return (
              <Badge 
                key={filter} 
                variant="outline" 
                className="flex items-center gap-1 px-2 py-1"
              >
                {label}
                <X 
                  size={14} 
                  className="cursor-pointer" 
                  onClick={() => removeFilter(filter)} 
                />
              </Badge>
            );
          })}
          
          {activeFilters.length > 1 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs"
              onClick={clearAllFilters}
            >
              Nullstill alle
            </Button>
          )}
        </div>
      )}
      
      <div className={`${showMobileFilters || 'hidden md:block'} bg-white rounded-lg border p-4`}>
        <Accordion type="single" collapsible className="w-full" defaultValue="industry">
          <AccordionItem value="industry">
            <AccordionTrigger>Bransje</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {industries.map((industry) => (
                  <div key={industry} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`industry-${industry}`} 
                      checked={(query.industry || []).includes(industry)}
                      onCheckedChange={(checked) => 
                        handleIndustryChange(industry, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`industry-${industry}`}
                      className="text-sm cursor-pointer"
                    >
                      {industry}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="location">
            <AccordionTrigger>Lokasjon</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {counties.map((county) => (
                  <div key={county} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`county-${county}`} 
                      checked={(query.county || []).includes(county)}
                      onCheckedChange={(checked) => 
                        handleCountyChange(county, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`county-${county}`}
                      className="text-sm cursor-pointer"
                    >
                      {county}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="financials">
            <AccordionTrigger>Økonomi</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Omsetning (millioner NOK)</Label>
                    <span className="text-sm text-muted-foreground">
                      {query.revenue && query.revenue[0] !== null ? Math.round(query.revenue[0]/1000000) : 0} - {
                      query.revenue && query.revenue[1] !== null ? Math.round(query.revenue[1]/1000000) : "300+"}
                    </span>
                  </div>
                  <Slider 
                    defaultValue={[0, 300]} 
                    max={300} 
                    step={5} 
                    onValueChange={handleRevenueChange}
                    value={[
                      query.revenue && query.revenue[0] !== null ? Math.round(query.revenue[0]/1000000) : 0, 
                      query.revenue && query.revenue[1] !== null ? Math.round(query.revenue[1]/1000000) : 300
                    ]}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Antall ansatte</Label>
                    <span className="text-sm text-muted-foreground">
                      {query.employees && query.employees[0] || 0} - {
                        query.employees && query.employees[1] || "500+"}
                    </span>
                  </div>
                  <Slider 
                    defaultValue={[0, 500]} 
                    max={500}
                    step={5}
                    onValueChange={handleEmployeesChange}
                    value={[
                      query.employees && query.employees[0] !== null ? query.employees[0] : 0, 
                      query.employees && query.employees[1] !== null ? query.employees[1] : 500
                    ]}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SearchFilters;
