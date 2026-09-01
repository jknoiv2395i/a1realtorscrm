import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        lead: {
          select: {
            id: true,
            clientName: true,
            contactNumber: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    const formattedDeals = deals.map((d) => ({
      id: d.id,
      title: d.title,
      clientName: d.lead?.clientName || 'Client',
      propertyTitle: d.property?.title || 'General Property',
      dealValueINR: d.dealValueINR,
      tokenPaidINR: d.tokenPaidINR,
      stampDutyINR: d.stampDutyINR,
      gstINR: d.gstINR,
      expectedClose: d.expectedClose ? d.expectedClose.toISOString().split('T')[0] : '',
      stage: d.stage,
      createdAt: d.createdAt.toISOString(),
      leadId: d.leadId,
      propertyId: d.propertyId,
    }));

    return NextResponse.json({ success: true, deals: formattedDeals });
  } catch (error) {
    console.error('GET /api/deals Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, dealValueINR, tokenPaidINR, stampDutyINR, gstINR, expectedClose, stage, leadId, propertyId } = body;

    if (!title || !leadId || !dealValueINR) {
      return NextResponse.json(
        { success: false, error: 'Title, Lead, and Deal Value are required' },
        { status: 400 }
      );
    }

    const createdDeal = await prisma.deal.create({
      data: {
        title,
        dealValueINR: Number(dealValueINR),
        tokenPaidINR: Number(tokenPaidINR) || 0,
        stampDutyINR: Number(stampDutyINR) || 0,
        gstINR: Number(gstINR) || 0,
        expectedClose: expectedClose ? new Date(expectedClose) : null,
        stage: stage || 'NEGOTIATION',
        leadId,
        propertyId: propertyId || null,
      },
      include: {
        lead: { select: { clientName: true } },
        property: { select: { title: true } },
      },
    });

    const formatted = {
      id: createdDeal.id,
      title: createdDeal.title,
      clientName: createdDeal.lead?.clientName || 'Client',
      propertyTitle: createdDeal.property?.title || 'General Property',
      dealValueINR: createdDeal.dealValueINR,
      tokenPaidINR: createdDeal.tokenPaidINR,
      stampDutyINR: createdDeal.stampDutyINR,
      gstINR: createdDeal.gstINR,
      expectedClose: createdDeal.expectedClose ? createdDeal.expectedClose.toISOString().split('T')[0] : '',
      stage: createdDeal.stage,
      createdAt: createdDeal.createdAt.toISOString(),
      leadId: createdDeal.leadId,
      propertyId: createdDeal.propertyId,
    };

    return NextResponse.json({ success: true, deal: formatted }, { status: 201 });
  } catch (error) {
    console.error('POST /api/deals Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, stage, tokenPaidINR } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Deal ID is required' }, { status: 400 });
    }

    const updated = await prisma.deal.update({
      where: { id },
      data: {
        ...(stage ? { stage } : {}),
        ...(typeof tokenPaidINR === 'number' ? { tokenPaidINR } : {}),
      },
    });

    return NextResponse.json({ success: true, deal: updated });
  } catch (error) {
    console.error('PATCH /api/deals Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
