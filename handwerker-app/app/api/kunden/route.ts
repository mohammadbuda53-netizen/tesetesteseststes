import { NextResponse } from 'next/server';
import { getKunden, createKunde, updateKunde, deleteKunde } from '@/lib/db';

export async function GET() {
  try {
    const kunden = getKunden();
    return NextResponse.json({ success: true, data: kunden });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Fehler beim Laden der Kunden' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newKunde = createKunde(data);
    return NextResponse.json({ success: true, data: newKunde }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Fehler beim Erstellen des Kunden' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    const updated = updateKunde(id, data);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Kunde nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Fehler beim Aktualisieren des Kunden' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID erforderlich' }, { status: 400 });
    }
    const deleted = deleteKunde(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Kunde nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Fehler beim Löschen des Kunden' }, { status: 500 });
  }
}
