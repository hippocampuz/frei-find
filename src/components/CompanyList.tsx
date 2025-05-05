
import { useState } from "react";
import { Company } from "@/types";
import CompanyCard from "./CompanyCard";
import { Button } from "@/components/ui/button";
import { ListChecks, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface CompanyListProps {
  companies: Company[];
  selectedCompanies: string[];
  onSelectCompany: (companyId: string) => void;
  onUnselectCompany: (companyId: string) => void;
  onSaveList: () => void;
}

const CompanyList = ({
  companies,
  selectedCompanies,
  onSelectCompany,
  onUnselectCompany,
  onSaveList,
}: CompanyListProps) => {
  const [sortBy, setSortBy] = useState("relevance");
  const { toast } = useToast();
  
  // Sort companies based on selected criteria
  const sortedCompanies = [...companies].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "revenue-high":
        return b.financials.revenue - a.financials.revenue;
      case "revenue-low":
        return a.financials.revenue - b.financials.revenue;
      case "employees-high":
        return b.financials.employees - a.financials.employees;
      case "employees-low":
        return a.financials.employees - b.financials.employees;
      case "profit-high":
        return b.financials.profit - a.financials.profit;
      default:
        return 0; // Default to original order
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="text-sm text-muted-foreground">
          {companies.length} bedrifter funnet
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Sorter etter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevans</SelectItem>
              <SelectItem value="name">Navn (A-Å)</SelectItem>
              <SelectItem value="revenue-high">Omsetning (høy til lav)</SelectItem>
              <SelectItem value="revenue-low">Omsetning (lav til høy)</SelectItem>
              <SelectItem value="employees-high">Ansatte (høy til lav)</SelectItem>
              <SelectItem value="employees-low">Ansatte (lav til høy)</SelectItem>
              <SelectItem value="profit-high">Resultat (høy til lav)</SelectItem>
            </SelectContent>
          </Select>
          
          {selectedCompanies.length > 0 && (
            <Button
              onClick={onSaveList}
              variant="outline"
              className="gap-1.5"
            >
              <ListChecks size={16} />
              <span>Lagre liste ({selectedCompanies.length})</span>
            </Button>
          )}
        </div>
      </div>
      
      {companies.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {sortedCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              isInList={selectedCompanies.includes(company.id)}
              onAddToList={onSelectCompany}
              onRemoveFromList={onUnselectCompany}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <Filter className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Ingen bedrifter funnet</h3>
          <p className="text-muted-foreground mt-2">
            Prøv å justere søkekriteriene dine for å se flere resultater.
          </p>
        </div>
      )}
    </div>
  );
};

export default CompanyList;
