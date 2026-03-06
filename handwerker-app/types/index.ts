// Datentypen für die Handwerker-Management-App

export interface Handwerker {
  id: string;
  name: string;
  vorname: string;
  fachgebiet: string;
  telefon: string;
  email: string;
  stundensatz: number;
  verfuegbar: boolean;
  erstellt: string;
}

export interface Kunde {
  id: string;
  name: string;
  vorname: string;
  adresse: string;
  plz: string;
  ort: string;
  telefon: string;
  email: string;
  erstellt: string;
}

export interface Auftrag {
  id: string;
  kundeId: string;
  handwerkerId: string;
  titel: string;
  beschreibung: string;
  status: 'offen' | 'in_bearbeitung' | 'abgeschlossen' | 'storniert';
  prioritaet: 'niedrig' | 'mittel' | 'hoch';
  startDatum: string;
  endDatum?: string;
  kosten: number;
  erstellt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
