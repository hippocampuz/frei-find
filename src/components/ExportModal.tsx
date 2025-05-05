
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SavedList } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Download, CheckCircle } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  list: SavedList | null;
  companyCount: number;
}

const ExportModal = ({
  isOpen,
  onClose,
  list,
  companyCount,
}: ExportModalProps) => {
  const { toast } = useToast();

  const handleExportToHubSpot = () => {
    // This would be where the actual export logic would happen
    toast({
      title: "Eksport startet",
      description: `${companyCount} selskaper blir nå eksportert til HubSpot.`,
    });
    
    setTimeout(() => {
      toast({
        title: "Eksport fullført",
        description: `${companyCount} selskaper er nå tilgjengelige i din HubSpot-konto.`,
        variant: "success",
      });
      
      onClose();
    }, 2000);
  };

  const handleDownloadCSV = () => {
    toast({
      title: "Last ned CSV",
      description: "Laster ned liste som CSV-fil...",
    });
    
    setTimeout(() => {
      toast({
        title: "Nedlasting fullført",
        description: "CSV-filen er klar til bruk.",
        variant: "success",
      });
    }, 1000);
  };
  
  if (!list) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Eksporter liste: {list.name}</DialogTitle>
          <DialogDescription>
            Eksporter denne listen til HubSpot eller last ned som CSV-fil.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="bg-muted/50 rounded-lg p-4 border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-frei-blue/10 flex items-center justify-center text-frei-blue">
                <svg viewBox="0 0 200 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                  <path d="M41.667 116.667h29.166V150c0 4.583 5.834 7.5 10 4.167l58.334-58.334c3.75-3.75 1.25-10-4.167-10h-29.167V52.5c0-4.583-5.833-7.5-10-4.167L37.5 106.667c-3.75 3.75-1.25 10 4.167 10Z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Eksporter til HubSpot</h3>
                <p className="text-sm text-muted-foreground">
                  Eksporter {companyCount} selskaper direkte til din HubSpot-konto.
                </p>
              </div>
              <Button onClick={handleExportToHubSpot} className="flex-shrink-0">
                Eksporter
              </Button>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-frei-blue/10 flex items-center justify-center text-frei-blue">
                <Download size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Last ned som CSV</h3>
                <p className="text-sm text-muted-foreground">
                  Last ned listen som en CSV-fil for bruk i andre programmer.
                </p>
              </div>
              <Button variant="outline" onClick={handleDownloadCSV} className="flex-shrink-0">
                Last ned
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-1 text-sm text-muted-foreground">
            <CheckCircle size={14} className="text-green-500" />
            <span>All data er i samsvar med GDPR og personvernlovgivningen.</span>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Lukk
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
