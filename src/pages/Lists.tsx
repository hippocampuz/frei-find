
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { SavedList, Company } from "@/types";
import { mockSavedLists, mockCompanies } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import ExportModal from "@/components/ExportModal";
import { ListChecks, ChevronLeft, MoreVertical, Download, Pencil, Trash2 } from "lucide-react";

const Lists = () => {
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentList, setCurrentList] = useState<SavedList | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    setSavedLists(mockSavedLists);
    setCompanies(mockCompanies);
  }, []);
  
  const handleDeleteList = (listId: string) => {
    setSavedLists(savedLists.filter(list => list.id !== listId));
    
    toast({
      title: "Liste slettet",
      description: "Listen er nå slettet.",
      variant: "default",
    });
  };
  
  const handleRenameList = (listId: string) => {
    const list = savedLists.find(list => list.id === listId);
    if (!list) return;
    
    // In a real app, would show a rename modal here
    const newName = `${list.name} (redigert)`;
    
    setSavedLists(
      savedLists.map(list => 
        list.id === listId 
          ? { ...list, name: newName, updatedAt: new Date() } 
          : list
      )
    );
    
    toast({
      title: "Liste oppdatert",
      description: `Listen er nå omdøpt til "${newName}".`,
      variant: "success",
    });
  };
  
  const handleExportList = (list: SavedList) => {
    setCurrentList(list);
    setShowExportModal(true);
  };
  
  // Function to get company details for a list
  const getListCompanies = (list: SavedList) => {
    return companies.filter(company => list.companyIds.includes(company.id));
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('nb-NO', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <ChevronLeft size={16} className="mr-1" />
              <span>Tilbake til søk</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold">Mine lister</h1>
          </div>
        </div>
        
        {savedLists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedLists.map((list) => {
              const listCompanies = getListCompanies(list);
              const industries = [...new Set(listCompanies.map(c => c.industry))];
              
              return (
                <Card key={list.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{list.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical size={16} />
                            <span className="sr-only">Åpne meny</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleExportList(list)}>
                            <Download size={16} className="mr-2" />
                            <span>Eksporter</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRenameList(list.id)}>
                            <Pencil size={16} className="mr-2" />
                            <span>Gi nytt navn</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteList(list.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 size={16} className="mr-2" />
                            <span>Slett liste</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>
                      Opprettet {formatDate(list.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Antall selskaper</span>
                        <span className="font-medium">{list.companyIds.length}</span>
                      </div>
                      
                      {industries.length > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Bransjer</span>
                          <span className="font-medium">
                            {industries.length > 2 
                              ? `${industries.length} forskjellige` 
                              : industries.join(", ")}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sist oppdatert</span>
                        <span className="font-medium">{formatDate(list.updatedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center gap-1.5"
                      onClick={() => handleExportList(list)}
                    >
                      <Download size={16} />
                      <span>Eksporter til HubSpot</span>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ListChecks size={24} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">Ingen lagrede lister</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Du har ikke opprettet eller lagret noen lister enda. Søk etter bedrifter og opprett din første liste.
            </p>
            <Button asChild>
              <Link to="/">Søk etter bedrifter</Link>
            </Button>
          </div>
        )}
      </main>
      
      <ExportModal 
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        list={currentList}
        companyCount={currentList?.companyIds.length || 0}
      />
    </div>
  );
};

export default Lists;
