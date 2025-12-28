export type InvoiceMode = 'invoice' | 'quotation';

export interface ServiceItem {
  id: string;
  name: string;
  amount: number;
}

export interface EventCard {
  id: string;
  eventType: string; // "Wedding", "Haldi", etc.
  services: ServiceItem[];
}

export interface ClientDetails {
  name: string;
  phone: string;
  eventDate?: string; // ISO Date string
  dateIssued?: string; // ISO Date string
  advance?: number;
}

export interface Invoice {
  id: string;
  client: ClientDetails;
  events: EventCard[];
  subtotal: number;
  total: number;
  mode?: InvoiceMode;
  advance?: number;
  createdAt: string;
  pdfUrl?: string; // URL from Firebase Storage
  storagePath?: string; // Path in Firebase Storage
}

export type RootStackParamList = {
  Splash: undefined;

  Home: undefined;

  EventSelection: {
    mode?: InvoiceMode;
  };

  Services: {
    mode?: InvoiceMode;
  };

  ClientDetails: {
    mode?: InvoiceMode;
  };

  Preview: {
    readOnly?: boolean;
    invoiceId?: string;
    mode?: 'invoice' | 'quotation';
  };

  History: undefined;
};


