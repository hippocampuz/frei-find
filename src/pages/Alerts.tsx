
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AlertTriggerForm from "@/components/AlertTriggerForm";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AlertTrigger, SavedList } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, BellOff, Calendar, ChevronRight, Copy, Edit, Trash2, AlertTriangle, 
  RefreshCcw, Settings, Activity, Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { mockSavedLists } from "@/utils/mockData";

// Mock data for alerts
const mockAlerts: AlertTrigger[] = [
  {
    id: "alert1",
    name: "Nye tech-selskaper i Oslo",
    type: "newCompany",
    listId: "list1",
    enabled: true,
    createdAt: new Date("2024-01-15"),
    lastTriggered: new Date("2024-04-28"),
    configuration: {
      notifyVia: ["email", "hubspot"],
      frequency: "immediately",
    }
  },
  {
    id: "alert2",
    name: "Omsetningsendringer > 20%",
    type: "financialChange",
    listId: "list2",
    enabled: true,
    createdAt: new Date("2024-02-10"),
    configuration: {
      threshold: 20,
      notifyVia: ["email"],
      frequency: "weekly",
    }
  },
  {
    id: "alert3",
    name: "Lederendringer i produksjonsbedrifter",
    type: "leadershipChange",
    listId: "list3",
    enabled: false,
    createdAt: new Date("2024-03-05"),
    configuration: {
      notifyVia: ["hubspot"],
      frequency: "daily",
    }
  },
];

const Alerts = () => {
  const [alerts, setAlerts] = useState<AlertTrigger[]>([]);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [showNewAlertForm, setShowNewAlertForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState<AlertTrigger | undefined>(undefined);
  const [alertToDelete, setAlertToDelete] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real implementation, we would fetch these from an API
    setAlerts(mockAlerts);
    setSavedLists(mockSavedLists);
  }, []);
  
  const handleToggleAlert = (alertId: string, enabled: boolean) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, enabled } : alert
    ));
    
    toast({
      title: enabled ? "Varsling aktivert" : "Varsling deaktivert",
      description: `Varsling er nå ${enabled ? "aktiv" : "inaktiv"}.`,
    });
  };
  
  const handleSaveAlert = (newAlert: Omit<AlertTrigger, 'id' | 'createdAt'>) => {
    if (editingAlert) {
      // Update existing alert
      const updatedAlerts = alerts.map(alert => 
        alert.id === editingAlert.id 
          ? { ...newAlert, id: alert.id, createdAt: alert.createdAt, lastTriggered: alert.lastTriggered } 
          : alert
      );
      setAlerts(updatedAlerts);
      
      toast({
        title: "Varsling oppdatert",
        description: `Varslingen "${newAlert.name}" er nå oppdatert.`,
      });
    } else {
      // Create new alert
      const alert: AlertTrigger = {
        ...newAlert,
        id: `alert${alerts.length + 1}`,
        createdAt: new Date(),
      };
      
      setAlerts([...alerts, alert]);
      
      toast({
        title: "Varsling opprettet",
        description: `Ny varsling "${alert.name}" er nå aktiv.`,
      });
    }
    
    setEditingAlert(undefined);
  };
  
  const handleDeleteAlert = () => {
    if (!alertToDelete) return;
    
    const alertName = alerts.find(a => a.id === alertToDelete)?.name;
    
    setAlerts(alerts.filter(alert => alert.id !== alertToDelete));
    
    toast({
      title: "Varsling slettet",
      description: `Varslingen "${alertName}" er nå slettet.`,
    });
    
    setAlertToDelete(null);
  };
  
  const handleDuplicateAlert = (alert: AlertTrigger) => {
    const newAlert: AlertTrigger = {
      ...alert,
      id: `alert${alerts.length + 1}`,
      name: `${alert.name} (kopi)`,
      createdAt: new Date(),
    };
    
    setAlerts([...alerts, newAlert]);
    
    toast({
      title: "Varsling duplisert",
      description: `En kopi av "${alert.name}" er nå opprettet.`,
    });
  };
  
  const getListName = (listId: string) => {
    const list = savedLists.find(l => l.id === listId);
    return list ? list.name : "Ukjent liste";
  };
  
  const getAlertTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      newCompany: "Nye selskaper",
      financialChange: "Økonomiske endringer",
      ownershipChange: "Eierskifte",
      newRoles: "Nye stillinger",
      leadershipChange: "Lederskifte",
      addressChange: "Adresseendring",
      websiteChange: "Nettside oppdatering",
      newTenders: "Nye anbud",
      creditScoreChange: "Kredittscore endring",
      bankruptcyRisk: "Konkursrisiko",
    };
    
    return typeMap[type] || type;
  };
  
  const getAlertTypeIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      newCompany: <Plus size={16} />,
      financialChange: <Activity size={16} />,
      ownershipChange: <RefreshCcw size={16} />,
      leadershipChange: <Settings size={16} />,
      bankruptcyRisk: <AlertTriangle size={16} />,
    };
    
    return iconMap[type] || <Bell size={16} />;
  };
  
  const getFrequencyLabel = (frequency: string) => {
    const frequencyMap: Record<string, string> = {
      immediately: "Umiddelbart",
      daily: "Daglig",
      weekly: "Ukentlig",
    };
    
    return frequencyMap[frequency] || frequency;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Varslinger</h1>
          <p className="text-muted-foreground">
            Sett opp automatiske varsler for endringer i selskaper du følger med på
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <span className="text-lg font-medium">Dine varslinger</span>
            <span className="ml-2 bg-frei-blue/10 text-frei-blue px-2 py-0.5 rounded-full text-xs">
              {alerts.filter(a => a.enabled).length} aktive
            </span>
          </div>
          
          <Button onClick={() => setShowNewAlertForm(true)} className="gap-1.5">
            <Bell size={16} />
            <span>Ny varsling</span>
          </Button>
        </div>
        
        <div className="space-y-4">
          {alerts.length > 0 ? (
            alerts.map((alert) => {
              const list = savedLists.find(l => l.id === alert.listId);
              
              return (
                <div 
                  key={alert.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    alert.enabled ? 'bg-card' : 'bg-muted/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{alert.name}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                          alert.enabled ? 'bg-frei-teal/10 text-frei-teal' : 'bg-muted-foreground/20 text-muted-foreground'
                        }`}>
                          {getAlertTypeIcon(alert.type)}
                          {getAlertTypeLabel(alert.type)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          Overvåker liste: 
                          <strong className="text-foreground font-medium">
                            {getListName(alert.listId)}
                          </strong>
                          {list && (
                            <span className="text-xs text-muted-foreground">
                              ({list.companyIds.length} selskaper)
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
                            <Calendar size={14} />
                            <span className="text-xs">{getFrequencyLabel(alert.configuration.frequency)}</span>
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium">Varslingsfrekvens: {getFrequencyLabel(alert.configuration.frequency)}</h4>
                            <p className="text-sm text-muted-foreground">
                              {alert.configuration.frequency === 'immediately'
                                ? 'Du mottar varsler umiddelbart når hendelser inntreffer.'
                                : alert.configuration.frequency === 'daily'
                                ? 'Du mottar en daglig oppsummering av alle hendelser.'
                                : 'Du mottar en ukentlig oppsummering av alle hendelser.'}
                            </p>
                            {alert.lastTriggered && (
                              <p className="text-xs text-muted-foreground border-t pt-2 mt-2">
                                Sist utløst: {alert.lastTriggered.toLocaleDateString('no-NO')}
                              </p>
                            )}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                      
                      <Switch 
                        checked={alert.enabled} 
                        onCheckedChange={(checked) => handleToggleAlert(alert.id, checked)}
                      />
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Alternativer</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setEditingAlert(alert)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Rediger
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateAlert(alert)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Dupliser
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => setAlertToDelete(alert.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Slett
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {alert.configuration.notifyVia.includes('email') && (
                      <span className="inline-flex items-center text-xs bg-muted px-2 py-1 rounded">
                        E-post
                      </span>
                    )}
                    {alert.configuration.notifyVia.includes('hubspot') && (
                      <span className="inline-flex items-center text-xs bg-muted px-2 py-1 rounded">
                        HubSpot
                      </span>
                    )}
                    {alert.configuration.notifyVia.includes('slack') && (
                      <span className="inline-flex items-center text-xs bg-muted px-2 py-1 rounded">
                        Slack
                      </span>
                    )}
                    
                    {alert.configuration.threshold && (
                      <span className="inline-flex items-center text-xs bg-muted px-2 py-1 rounded">
                        Terskel: {alert.configuration.threshold}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <BellOff className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Ingen varslinger oppsatt</h3>
              <p className="text-muted-foreground mt-1 mb-6 max-w-md mx-auto">
                Opprett varslinger for å bli informert automatisk når det skjer endringer med selskapene du følger med på.
              </p>
              <Button onClick={() => setShowNewAlertForm(true)}>
                Opprett din første varsling
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <AlertTriggerForm 
        isOpen={showNewAlertForm || !!editingAlert}
        onClose={() => {
          setShowNewAlertForm(false);
          setEditingAlert(undefined);
        }}
        onSave={handleSaveAlert}
        savedLists={savedLists}
        editTrigger={editingAlert}
      />
      
      <AlertDialog open={!!alertToDelete} onOpenChange={() => setAlertToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
            <AlertDialogDescription>
              Dette vil permanent slette varslingen. Du kan ikke angre denne handlingen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAlert} className="bg-destructive text-destructive-foreground">
              Slett
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Alerts;
