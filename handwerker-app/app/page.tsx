'use client';

import { useState, useEffect } from 'react';
import { Handwerker, Kunde, Auftrag } from '@/types';
import HandwerkerForm from '@/components/HandwerkerForm';
import KundenForm from '@/components/KundenForm';
import AuftragForm from '@/components/AuftragForm';

type Tab = 'dashboard' | 'handwerker' | 'kunden' | 'auftraege';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [handwerker, setHandwerker] = useState<Handwerker[]>([]);
  const [kunden, setKunden] = useState<Kunde[]>([]);
  const [auftraege, setAuftraege] = useState<Auftrag[]>([]);
  const [showHandwerkerForm, setShowHandwerkerForm] = useState(false);
  const [showKundenForm, setShowKundenForm] = useState(false);
  const [showAuftragForm, setShowAuftragForm] = useState(false);
  const [editingHandwerker, setEditingHandwerker] = useState<Handwerker | undefined>();
  const [editingKunde, setEditingKunde] = useState<Kunde | undefined>();
  const [editingAuftrag, setEditingAuftrag] = useState<Auftrag | undefined>();

  // Daten laden
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [hwRes, kundenRes, auftraegeRes] = await Promise.all([
      fetch('/api/handwerker').then(r => r.json()),
      fetch('/api/kunden').then(r => r.json()),
      fetch('/api/auftraege').then(r => r.json()),
    ]);
    
    setHandwerker(hwRes.data || []);
    setKunden(kundenRes.data || []);
    setAuftraege(auftraegeRes.data || []);
  };

  // Handwerker-Funktionen
  const handleAddHandwerker = async (data: Omit<Handwerker, 'id' | 'erstellt'>) => {
    await fetch('/api/handwerker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    loadData();
    setShowHandwerkerForm(false);
  };

  const handleEditHandwerker = async (data: Omit<Handwerker, 'id' | 'erstellt'>) => {
    if (!editingHandwerker) return;
    await fetch('/api/handwerker', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingHandwerker.id, ...data }),
    });
    loadData();
    setEditingHandwerker(undefined);
    setShowHandwerkerForm(false);
  };

  const handleDeleteHandwerker = async (id: string) => {
    if (!confirm('Handwerker wirklich löschen?')) return;
    await fetch(`/api/handwerker?id=${id}`, { method: 'DELETE' });
    loadData();
  };

  // Kunden-Funktionen
  const handleAddKunde = async (data: Omit<Kunde, 'id' | 'erstellt'>) => {
    await fetch('/api/kunden', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    loadData();
    setShowKundenForm(false);
  };

  const handleEditKunde = async (data: Omit<Kunde, 'id' | 'erstellt'>) => {
    if (!editingKunde) return;
    await fetch('/api/kunden', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingKunde.id, ...data }),
    });
    loadData();
    setEditingKunde(undefined);
    setShowKundenForm(false);
  };

  const handleDeleteKunde = async (id: string) => {
    if (!confirm('Kunde wirklich löschen?')) return;
    await fetch(`/api/kunden?id=${id}`, { method: 'DELETE' });
    loadData();
  };

  // Auftrags-Funktionen
  const handleAddAuftrag = async (data: Omit<Auftrag, 'id' | 'erstellt'>) => {
    await fetch('/api/auftraege', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    loadData();
    setShowAuftragForm(false);
  };

  const handleEditAuftrag = async (data: Omit<Auftrag, 'id' | 'erstellt'>) => {
    if (!editingAuftrag) return;
    await fetch('/api/auftraege', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingAuftrag.id, ...data }),
    });
    loadData();
    setEditingAuftrag(undefined);
    setShowAuftragForm(false);
  };

  const handleDeleteAuftrag = async (id: string) => {
    if (!confirm('Auftrag wirklich löschen?')) return;
    await fetch(`/api/auftraege?id=${id}`, { method: 'DELETE' });
    loadData();
  };

  const getKundeName = (id: string) => {
    const kunde = kunden.find(k => k.id === id);
    return kunde ? `${kunde.vorname} ${kunde.name}` : 'Unbekannt';
  };

  const getHandwerkerName = (id: string) => {
    const hw = handwerker.find(h => h.id === id);
    return hw ? `${hw.vorname} ${hw.name}` : 'Unbekannt';
  };

  const statusColors = {
    offen: 'bg-yellow-100 text-yellow-800',
    in_bearbeitung: 'bg-blue-100 text-blue-800',
    abgeschlossen: 'bg-green-100 text-green-800',
    storniert: 'bg-red-100 text-red-800',
  };

  const prioritaetColors = {
    niedrig: 'bg-gray-100 text-gray-800',
    mittel: 'bg-orange-100 text-orange-800',
    hoch: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">🔧 Handwerker Management</h1>
          <p className="text-blue-100 mt-1">Verwalten Sie Handwerker, Kunden und Aufträge</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'handwerker', label: 'Handwerker', icon: '👷' },
              { id: 'kunden', label: 'Kunden', icon: '👥' },
              { id: 'auftraege', label: 'Aufträge', icon: '📋' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Handwerker</p>
                    <p className="text-3xl font-bold text-blue-600">{handwerker.length}</p>
                  </div>
                  <div className="text-4xl">👷</div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {handwerker.filter(h => h.verfuegbar).length} verfügbar
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Kunden</p>
                    <p className="text-3xl font-bold text-green-600">{kunden.length}</p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Aufträge</p>
                    <p className="text-3xl font-bold text-purple-600">{auftraege.length}</p>
                  </div>
                  <div className="text-4xl">📋</div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {auftraege.filter(a => a.status === 'in_bearbeitung').length} in Bearbeitung
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Umsatz</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {auftraege.reduce((sum, a) => sum + a.kosten, 0).toLocaleString('de-DE')}€
                    </p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>
            </div>

            {/* Aktuelle Aufträge */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Aktuelle Aufträge</h3>
              <div className="space-y-3">
                {auftraege
                  .filter(a => a.status === 'in_bearbeitung' || a.status === 'offen')
                  .slice(0, 5)
                  .map(auftrag => (
                    <div key={auftrag.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{auftrag.titel}</h4>
                          <p className="text-sm text-gray-600">
                            Kunde: {getKundeName(auftrag.kundeId)} | Handwerker: {getHandwerkerName(auftrag.handwerkerId)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[auftrag.status]}`}>
                            {auftrag.status.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${prioritaetColors[auftrag.prioritaet]}`}>
                            {auftrag.prioritaet}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Handwerker-Tab */}
        {activeTab === 'handwerker' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Handwerker</h2>
              <button
                onClick={() => {
                  setEditingHandwerker(undefined);
                  setShowHandwerkerForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                + Neuer Handwerker
              </button>
            </div>

            {showHandwerkerForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingHandwerker ? 'Handwerker bearbeiten' : 'Neuer Handwerker'}
                </h3>
                <HandwerkerForm
                  onSubmit={editingHandwerker ? handleEditHandwerker : handleAddHandwerker}
                  onCancel={() => {
                    setShowHandwerkerForm(false);
                    setEditingHandwerker(undefined);
                  }}
                  initialData={editingHandwerker}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {handwerker.map(hw => (
                <div key={hw.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{hw.vorname} {hw.name}</h3>
                      <p className="text-gray-600">{hw.fachgebiet}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      hw.verfuegbar ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {hw.verfuegbar ? 'Verfügbar' : 'Nicht verfügbar'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>📞 {hw.telefon}</p>
                    <p>📧 {hw.email}</p>
                    <p className="font-semibold text-blue-600">💰 {hw.stundensatz}€/Std</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingHandwerker(hw);
                        setShowHandwerkerForm(true);
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 transition-colors"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDeleteHandwerker(hw.id)}
                      className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kunden-Tab */}
        {activeTab === 'kunden' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Kunden</h2>
              <button
                onClick={() => {
                  setEditingKunde(undefined);
                  setShowKundenForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                + Neuer Kunde
              </button>
            </div>

            {showKundenForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingKunde ? 'Kunde bearbeiten' : 'Neuer Kunde'}
                </h3>
                <KundenForm
                  onSubmit={editingKunde ? handleEditKunde : handleAddKunde}
                  onCancel={() => {
                    setShowKundenForm(false);
                    setEditingKunde(undefined);
                  }}
                  initialData={editingKunde}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kunden.map(kunde => (
                <div key={kunde.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold mb-2">{kunde.vorname} {kunde.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>📍 {kunde.adresse}</p>
                    <p className="ml-4">{kunde.plz} {kunde.ort}</p>
                    <p>📞 {kunde.telefon}</p>
                    <p>📧 {kunde.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingKunde(kunde);
                        setShowKundenForm(true);
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 transition-colors"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDeleteKunde(kunde.id)}
                      className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aufträge-Tab */}
        {activeTab === 'auftraege' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Aufträge</h2>
              <button
                onClick={() => {
                  setEditingAuftrag(undefined);
                  setShowAuftragForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                + Neuer Auftrag
              </button>
            </div>

            {showAuftragForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingAuftrag ? 'Auftrag bearbeiten' : 'Neuer Auftrag'}
                </h3>
                <AuftragForm
                  onSubmit={editingAuftrag ? handleEditAuftrag : handleAddAuftrag}
                  onCancel={() => {
                    setShowAuftragForm(false);
                    setEditingAuftrag(undefined);
                  }}
                  initialData={editingAuftrag}
                />
              </div>
            )}

            <div className="space-y-4">
              {auftraege.map(auftrag => (
                <div key={auftrag.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{auftrag.titel}</h3>
                      <p className="text-gray-600 mb-3">{auftrag.beschreibung}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Kunde</p>
                          <p className="font-medium">{getKundeName(auftrag.kundeId)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Handwerker</p>
                          <p className="font-medium">{getHandwerkerName(auftrag.handwerkerId)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Startdatum</p>
                          <p className="font-medium">{new Date(auftrag.startDatum).toLocaleDateString('de-DE')}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Kosten</p>
                          <p className="font-medium text-blue-600">{auftrag.kosten.toLocaleString('de-DE')}€</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <span className={`px-3 py-1 rounded text-xs font-medium ${statusColors[auftrag.status]}`}>
                        {auftrag.status.replace('_', ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded text-xs font-medium ${prioritaetColors[auftrag.prioritaet]}`}>
                        {auftrag.prioritaet}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => {
                        setEditingAuftrag(auftrag);
                        setShowAuftragForm(true);
                      }}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDeleteAuftrag(auftrag.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 Handwerker Management App | Entwickelt mit Next.js & TypeScript</p>
        </div>
      </footer>
    </div>
  );
}
