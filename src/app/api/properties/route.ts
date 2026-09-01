import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, properties });
  } catch (error) {
    console.error('GET /api/properties Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      locality,
      city,
      state,
      type,
      reraNumber,
      carpetAreaSqFt,
      priceInLakhs,
      possessionStatus,
      imageUrl,
      bedrooms,
      bathrooms,
      description,
      amenities,
      isFeatured,
    } = body;

    if (!title || !locality || !priceInLakhs || !reraNumber) {
      return NextResponse.json(
        { success: false, error: 'Title, Locality, Price, and RERA Number are required' },
        { status: 400 }
      );
    }

    const priceLakhsNum = Number(priceInLakhs);
    const priceRupeesNum = priceLakhsNum * 100000;

    const property = await prisma.property.create({
      data: {
        title,
        locality,
        city: city || 'Mumbai',
        state: state || 'Maharashtra',
        type: type || 'BHK_2',
        reraNumber,
        carpetAreaSqFt: Number(carpetAreaSqFt) || 850,
        priceInLakhs: priceLakhsNum,
        priceInRupees: priceRupeesNum,
        possessionStatus: possessionStatus || 'READY_TO_MOVE',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        bedrooms: Number(bedrooms) || 2,
        bathrooms: Number(bathrooms) || 2,
        description: description || null,
        amenities: Array.isArray(amenities) ? amenities.join(', ') : (amenities || 'Clubhouse, Security, Gym'),
        isFeatured: Boolean(isFeatured),
      },
    });

    return NextResponse.json({ success: true, property }, { status: 201 });
  } catch (error) {
    console.error('POST /api/properties Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
