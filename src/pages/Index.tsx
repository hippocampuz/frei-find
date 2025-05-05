
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SearchFilters from "@/components/SearchFilters";
import CompanyList from "@/components/CompanyList";
import ListManagement from "@/components/ListManagement";
import ExportModal from "@/components/ExportModal"; 
import { Company, SavedList, SearchQuery } from "@/types";
import { mockCompanies, mockSavedLists } from "@/utils/mockData";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [showListManagement, setShowListManagement] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentList, setCurrentList] = useState<SavedList | null>(null);
  
  const { toast } = useToast();
  
  // Initialize with mock data
  useEffect(() => {
    setCompanies(mockCompanies);
    setFilteredCompanies(mockCompanies);
    setSavedLists(mockSavedLists);
  }, []);
  
  const handleSearch = (query: SearchQuery) => {
    console.log("Search query:", query);
    
    // Apply filters
    const filtered = companies.filter(company => {
      // Name filter
      if (query.name && !company.name.toLowerCase().includes(query.name.toLowerCase())) {
        return false;
      }
      
      // Industry filter
      if (query.industry && query.industry.length > 0 && !query.industry.includes(company.industry)) {
        return false;
      }
      
      // County filter
      if (query.county && query.county.length > 0 && !query.county.includes(company.location.county)) {
        return false;
      }
      
      // Revenue range filter
      if (query.revenue && (query.revenue[0] !== null || query.revenue[1] !== null)) {
        const [min, max] = query.revenue;
        if (min !== null && company.financials.revenue < min) {
          return false;
        }
        if (max !== null && company.financials.revenue > max) {
          return false;
        }
      }
      
      // Employees range filter
      if (query.employees && (query.employees[0] !== null || query.employees[1] !== null)) {
        const [min, max] = query.employees;
        if (min !== null && company.financials.employees < min) {
          return false;
        }
        if (max !== null && company.financials.employees > max) {
          return false;
        }
      }
      
      // Founded year range filter
      if (query.foundedYear && (query.foundedYear[0] !== null || query.foundedYear[1] !== null)) {
        const [min, max] = query.foundedYear;
        if (!company.foundedYear) {
          return false;
        }
        if (min !== null && company.foundedYear < min) {
          return false;
        }
        if (max !== null && company.foundedYear > max) {
          return false;
        }
      }
      
      return true;
    });
    
    setFilteredCompanies(filtered);
    
    toast({
      title: `${filtered.length} bedrifter funnet`,
      description: filtered.length > 0 
        ? "Filtrer ytterligere eller legg til bedrifter i en liste." 
        : "Prøv å utvide søkekriteriene dine.",
    });
  };
  
  const handleSelectCompany = (companyId: string) => {
    if (!selectedCompanyIds.includes(companyId)) {
      setSelectedCompanyIds([...selectedCompanyIds, companyId]);
    }
  };
  
  const handleUnselectCompany = (companyId: string) => {
    setSelectedCompanyIds(selectedCompanyIds.filter(id => id !== companyId));
  };
  
  const handleSaveList = () => {
    setShowListManagement(true);
  };
  
  const handleSaveNewList = (name: string) => {
    const newList: SavedList = {
      id: `list${savedLists.length + 1}`,
      name,
      companyIds: [...selectedCompanyIds],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setSavedLists([...savedLists, newList]);
    setSelectedCompanyIds([]);
    setShowListManagement(false);
    
    toast({
      title: "Liste opprettet",
      description: `Listen "${name}" med ${selectedCompanyIds.length} bedrifter er lagret.`,
      variant: "success",
    });
    
    // Show export modal for the newly created list
    setCurrentList(newList);
    setShowExportModal(true);
  };
  
  const handleAddToExistingList = (listId: string) => {
    const updatedLists = savedLists.map(list => {
      if (list.id === listId) {
        const existingIds = new Set(list.companyIds);
        let addedCount = 0;
        
        selectedCompanyIds.forEach(id => {
          if (!existingIds.has(id)) {
            existingIds.add(id);
            addedCount++;
          }
        });
        
        const updatedCompanyIds = Array.from(existingIds);
        
        toast({
          title: "Bedrifter lagt til",
          description: `${addedCount} nye bedrifter er lagt til i "${list.name}".`,
          variant: "success",
        });
        
        // Set current list for export modal
        setCurrentList({
          ...list,
          companyIds: updatedCompanyIds,
          updatedAt: new Date()
        });
        
        return {
          ...list,
          companyIds: updatedCompanyIds,
          updatedAt: new Date()
        };
      }
      return list;
    });
    
    setSavedLists(updatedLists);
    setSelectedCompanyIds([]);
    setShowListManagement(false);
    setShowExportModal(true);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Finn bedrifter</h1>
          <p className="text-muted-foreground">
            Søk og filtrer blant norske bedrifter med data fra BRREG
          </p>
        </div>
        
        <div className="space-y-6">
          <SearchFilters onSearch={handleSearch} />
          
          <CompanyList 
            companies={filteredCompanies}
            selectedCompanies={selectedCompanyIds}
            onSelectCompany={handleSelectCompany}
            onUnselectCompany={handleUnselectCompany}
            onSaveList={handleSaveList}
          />
        </div>
      </main>
      
      <ListManagement 
        isOpen={showListManagement}
        onClose={() => setShowListManagement(false)}
        selectedCompanies={selectedCompanyIds}
        savedLists={savedLists}
        onSaveNewList={handleSaveNewList}
        onAddToExistingList={handleAddToExistingList}
      />
      
      <ExportModal 
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        list={currentList}
        companyCount={currentList?.companyIds.length || 0}
      />
    </div>
  );
};

export default Index;
