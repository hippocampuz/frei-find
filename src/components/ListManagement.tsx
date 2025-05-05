
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SavedList } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ListChecks, Plus, Download, Info } from "lucide-react";

interface ListManagementProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompanies: string[];
  savedLists: SavedList[];
  onSaveNewList: (name: string) => void;
  onAddToExistingList: (listId: string) => void;
}

const ListManagement = ({
  isOpen,
  onClose,
  selectedCompanies,
  savedLists,
  onSaveNewList,
  onAddToExistingList,
}: ListManagementProps) => {
  const [newListName, setNewListName] = useState("");
  const [activeTab, setActiveTab] = useState("new");
  const { toast } = useToast();

  const handleSaveNewList = () => {
    if (!newListName.trim()) {
      toast({
        title: "Feil",
        description: "Vennligst skriv inn et navn for listen.",
        variant: "destructive",
      });
      return;
    }

    onSaveNewList(newListName);
    setNewListName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Liste med selskaper</DialogTitle>
          <DialogDescription>
            {selectedCompanies.length} selskaper er valgt. Lagre dem i en ny liste eller legg dem til i en eksisterende.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new" className="flex items-center gap-1.5">
              <Plus size={16} />
              <span>Ny liste</span>
            </TabsTrigger>
            <TabsTrigger value="existing" className="flex items-center gap-1.5">
              <ListChecks size={16} />
              <span>Eksisterende lister</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="new" className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Skriv inn listenavn..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                    <Info size={14} />
                    <span>Tips</span>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Tips for gode lister</h4>
                    <p className="text-sm text-muted-foreground">
                      Gi listen et beskrivende navn som forteller hva slags selskaper den inneholder, f.eks. "Tech-selskaper i Oslo" eller "Produksjonsbedrifter 50M+".
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Avbryt
                </Button>
                <Button onClick={handleSaveNewList}>
                  Lagre ny liste
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="existing" className="py-4">
            {savedLists.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  {savedLists.map((list) => (
                    <div
                      key={list.id}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{list.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {list.companyIds.length} selskaper
                        </span>
                      </div>
                      <Button
                        onClick={() => onAddToExistingList(list.id)}
                        size="sm"
                      >
                        Legg til
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={onClose}>
                    Lukk
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                  <ListChecks className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium">Ingen lagrede lister</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Du har ikke lagret noen lister enda.
                </p>
                <Button onClick={() => setActiveTab("new")} variant="outline" className="gap-1.5">
                  <Plus size={16} />
                  <span>Opprett ny liste</span>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ListManagement;
