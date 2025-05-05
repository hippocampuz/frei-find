
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTrigger, SavedList, TriggerType } from "@/types";
import { useToast } from "@/hooks/use-toast";

const TRIGGER_TYPES: { value: TriggerType; label: string; description: string }[] = [
  { 
    value: 'newCompany', 
    label: 'Nye selskaper', 
    description: 'Varsler når nye selskaper registreres som matcher kriteriene i listen'
  },
  { 
    value: 'financialChange', 
    label: 'Endringer i økonomiske tall', 
    description: 'Varsler ved betydelige endringer i omsetning, resultat eller eiendeler'
  },
  { 
    value: 'ownershipChange', 
    label: 'Eierskifte', 
    description: 'Varsler når det skjer endringer i eierstrukturen'
  },
  { 
    value: 'newRoles', 
    label: 'Nye stillinger', 
    description: 'Varsler når selskaper utlyser nye stillinger'
  },
  { 
    value: 'leadershipChange', 
    label: 'Lederskifte', 
    description: 'Varsler ved endringer i ledergruppen eller styret'
  },
  { 
    value: 'addressChange', 
    label: 'Adresseendring', 
    description: 'Varsler når et selskap flytter eller endrer adresse'
  },
  { 
    value: 'websiteChange', 
    label: 'Nettside oppdatering', 
    description: 'Varsler ved større endringer på selskapets nettside'
  },
  { 
    value: 'newTenders', 
    label: 'Nye anbud', 
    description: 'Varsler når selskaper legger ut nye anbud eller kontrakter'
  },
  { 
    value: 'creditScoreChange', 
    label: 'Endring i kredittscore', 
    description: 'Varsler ved endringer i kredittvurdering'
  },
  { 
    value: 'bankruptcyRisk', 
    label: 'Konkursrisiko', 
    description: 'Varsler ved økt risiko for konkurs basert på økonomiske indikatorer'
  }
];

interface AlertTriggerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trigger: Omit<AlertTrigger, 'id' | 'createdAt'>) => void;
  savedLists: SavedList[];
  editTrigger?: AlertTrigger;
}

const AlertTriggerForm = ({
  isOpen,
  onClose,
  onSave,
  savedLists,
  editTrigger
}: AlertTriggerFormProps) => {
  const [name, setName] = useState(editTrigger?.name || "");
  const [type, setType] = useState<TriggerType>(editTrigger?.type || 'newCompany');
  const [listId, setListId] = useState(editTrigger?.listId || "");
  const [enabled, setEnabled] = useState(editTrigger?.enabled ?? true);
  const [frequency, setFrequency] = useState(editTrigger?.configuration.frequency || 'immediately');
  const [notifyVia, setNotifyVia] = useState<('email' | 'hubspot' | 'slack')[]>(
    editTrigger?.configuration.notifyVia || ['email', 'hubspot']
  );
  const [threshold, setThreshold] = useState<number | undefined>(
    editTrigger?.configuration.threshold || undefined
  );
  
  const { toast } = useToast();
  
  const handleNotifyViaChange = (checked: boolean, value: 'email' | 'hubspot' | 'slack') => {
    if (checked) {
      setNotifyVia([...notifyVia, value]);
    } else {
      setNotifyVia(notifyVia.filter(item => item !== value));
    }
  };
  
  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Feil",
        description: "Vennligst angi et navn for varslingen",
        variant: "destructive"
      });
      return;
    }
    
    if (!listId) {
      toast({
        title: "Feil",
        description: "Vennligst velg en liste å overvåke",
        variant: "destructive"
      });
      return;
    }
    
    if (notifyVia.length === 0) {
      toast({
        title: "Feil",
        description: "Velg minst én varslingskanal",
        variant: "destructive"
      });
      return;
    }
    
    const newTrigger: Omit<AlertTrigger, 'id' | 'createdAt'> = {
      name,
      type,
      listId,
      enabled,
      configuration: {
        threshold,
        notifyVia,
        frequency,
        conditions: {}
      }
    };
    
    if (type === 'financialChange' && !threshold) {
      newTrigger.configuration.threshold = 10; // Default 10% change
    }
    
    onSave(newTrigger);
    onClose();
  };
  
  const selectedTriggerInfo = TRIGGER_TYPES.find(t => t.value === type);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{editTrigger ? "Rediger varsling" : "Opprett ny varsling"}</DialogTitle>
          <DialogDescription>
            Sett opp en automatisk varsling når noe endrer seg for selskapene du følger med på.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Navn på varsling</Label>
            <Input
              id="name"
              placeholder="F.eks. Nye tech-selskaper i Oslo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trigger-type">Type varsling</Label>
              <Select value={type} onValueChange={(value) => setType(value as TriggerType)}>
                <SelectTrigger id="trigger-type">
                  <SelectValue placeholder="Velg type" />
                </SelectTrigger>
                <SelectContent>
                  {TRIGGER_TYPES.map((trigger) => (
                    <SelectItem key={trigger.value} value={trigger.value}>
                      {trigger.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="list">Velg liste å overvåke</Label>
              <Select value={listId} onValueChange={setListId}>
                <SelectTrigger id="list">
                  <SelectValue placeholder="Velg liste" />
                </SelectTrigger>
                <SelectContent>
                  {savedLists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name} ({list.companyIds.length} selskaper)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedTriggerInfo && (
            <div className="bg-frei-light p-3 rounded-md text-sm text-frei-blue border border-frei-teal/30">
              <p>{selectedTriggerInfo.description}</p>
            </div>
          )}
          
          {(type === 'financialChange' || type === 'creditScoreChange') && (
            <div className="space-y-2">
              <Label htmlFor="threshold">Terskelverdi (% endring)</Label>
              <Input
                id="threshold"
                type="number"
                min={1}
                max={100}
                placeholder="F.eks. 10%"
                value={threshold || ''}
                onChange={(e) => setThreshold(parseInt(e.target.value) || undefined)}
              />
              <p className="text-xs text-muted-foreground">
                Du vil bli varslet ved endringer større enn denne prosentverdien.
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Varslingsfrekvens</Label>
            <Select value={frequency} onValueChange={(value) => setFrequency(value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediately">Umiddelbart</SelectItem>
                <SelectItem value="daily">Daglig oppsummering</SelectItem>
                <SelectItem value="weekly">Ukentlig oppsummering</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <Label>Varsle via</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notify-email" 
                  checked={notifyVia.includes('email')}
                  onCheckedChange={(checked) => handleNotifyViaChange(!!checked, 'email')}
                />
                <Label htmlFor="notify-email" className="cursor-pointer">E-post</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notify-hubspot" 
                  checked={notifyVia.includes('hubspot')}
                  onCheckedChange={(checked) => handleNotifyViaChange(!!checked, 'hubspot')}
                />
                <Label htmlFor="notify-hubspot" className="cursor-pointer">HubSpot (CRM-oppgave)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notify-slack" 
                  checked={notifyVia.includes('slack')}
                  onCheckedChange={(checked) => handleNotifyViaChange(!!checked, 'slack')}
                />
                <Label htmlFor="notify-slack" className="cursor-pointer">Slack</Label>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="enable" 
              checked={enabled}
              onCheckedChange={setEnabled}
            />
            <Label htmlFor="enable" className="cursor-pointer">Aktiver varsling</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Avbryt
          </Button>
          <Button onClick={handleSave}>
            {editTrigger ? "Oppdater varsling" : "Opprett varsling"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertTriggerForm;
