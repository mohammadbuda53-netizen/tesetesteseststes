import { NextResponse } from 'next/server';
import { getAuftraege, createAuftrag, updateAuftrag, deleteAuftrag } from '@/lib/db';

export async function GET() {
  try {
    const auftraege = getAuftraege();
    return NextResponse.json({ success: true, data: auftraege });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Fehler beim Laden der Aufträge' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newAuftrag = createAuftrag(data);
    return NextResponse.json({ success: true, data: newAuftrag }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Fehler beim Erstellen des Auftrags' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    const updated = updateAuftrag(id, data);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Auftrag nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Fehler beim Aktualisieren des Auftrags' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID erforderlich' }, { status: 400 });
    }
    const deleted = deleteAuftrag(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Auftrag nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Fehler beim Löschen des Auftrags' }, { status: 500 });
  }
}
