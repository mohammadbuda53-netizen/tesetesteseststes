import { NextResponse } from 'next/server';
import { getHandwerker, createHandwerker, updateHandwerker, deleteHandwerker } from '@/lib/db';

export async function GET() {
  try {
    const handwerker = getHandwerker();
    return NextResponse.json({ success: true, data: handwerker });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Fehler beim Laden der Handwerker' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newHandwerker = createHandwerker(data);
    return NextResponse.json({ success: true, data: newHandwerker }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Fehler beim Erstellen des Handwerkers' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    const updated = updateHandwerker(id, data);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Handwerker nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Fehler beim Aktualisieren des Handwerkers' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID erforderlich' }, { status: 400 });
    }
    const deleted = deleteHandwerker(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Handwerker nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Fehler beim Löschen des Handwerkers' }, { status: 500 });
  }
}
