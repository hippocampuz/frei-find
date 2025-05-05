
import { Company, SavedList } from "../types";

export const industries = [
  "IT og teknologi",
  "Helse og medisin",
  "Finans og forsikring",
  "Bygg og anlegg",
  "Konsulentvirksomhet",
  "Detaljhandel",
  "Industri og produksjon",
  "Transport og logistikk",
  "Energi",
  "Eiendom",
  "Media og kommunikasjon",
  "Utdanning"
];

export const counties = [
  "Oslo",
  "Viken",
  "Innlandet",
  "Vestfold og Telemark",
  "Agder",
  "Rogaland",
  "Vestland",
  "Møre og Romsdal",
  "Trøndelag",
  "Nordland",
  "Troms og Finnmark"
];

export const mockCompanies: Company[] = [
  {
    id: "1",
    name: "TechNorge AS",
    orgNumber: "123456789",
    industry: "IT og teknologi",
    sector: "Programvareutvikling",
    location: {
      city: "Oslo",
      county: "Oslo",
      address: "Teknologiveien 1",
      postalCode: "0371"
    },
    financials: {
      revenue: 45000000,
      profit: 8500000,
      assets: 30000000,
      employees: 42,
      year: 2023
    },
    contacts: [
      {
        id: "c1",
        name: "Erik Hansen",
        title: "Administrerende direktør",
        email: "erik.hansen@technorge.no",
        phone: "+47 912 34 567",
        linkedin: "linkedin.com/in/erikhansen"
      }
    ],
    foundedYear: 2010,
    website: "www.technorge.no",
    description: "Ledende teknologiselskap innen skyløsninger og digitalisering"
  },
  {
    id: "2",
    name: "Bygg Partner Norge AS",
    orgNumber: "987654321",
    industry: "Bygg og anlegg",
    location: {
      city: "Bergen",
      county: "Vestland",
      address: "Bygårdsveien 25",
      postalCode: "5007"
    },
    financials: {
      revenue: 120000000,
      profit: 15600000,
      assets: 85000000,
      employees: 130,
      year: 2023
    },
    contacts: [
      {
        id: "c2",
        name: "Anne Larsen",
        title: "Daglig leder",
        email: "anne.larsen@byggpartner.no",
        phone: "+47 934 56 789"
      }
    ],
    foundedYear: 1995,
    website: "www.byggpartner.no"
  },
  {
    id: "3",
    name: "FinansRåd AS",
    orgNumber: "912345678",
    industry: "Finans og forsikring",
    sector: "Rådgivning",
    location: {
      city: "Trondheim",
      county: "Trøndelag",
      address: "Finansparken 10",
      postalCode: "7030"
    },
    financials: {
      revenue: 28000000,
      profit: 6700000,
      assets: 15000000,
      employees: 18,
      year: 2023
    },
    foundedYear: 2015,
    website: "www.finansraad.no",
    description: "Økonomisk rådgivning for mellomstore bedrifter"
  },
  {
    id: "4",
    name: "Helseteknologi AS",
    orgNumber: "876543219",
    industry: "Helse og medisin",
    sector: "Medisinsk utstyr",
    location: {
      city: "Stavanger",
      county: "Rogaland",
      address: "Helseveien 5",
      postalCode: "4021"
    },
    financials: {
      revenue: 62000000,
      profit: 9300000,
      assets: 43000000,
      employees: 65,
      year: 2023
    },
    contacts: [
      {
        id: "c3",
        name: "Morten Olsen",
        title: "Teknisk direktør",
        email: "morten.olsen@helsetek.no",
        phone: "+47 976 54 321"
      }
    ],
    foundedYear: 2012,
    website: "www.helsetek.no"
  },
  {
    id: "5",
    name: "Transport Logistikk Norge AS",
    orgNumber: "765432198",
    industry: "Transport og logistikk",
    location: {
      city: "Drammen",
      county: "Viken",
      address: "Logistikkveien 18",
      postalCode: "3024"
    },
    financials: {
      revenue: 85000000,
      profit: 4200000,
      assets: 60000000,
      employees: 95,
      year: 2023
    },
    foundedYear: 2005,
    website: "www.transportlogistikk.no",
    description: "Landsdekkende transporttjenester med fokus på miljøvennlig drift"
  },
  {
    id: "6",
    name: "Nordisk Energi AS",
    orgNumber: "654321987",
    industry: "Energi",
    sector: "Fornybar energi",
    location: {
      city: "Tromsø",
      county: "Troms og Finnmark",
      address: "Energiparken 1",
      postalCode: "9019"
    },
    financials: {
      revenue: 175000000,
      profit: 38000000,
      assets: 230000000,
      employees: 120,
      year: 2023
    },
    contacts: [
      {
        id: "c4",
        name: "Lise Johansen",
        title: "Administrerende direktør",
        email: "lise.johansen@nordiskenergi.no",
        phone: "+47 941 23 456"
      }
    ],
    foundedYear: 2008,
    website: "www.nordiskenergi.no"
  },
  {
    id: "7",
    name: "Konsulent Partner AS",
    orgNumber: "543219876",
    industry: "Konsulentvirksomhet",
    location: {
      city: "Oslo",
      county: "Oslo",
      address: "Konsulenthuset 15",
      postalCode: "0287"
    },
    financials: {
      revenue: 37000000,
      profit: 9800000,
      assets: 14000000,
      employees: 25,
      year: 2023
    },
    contacts: [
      {
        id: "c5",
        name: "Kristian Berg",
        title: "Seniorrådgiver",
        email: "kristian.berg@konsulentpartner.no",
        phone: "+47 922 33 444"
      }
    ],
    foundedYear: 2017,
    website: "www.konsulentpartner.no",
    description: "Strategisk rådgivningstjenester for bedriftsutvikling"
  }
];

export const mockSavedLists: SavedList[] = [
  {
    id: "list1",
    name: "Tech-selskaper i Oslo",
    companyIds: ["1"],
    createdAt: new Date("2023-12-10"),
    updatedAt: new Date("2023-12-15")
  },
  {
    id: "list2",
    name: "Store bedrifter (100+ ansatte)",
    companyIds: ["2", "6"],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05")
  }
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('nb-NO', { 
    style: 'currency', 
    currency: 'NOK',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('nb-NO').format(number);
};
