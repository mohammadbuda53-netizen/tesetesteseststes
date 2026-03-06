'use client';

import { useState } from 'react';
import { Handwerker } from '@/types';

interface HandwerkerFormProps {
  onSubmit: (data: Omit<Handwerker, 'id' | 'erstellt'>) => void;
  onCancel: () => void;
  initialData?: Handwerker;
}

export default function HandwerkerForm({ onSubmit, onCancel, initialData }: HandwerkerFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    vorname: initialData?.vorname || '',
    fachgebiet: initialData?.fachgebiet || '',
    telefon: initialData?.telefon || '',
    email: initialData?.email || '',
    stundensatz: initialData?.stundensatz || 0,
    verfuegbar: initialData?.verfuegbar ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vorname</label>
          <input
            type="text"
            required
            value={formData.vorname}
            onChange={(e) => setFormData({ ...formData, vorname: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nachname</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fachgebiet</label>
        <input
          type="text"
          required
          value={formData.fachgebiet}
          onChange={(e) => setFormData({ ...formData, fachgebiet: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="z.B. Elektriker, Klempner, Maler"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
          <input
            type="tel"
            required
            value={formData.telefon}
            onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stundensatz (€)</label>
        <input
          type="number"
          required
          min="0"
          step="0.01"
          value={formData.stundensatz}
          onChange={(e) => setFormData({ ...formData, stundensatz: parseFloat(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="verfuegbar"
          checked={formData.verfuegbar}
          onChange={(e) => setFormData({ ...formData, verfuegbar: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="verfuegbar" className="ml-2 block text-sm text-gray-700">
          Verfügbar
        </label>
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
