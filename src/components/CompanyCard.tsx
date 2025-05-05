
import { useState } from "react";
import { Company } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Check, User, ChevronDown, ChevronUp, MapPin, LinkIcon } from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/mockData";

interface CompanyCardProps {
  company: Company;
  isInList: boolean;
  onAddToList: (companyId: string) => void;
  onRemoveFromList: (companyId: string) => void;
}

const CompanyCard = ({
  company,
  isInList,
  onAddToList,
  onRemoveFromList,
}: CompanyCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{company.name}</CardTitle>
            <CardDescription>Org.nr: {company.orgNumber}</CardDescription>
          </div>
          {isInList ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600 gap-1 h-8"
              onClick={() => onRemoveFromList(company.id)}
            >
              <Check size={16} />
              <span className="hidden sm:inline">Lagt til</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="gap-1 h-8"
              onClick={() => onAddToList(company.id)}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Legg til</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="bg-muted/50">
            {company.industry}
          </Badge>
          {company.sector && (
            <Badge variant="outline" className="bg-muted/50">
              {company.sector}
            </Badge>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={12} />
            <span>
              {company.location.city}, {company.location.county}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Omsetning</p>
            <p className="font-medium">{formatCurrency(company.financials.revenue)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Resultat</p>
            <p className="font-medium">{formatCurrency(company.financials.profit)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Ansatte</p>
            <p className="font-medium">{formatNumber(company.financials.employees)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Etablert</p>
            <p className="font-medium">{company.foundedYear || "N/A"}</p>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t">
            {company.description && (
              <p className="text-sm text-muted-foreground mb-4">
                {company.description}
              </p>
            )}

            {company.contacts && company.contacts.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Nøkkelpersoner</h4>
                {company.contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{contact.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {contact.title}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {contact.email && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
                          <a href={`mailto:${contact.email}`} title={contact.email}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-mail"
                            >
                              <rect width="20" height="16" x="2" y="4" rx="2" />
                              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                          </a>
                        </Button>
                      )}
                      {contact.phone && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
                          <a href={`tel:${contact.phone}`} title={contact.phone}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-phone"
                            >
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {company.website && (
              <div className="mt-4 flex items-center gap-2">
                <LinkIcon size={14} className="text-muted-foreground" />
                <a
                  href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-frei-teal hover:underline"
                >
                  {company.website}
                </a>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-center gap-1 text-muted-foreground"
          onClick={toggleExpanded}
        >
          <span>{expanded ? "Vis mindre" : "Vis mer"}</span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompanyCard;
