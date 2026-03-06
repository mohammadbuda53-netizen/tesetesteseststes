import { statusLabels } from "@/data/mock";

const statusColors: Record<string, string> = {
  // Handwerker Status
  verfuegbar: "bg-green-100 text-green-800",
  im_einsatz: "bg-blue-100 text-blue-800",
  urlaub: "bg-yellow-100 text-yellow-800",
  krank: "bg-red-100 text-red-800",
  // Projekt Status
  geplant: "bg-slate-100 text-slate-800",
  in_arbeit: "bg-blue-100 text-blue-800",
  pausiert: "bg-yellow-100 text-yellow-800",
  abgeschlossen: "bg-green-100 text-green-800",
  storniert: "bg-red-100 text-red-800",
  // Rechnung Status
  entwurf: "bg-slate-100 text-slate-800",
  gesendet: "bg-blue-100 text-blue-800",
  bezahlt: "bg-green-100 text-green-800",
  ueberfaellig: "bg-red-100 text-red-800",
  // Termin Typ
  besichtigung: "bg-purple-100 text-purple-800",
  arbeit: "bg-blue-100 text-blue-800",
  abnahme: "bg-green-100 text-green-800",
  beratung: "bg-orange-100 text-orange-800",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusColors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
}
