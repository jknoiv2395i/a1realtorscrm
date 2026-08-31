import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { appendLeadToSheet, updateLeadStageInSheet } from '@/lib/google-sheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const dbLeads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          select: { title: true },
        },
      },
    });

    const formattedLeads = dbLeads.map((lead) => ({
      ...lead,
      createdAt: lead.createdAt.toISOString(),
      propertyTitle: lead.property?.title || undefined,
    }));

    return NextResponse.json({ success: true, leads: formattedLeads });
  } catch (error) {
    console.error('API GET /api/leads Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      clientName,
      contactNumber,
      email,
      budgetMinLakhs,
      budgetMaxLakhs,
      preferredLocality,
      preferredType,
      buyingIntent,
      stage,
      notes,
      source,
    } = body;

    if (!clientName || !contactNumber) {
      return NextResponse.json(
        { success: false, error: 'Client Name and Contact Number are required' },
        { status: 400 }
      );
    }

    const createdLead = await prisma.lead.create({
      data: {
        clientName,
        contactNumber,
        email: email || null,
        budgetMinLakhs: Number(budgetMinLakhs) || 50,
        budgetMaxLakhs: Number(budgetMaxLakhs) || 100,
        preferredLocality: preferredLocality || 'Mumbai',
        preferredType: preferredType || 'BHK_2',
        buyingIntent: buyingIntent || 'SELF_USE',
        stage: stage || 'NEW_INQUIRY',
        notes: notes || null,
        source: source || 'Website Inquiry',
      },
    });

    // Optional background Google Sheets sync if configured
    try {
      await appendLeadToSheet({
        ...createdLead,
        createdAt: createdLead.createdAt.toISOString(),
        buyingIntent: createdLead.buyingIntent as any,
        stage: createdLead.stage as any,
        preferredType: createdLead.preferredType as any,
        email: createdLead.email || undefined,
        notes: createdLead.notes || undefined,
        propertyId: createdLead.propertyId || undefined,
      });
    } catch (sheetErr) {
      console.warn('Google Sheets sync skipped:', sheetErr);
    }

    const formattedLead = {
      ...createdLead,
      createdAt: createdLead.createdAt.toISOString(),
    };

    return NextResponse.json({ success: true, lead: formattedLead }, { status: 201 });
  } catch (error) {
    console.error('Prisma Creation Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { leadId, stage } = await req.json();
    if (!leadId || !stage) {
      return NextResponse.json({ success: false, error: 'Missing leadId or stage' }, { status: 400 });
    }

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: { stage },
    });

    try {
      await updateLeadStageInSheet(leadId, stage);
    } catch (sheetErr) {
      console.warn('Google Sheets stage update skipped:', sheetErr);
    }

    return NextResponse.json({ success: true, leadId, stage, lead: updatedLead });
  } catch (error) {
    console.error('API PATCH /api/leads Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update lead stage' }, { status: 500 });
  }
}
