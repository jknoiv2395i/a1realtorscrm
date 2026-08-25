import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Indian Real Estate CRM database...');

  // Create Users
  const user1 = await prisma.user.upsert({
    where: { email: 'rajesh.sharma@a1realestate.in' },
    update: {},
    create: {
      name: 'Rajesh Sharma',
      email: 'rajesh.sharma@a1realestate.in',
      phone: '+91 98201 54321',
      role: 'AGENCY_HEAD',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'priya.m@a1realestate.in' },
    update: {},
    create: {
      name: 'Priya Mehta',
      email: 'priya.m@a1realestate.in',
      phone: '+91 98190 12345',
      role: 'SENIOR_BROKER',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  });

  // Create Properties
  const prop1 = await prisma.property.create({
    data: {
      title: 'Rustomjee Crown Luxury Residences',
      locality: 'Prabhadevi / Worli',
      city: 'Mumbai',
      state: 'Maharashtra',
      type: 'BHK_3',
      reraNumber: 'P51900003268',
      carpetAreaSqFt: 1450,
      priceInLakhs: 485,
      priceInRupees: 48500000,
      possessionStatus: 'READY_TO_MOVE',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
      bedrooms: 3,
      bathrooms: 3,
      description: 'Ultra-luxurious sea-view residence with private elevator foyer.',
      amenities: 'Sea View, Infinity Pool, Private Elevator, Clubhouse, Gym, 24x7 Security',
      isFeatured: true,
      agentId: user2.id,
    },
  });

  const prop2 = await prisma.property.create({
    data: {
      title: 'Prestige Lakeside Habitat',
      locality: 'Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      type: 'BHK_2',
      reraNumber: 'PRM/KA/RERA/1251/446/PR/170915/000176',
      carpetAreaSqFt: 980,
      priceInLakhs: 95,
      priceInRupees: 9500000,
      possessionStatus: 'READY_TO_MOVE',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      bedrooms: 2,
      bathrooms: 2,
      description: 'Spacious 2BHK overlooking Varthur Lake, close to ITPL.',
      amenities: 'Lake View, Clubhouse, Tennis Court, Children Play Area, Power Backup',
      isFeatured: true,
      agentId: user1.id,
    },
  });

  // Create Leads
  await prisma.lead.create({
    data: {
      clientName: 'Aarav Singhania',
      contactNumber: '+919820011223',
      email: 'aarav.singhania@techcorp.in',
      budgetMinLakhs: 400,
      budgetMaxLakhs: 550,
      preferredLocality: 'Worli / Prabhadevi',
      preferredType: 'BHK_3',
      buyingIntent: 'SELF_USE',
      stage: 'NEGOTIATION',
      notes: 'Very interested in Rustomjee Crown 3BHK.',
      source: 'MagicBricks VIP Inquiry',
      assignedAgentId: user2.id,
      propertyId: prop1.id,
    },
  });

  await prisma.lead.create({
    data: {
      clientName: 'Ananya Deshmukh',
      contactNumber: '+919769055667',
      email: 'ananya.d@gmail.com',
      budgetMinLakhs: 80,
      budgetMaxLakhs: 100,
      preferredLocality: 'Whitefield',
      preferredType: 'BHK_2',
      buyingIntent: 'SELF_USE',
      stage: 'SITE_VISIT_COMPLETED',
      notes: 'Liked Prestige lake view balcony.',
      source: 'Instagram Ad Campaign',
      assignedAgentId: user1.id,
      propertyId: prop2.id,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
