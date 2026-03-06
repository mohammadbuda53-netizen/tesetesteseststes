export type HandwerkerStatus = "verfuegbar" | "im_einsatz" | "urlaub" | "krank";
export type ProjektStatus = "geplant" | "in_arbeit" | "pausiert" | "abgeschlossen" | "storniert";
export type RechnungStatus = "entwurf" | "gesendet" | "bezahlt" | "ueberfaellig" | "storniert";
export type TerminTyp = "besichtigung" | "arbeit" | "abnahme" | "beratung";
export type Gewerk = "elektro" | "sanitaer" | "heizung" | "maler" | "tischler" | "dachdecker" | "maurer" | "fliesen" | "boden" | "allgemein";

export interface Handwerker {
  id: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  gewerk: Gewerk;
  status: HandwerkerStatus;
  stundensatz: number;
  bewertung: number;
  bild?: string;
  adresse: string;
  erfahrungJahre: number;
}

export interface Kunde {
  id: string;
  firma?: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  adresse: string;
  notizen?: string;
  erstelltAm: string;
}

export interface Projekt {
  id: string;
  titel: string;
  beschreibung: string;
  kundeId: string;
  handwerkerIds: string[];
  status: ProjektStatus;
  startDatum: string;
  endDatum?: string;
  budget: number;
  ausgaben: number;
  adresse: string;
  notizen?: string;
}

export interface Termin {
  id: string;
  titel: string;
  projektId?: string;
  kundeId: string;
  handwerkerId: string;
  typ: TerminTyp;
  datum: string;
  startZeit: string;
  endZeit: string;
  notizen?: string;
  adresse: string;
}

export interface Rechnung {
  id: string;
  rechnungNr: string;
  projektId: string;
  kundeId: string;
  positionen: RechnungPosition[];
  status: RechnungStatus;
  erstelltAm: string;
  faelligAm: string;
  bezahltAm?: string;
  gesamtNetto: number;
  mwstSatz: number;
  gesamtBrutto: number;
}

export interface RechnungPosition {
  beschreibung: string;
  menge: number;
  einheit: string;
  einzelpreis: number;
  gesamt: number;
}
