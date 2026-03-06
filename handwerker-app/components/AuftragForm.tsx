'use client';

import { useState, useEffect } from 'react';
import { Auftrag, Kunde, Handwerker } from '@/types';

interface AuftragFormProps {
  onSubmit: (data: Omit<Auftrag, 'id' | 'erstellt'>) => void;
  onCancel: () => void;
  initialData?: Auftrag;
}

export default function AuftragForm({ onSubmit, onCancel, initialData }: AuftragFormProps) {
  const [kunden, setKunden] = useState<Kunde[]>([]);
  const [handwerker, setHandwerker] = useState<Handwerker[]>([]);
  const [formData, setFormData] = useState({
    kundeId: initialData?.kundeId || '',
    handwerkerId: initialData?.handwerkerId || '',
    titel: initialData?.titel || '',
    beschreibung: initialData?.beschreibung || '',
    status: initialData?.status || 'offen' as const,
    prioritaet: initialData?.prioritaet || 'mittel' as const,
    startDatum: initialData?.startDatum ? new Date(initialData.startDatum).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    endDatum: initialData?.endDatum ? new Date(initialData.endDatum).toISOString().split('T')[0] : '',
    kosten: initialData?.kosten || 0,
  });

  useEffect(() => {
    // Lade Kunden und Handwerker
    fetch('/api/kunden')
      .then(res => res.json())
      .then(data => setKunden(data.data || []));
    
    fetch('/api/handwerker')
      .then(res => res.json())
      .then(data => setHandwerker(data.data || []));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      startDatum: new Date(formData.startDatum).toISOString(),
      endDatum: formData.endDatum ? new Date(formData.endDatum).toISOString() : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
        <input
          type="text"
          required
          value={formData.titel}
          onChange={(e) => setFormData({ ...formData, titel: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
        <textarea
          required
          value={formData.beschreibung}
          onChange={(e) => setFormData({ ...formData, beschreibung: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kunde</label>
          <select
            required
            value={formData.kundeId}
            onChange={(e) => setFormData({ ...formData, kundeId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Kunde auswählen</option>
            {kunden.map(kunde => (
              <option key={kunde.id} value={kunde.id}>
                {kunde.vorname} {kunde.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Handwerker</label>
          <select
            required
            value={formData.handwerkerId}
            onChange={(e) => setFormData({ ...formData, handwerkerId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Handwerker auswählen</option>
            {handwerker.map(hw => (
              <option key={hw.id} value={hw.id}>
                {hw.vorname} {hw.name} ({hw.fachgebiet})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="offen">Offen</option>
            <option value="in_bearbeitung">In Bearbeitung</option>
            <option value="abgeschlossen">Abgeschlossen</option>
            <option value="storniert">Storniert</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priorität</label>
          <select
            value={formData.prioritaet}
            onChange={(e) => setFormData({ ...formData, prioritaet: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="niedrig">Niedrig</option>
            <option value="mittel">Mittel</option>
            <option value="hoch">Hoch</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kosten (€)</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.kosten}
            onChange={(e) => setFormData({ ...formData, kosten: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Startdatum</label>
          <input
            type="date"
            required
            value={formData.startDatum}
            onChange={(e) => setFormData({ ...formData, startDatum: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Enddatum (optional)</label>
          <input
            type="date"
            value={formData.endDatum}
            onChange={(e) => setFormData({ ...formData, endDatum: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {initialData ? 'Aktualisieren' : 'Hinzufügen'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
