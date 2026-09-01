import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        lead: {
          select: {
            id: true,
            clientName: true,
            contactNumber: true,
            preferredLocality: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            locality: true,
          },
        },
      },
    });

    const formatted = activities.map((act) => ({
      id: act.id,
      type: act.type,
      title: act.title,
      description: act.description,
      scheduledAt: act.scheduledAt ? act.scheduledAt.toISOString() : undefined,
      isCompleted: act.isCompleted,
      createdAt: act.createdAt.toISOString(),
      leadId: act.leadId,
      clientName: act.lead?.clientName || 'Unknown Lead',
      locality: act.property?.locality || act.lead?.preferredLocality || 'Mumbai',
    }));

    return NextResponse.json({ success: true, activities: formatted });
  } catch (error) {
    console.error('GET /api/activities Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, title, description, scheduledAt, leadId, propertyId } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    const newActivity = await prisma.activity.create({
      data: {
        type: type || 'SITE_VISIT',
        title,
        description: description || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        isCompleted: false,
        leadId: leadId || null,
        propertyId: propertyId || null,
      },
      include: {
        lead: {
          select: {
            clientName: true,
            preferredLocality: true,
          },
        },
      },
    });

    const formatted = {
      id: newActivity.id,
      type: newActivity.type,
      title: newActivity.title,
      description: newActivity.description,
      scheduledAt: newActivity.scheduledAt ? newActivity.scheduledAt.toISOString() : undefined,
      isCompleted: newActivity.isCompleted,
      createdAt: newActivity.createdAt.toISOString(),
      leadId: newActivity.leadId,
      clientName: newActivity.lead?.clientName || 'General Inquiry',
      locality: newActivity.lead?.preferredLocality || 'Mumbai',
    };

    return NextResponse.json({ success: true, activity: formatted }, { status: 201 });
  } catch (error) {
    console.error('POST /api/activities Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, isCompleted, scheduledAt } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Activity ID is required' }, { status: 400 });
    }

    const updated = await prisma.activity.update({
      where: { id },
      data: {
        ...(typeof isCompleted === 'boolean' ? { isCompleted } : {}),
        ...(scheduledAt ? { scheduledAt: new Date(scheduledAt) } : {}),
      },
    });

    return NextResponse.json({ success: true, activity: updated });
  } catch (error) {
    console.error('PATCH /api/activities Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
