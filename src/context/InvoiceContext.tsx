import React, { createContext, useState, useContext } from 'react';
import { Invoice, EventCard, ClientDetails } from '../types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

interface InvoiceContextProps {
  currentInvoice: Partial<Invoice>;
  startNewInvoice: () => void;
  updateEvents: (events: EventCard[]) => void;
  updateClientDetails: (details: ClientDetails) => void;
  finalizeInvoice: () => Promise<Invoice>;
  buildQuotation: () => Invoice; // ✅ ADD
}

const InvoiceContext = createContext<InvoiceContextProps | undefined>(undefined);

const generateInvoiceNumber = (count: number) => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  return `GP${day}${month}${year}-${String(count).padStart(3, '0')}`;
};

export const InvoiceProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [currentInvoice, setCurrentInvoice] = useState<Partial<Invoice>>({});

  const startNewInvoice = () => {
    setCurrentInvoice({
      events: [],
      client: {
        name: '',
        phone: '',
        eventDate: new Date().toISOString(),
        dateIssued: new Date().toISOString(),
        advance: 0,
      },
    });
  };

  const updateEvents = (events: EventCard[]) => {
    setCurrentInvoice(prev => ({ ...prev, events }));
  };

  const updateClientDetails = (details: ClientDetails) => {
    setCurrentInvoice(prev => ({
      ...prev,
      client: {
        ...prev.client,
        ...details,
        advance: details.advance ?? 0,
      },
    }));
  };

  // 🔴 INVOICE (number + save)
  const finalizeInvoice = async (): Promise<Invoice> => {
    const events = currentInvoice.events || [];
    let subtotal = 0;

    events.forEach(e =>
      e.services.forEach(s => (subtotal += Number(s.amount)))
    );

    const advance = currentInvoice.client?.advance || 0;
    const total = Math.max(subtotal - advance, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, 'invoices'),
      where('createdAt', '>=', today.toISOString())
    );

    const snapshot = await getDocs(q);
    const invoiceNumber = generateInvoiceNumber(snapshot.size + 1);

    const final: Invoice = {
      id: invoiceNumber,
      client: currentInvoice.client!,
      events,
      subtotal,
      total,
      createdAt: new Date().toISOString(),
      mode: 'invoice',
    };

    setCurrentInvoice(final);
    return final;
  };

  // 🟢 QUOTATION (NO number, NO save)
  const buildQuotation = (): Invoice => {
    const events = currentInvoice.events || [];
    let subtotal = 0;

    events.forEach(e =>
      e.services.forEach(s => (subtotal += Number(s.amount)))
    );

    return {
      id: '',
      client: currentInvoice.client!,
      events,
      subtotal,
      total: subtotal,
      createdAt: new Date().toISOString(),
      mode: 'quotation',
    };
  };

  return (
    <InvoiceContext.Provider
      value={{
        currentInvoice,
        startNewInvoice,
        updateEvents,
        updateClientDetails,
        finalizeInvoice,
        buildQuotation,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error('useInvoice must be used inside provider');
  return ctx;
};
