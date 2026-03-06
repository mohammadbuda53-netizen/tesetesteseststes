import { Handwerker, Kunde, Auftrag } from '@/types';

// In-Memory Datenspeicher (für Produktion würde man eine echte Datenbank verwenden)
let handwerker: Handwerker[] = [
  {
    id: '1',
    name: 'Müller',
    vorname: 'Hans',
    fachgebiet: 'Elektriker',
    telefon: '0171-1234567',
    email: 'h.mueller@email.de',
    stundensatz: 65,
    verfuegbar: true,
    erstellt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Schmidt',
    vorname: 'Peter',
    fachgebiet: 'Klempner',
    telefon: '0172-2345678',
    email: 'p.schmidt@email.de',
    stundensatz: 70,
    verfuegbar: true,
    erstellt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Weber',
    vorname: 'Anna',
    fachgebiet: 'Maler',
    telefon: '0173-3456789',
    email: 'a.weber@email.de',
    stundensatz: 55,
    verfuegbar: false,
    erstellt: new Date().toISOString(),
  },
];

let kunden: Kunde[] = [
  {
    id: '1',
    name: 'Bauer',
    vorname: 'Maria',
    adresse: 'Hauptstraße 12',
    plz: '10115',
    ort: 'Berlin',
    telefon: '030-12345678',
    email: 'm.bauer@email.de',
    erstellt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Fischer',
    vorname: 'Thomas',
    adresse: 'Gartenweg 5',
    plz: '80331',
    ort: 'München',
    telefon: '089-87654321',
    email: 't.fischer@email.de',
    erstellt: new Date().toISOString(),
  },
];

let auftraege: Auftrag[] = [
  {
    id: '1',
    kundeId: '1',
    handwerkerId: '1',
    titel: 'Elektroinstallation Neubau',
    beschreibung: 'Komplette Elektroinstallation für Neubau',
    status: 'in_bearbeitung',
    prioritaet: 'hoch',
    startDatum: new Date().toISOString(),
    kosten: 3500,
    erstellt: new Date().toISOString(),
  },
  {
    id: '2',
    kundeId: '2',
    handwerkerId: '2',
    titel: 'Wasserleitungen erneuern',
    beschreibung: 'Alte Wasserleitungen austauschen',
    status: 'offen',
    prioritaet: 'mittel',
    startDatum: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    kosten: 2800,
    erstellt: new Date().toISOString(),
  },
];

// Handwerker-Datenbank-Funktionen
export const getHandwerker = () => handwerker;
export const getHandwerkerById = (id: string) => handwerker.find(h => h.id === id);
export const createHandwerker = (data: Omit<Handwerker, 'id' | 'erstellt'>) => {
  const newHandwerker: Handwerker = {
    ...data,
    id: Date.now().toString(),
    erstellt: new Date().toISOString(),
  };
  handwerker.push(newHandwerker);
  return newHandwerker;
};
export const updateHandwerker = (id: string, data: Partial<Handwerker>) => {
  const index = handwerker.findIndex(h => h.id === id);
  if (index === -1) return null;
  handwerker[index] = { ...handwerker[index], ...data };
  return handwerker[index];
};
export const deleteHandwerker = (id: string) => {
  const index = handwerker.findIndex(h => h.id === id);
  if (index === -1) return false;
  handwerker.splice(index, 1);
  return true;
};

// Kunden-Datenbank-Funktionen
export const getKunden = () => kunden;
export const getKundeById = (id: string) => kunden.find(k => k.id === id);
export const createKunde = (data: Omit<Kunde, 'id' | 'erstellt'>) => {
  const newKunde: Kunde = {
    ...data,
    id: Date.now().toString(),
    erstellt: new Date().toISOString(),
  };
  kunden.push(newKunde);
  return newKunde;
};
export const updateKunde = (id: string, data: Partial<Kunde>) => {
  const index = kunden.findIndex(k => k.id === id);
  if (index === -1) return null;
  kunden[index] = { ...kunden[index], ...data };
  return kunden[index];
};
export const deleteKunde = (id: string) => {
  const index = kunden.findIndex(k => k.id === id);
  if (index === -1) return false;
  kunden.splice(index, 1);
  return true;
};

// Auftrags-Datenbank-Funktionen
export const getAuftraege = () => auftraege;
export const getAuftragById = (id: string) => auftraege.find(a => a.id === id);
export const createAuftrag = (data: Omit<Auftrag, 'id' | 'erstellt'>) => {
  const newAuftrag: Auftrag = {
    ...data,
    id: Date.now().toString(),
    erstellt: new Date().toISOString(),
  };
  auftraege.push(newAuftrag);
  return newAuftrag;
};
export const updateAuftrag = (id: string, data: Partial<Auftrag>) => {
  const index = auftraege.findIndex(a => a.id === id);
  if (index === -1) return null;
  auftraege[index] = { ...auftraege[index], ...data };
  return auftraege[index];
};
export const deleteAuftrag = (id: string) => {
  const index = auftraege.findIndex(a => a.id === id);
  if (index === -1) return false;
  auftraege.splice(index, 1);
  return true;
};
