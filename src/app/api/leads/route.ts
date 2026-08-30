import { NextResponse } from 'next/server';
import { fetchLeadsFromSheet, appendLeadToSheet, updateLeadStageInSheet } from '@/lib/google-sheets';
import { Lead } from '@/lib/mock-data';

export async function GET() {
  try {
    const leads = await fetchLeadsFromSheet();
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: Lead = await req.json();
    if (!body.id) {
      body.id = `lead-${Date.now()}`;
    }
    await appendLeadToSheet(body);
    return NextResponse.json({ success: true, lead: body });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create lead' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { leadId, stage } = await req.json();
    if (!leadId || !stage) {
      return NextResponse.json({ success: false, error: 'Missing leadId or stage' }, { status: 400 });
    }
    await updateLeadStageInSheet(leadId, stage);
    return NextResponse.json({ success: true, leadId, stage });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update lead' }, { status: 500 });
  }
}
