export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'AGENCY_HEAD' | 'SENIOR_BROKER' | 'FIELD_AGENT';
  avatar: string;
}

export interface Property {
  id: string;
  title: string;
  locality: string;
  city: string;
  state: string;
  type: 'BHK_1' | 'BHK_2' | 'BHK_3' | 'BHK_4' | 'PENTHOUSE' | 'VILLA' | 'COMMERCIAL' | 'PLOT';
  reraNumber: string;
  carpetAreaSqFt: number;
  priceInLakhs: number; // e.g. 75 = 75 Lakhs, 350 = 3.5 Cr
  priceInRupees: number;
  possessionStatus: 'READY_TO_MOVE' | 'UNDER_CONSTRUCTION' | 'NEW_LAUNCH' | 'RESALE';
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  amenities: string[];
  isFeatured: boolean;
  agentName?: string;
}

export interface Lead {
  id: string;
  clientName: string;
  contactNumber: string; // Formatted +91 for WhatsApp
  email?: string;
  budgetMinLakhs: number;
  budgetMaxLakhs: number;
  preferredLocality: string;
  preferredType: 'BHK_1' | 'BHK_2' | 'BHK_3' | 'BHK_4' | 'PENTHOUSE' | 'VILLA' | 'COMMERCIAL';
  buyingIntent: 'SELF_USE' | 'INVESTMENT' | 'END_USER_REPLACEMENT';
  stage: 'NEW_INQUIRY' | 'SITE_VISIT_SCHEDULED' | 'SITE_VISIT_COMPLETED' | 'NEGOTIATION' | 'TOKEN_PAID' | 'CLOSED_WON' | 'CLOSED_LOST';
  notes?: string;
  source: string;
  createdAt: string;
  propertyTitle?: string;
  propertyId?: string;
}

export interface Deal {
  id: string;
  title: string;
  clientName: string;
  propertyTitle: string;
  dealValueINR: number;
  tokenPaidINR: number;
  stampDutyINR: number;
  gstINR: number;
  expectedClose: string;
  stage: 'NEGOTIATION' | 'TOKEN_PAID' | 'CLOSED_WON';
}

export interface Activity {
  id: string;
  type: 'SITE_VISIT' | 'WHATSAPP' | 'CALL' | 'NOTE';
  title: string;
  description: string;
  scheduledAt: string;
  isCompleted: boolean;
  clientName?: string;
  locality?: string;
}

export const MOCK_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@a1real estate.in',
    phone: '+91 98201 54321',
    role: 'AGENCY_HEAD',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-2',
    name: 'Priya Mehta',
    email: 'priya.m@a1realestate.in',
    phone: '+91 98190 12345',
    role: 'SENIOR_BROKER',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-3',
    name: 'Vikram Malhotra',
    email: 'vikram@a1realestate.in',
    phone: '+91 98765 43210',
    role: 'FIELD_AGENT',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Rustomjee Crown Luxury Residences',
    locality: 'Prabhadevi / Worli',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'BHK_3',
    reraNumber: 'P51900003268',
    carpetAreaSqFt: 1450,
    priceInLakhs: 485, // ₹4.85 Cr
    priceInRupees: 48500000,
    possessionStatus: 'READY_TO_MOVE',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    bedrooms: 3,
    bathrooms: 3,
    description: 'Ultra-luxurious sea-view residence with private elevator foyer, Italian marble flooring, and concierge service.',
    amenities: ['Sea View', 'Infinity Pool', 'Private Elevator', 'Clubhouse', 'Gym', '24x7 Security'],
    isFeatured: true,
    agentName: 'Priya Mehta',
  },
  {
    id: 'prop-2',
    title: 'Prestige Lakeside Habitat',
    locality: 'Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'BHK_2',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/170915/000176',
    carpetAreaSqFt: 980,
    priceInLakhs: 95, // ₹95 Lakhs
    priceInRupees: 9500000,
    possessionStatus: 'READY_TO_MOVE',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    bedrooms: 2,
    bathrooms: 2,
    description: 'Spacious 2BHK overlooking Varthur Lake, close to ITPL and top international schools.',
    amenities: ['Lake View', 'Clubhouse', 'Tennis Court', 'Children Play Area', 'Power Backup'],
    isFeatured: true,
    agentName: 'Rajesh Sharma',
  },
  {
    id: 'prop-3',
    title: 'DLF Crest Executive Suite',
    locality: 'DLF Phase 5',
    city: 'Gurugram (Delhi NCR)',
    state: 'Haryana',
    type: 'BHK_4',
    reraNumber: 'HRERA-PKL-GUG-45-2018',
    carpetAreaSqFt: 2800,
    priceInLakhs: 720, // ₹7.2 Cr
    priceInRupees: 72000000,
    possessionStatus: 'UNDER_CONSTRUCTION',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    bedrooms: 4,
    bathrooms: 5,
    description: 'Iconic high-rise luxury apartment with floor-to-ceiling glass walls, smart automation, and Golf Course Road connectivity.',
    amenities: ['Golf Course Facing', 'Smart Home Controls', 'Olympic Pool', 'Private Parking', 'Spa'],
    isFeatured: true,
    agentName: 'Priya Mehta',
  },
  {
    id: 'prop-4',
    title: 'Panchshil Towers Executive Flat',
    locality: 'Kharadi',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'BHK_3',
    reraNumber: 'P52100002564',
    carpetAreaSqFt: 1650,
    priceInLakhs: 185, // ₹1.85 Cr
    priceInRupees: 18500000,
    possessionStatus: 'READY_TO_MOVE',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
    bedrooms: 3,
    bathrooms: 3,
    description: 'Contemporary high-tech tower residence located minutes away from EON IT Park.',
    amenities: ['EV Charging', 'Sky Deck', 'Gym', 'Squash Court', 'Biometric Access'],
    isFeatured: false,
    agentName: 'Vikram Malhotra',
  },
  {
    id: 'prop-5',
    title: 'My Home Bhooja Sky Villa',
    locality: 'HITEC City',
    city: 'Hyderabad',
    state: 'Telangana',
    type: 'PENTHOUSE',
    reraNumber: 'P02400000012',
    carpetAreaSqFt: 4100,
    priceInLakhs: 980, // ₹9.8 Cr
    priceInRupees: 98000000,
    possessionStatus: 'NEW_LAUNCH',
    imageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80',
    bedrooms: 4,
    bathrooms: 5,
    description: 'Palatial Sky Villa with private terrace plunge pool, panoramic views of Bio-Diversity Park and Financial District.',
    amenities: ['Private Pool', 'Terrace Garden', 'Private Lift', 'Concierge', 'Helipad Access'],
    isFeatured: true,
    agentName: 'Rajesh Sharma',
  },
  {
    id: 'prop-6',
    title: 'Godrej Prime Compact Smart Home',
    locality: 'Chembur East',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'BHK_1',
    reraNumber: 'P51800000819',
    carpetAreaSqFt: 460,
    priceInLakhs: 82, // ₹82 Lakhs
    priceInRupees: 8200000,
    possessionStatus: 'READY_TO_MOVE',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    bedrooms: 1,
    bathrooms: 1,
    description: 'Smartly designed affordable luxury 1BHK with seamless connectivity to Eastern Express Highway & BKC.',
    amenities: ['Rooftop Garden', 'Fitness Center', 'Solar Water Heating', 'CCTV'],
    isFeatured: false,
    agentName: 'Vikram Malhotra',
  },
];

export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1',
    clientName: 'Aarav Singhania',
    contactNumber: '+919820011223',
    email: 'aarav.singhania@techcorp.in',
    budgetMinLakhs: 400,
    budgetMaxLakhs: 550,
    preferredLocality: 'Worli / Prabhadevi',
    preferredType: 'BHK_3',
    buyingIntent: 'SELF_USE',
    stage: 'NEGOTIATION',
    notes: 'Very interested in Rustomjee Crown 3BHK. Negotiating final token discount and registration payment timeline.',
    source: 'MagicBricks VIP Inquiry',
    createdAt: '2026-08-15',
    propertyTitle: 'Rustomjee Crown Luxury Residences',
    propertyId: 'prop-1',
  },
  {
    id: 'lead-2',
    clientName: 'Sunita Reddy',
    contactNumber: '+919849033445',
    email: 'sunita.reddy@investments.com',
    budgetMinLakhs: 800,
    budgetMaxLakhs: 1100,
    preferredLocality: 'HITEC City',
    preferredType: 'PENTHOUSE',
    buyingIntent: 'INVESTMENT',
    stage: 'TOKEN_PAID',
    notes: 'Token amount of ₹10 Lakhs paid via RTGS. Drafting agreement for sale and verifying GST/Stamp Duty exemptions.',
    source: 'Direct Referral',
    createdAt: '2026-08-12',
    propertyTitle: 'My Home Bhooja Sky Villa',
    propertyId: 'prop-5',
  },
  {
    id: 'lead-3',
    clientName: 'Karan Kapoor',
    contactNumber: '+919811199887',
    email: 'karan.kapoor@lawfirm.in',
    budgetMinLakhs: 600,
    budgetMaxLakhs: 750,
    preferredLocality: 'DLF Phase 5',
    preferredType: 'BHK_4',
    buyingIntent: 'SELF_USE',
    stage: 'SITE_VISIT_SCHEDULED',
    notes: 'Site visit confirmed for Saturday 4 PM along with family architect.',
    source: '99acres Lead',
    createdAt: '2026-08-18',
    propertyTitle: 'DLF Crest Executive Suite',
    propertyId: 'prop-3',
  },
  {
    id: 'lead-4',
    clientName: 'Ananya & Rohan Deshmukh',
    contactNumber: '+919769055667',
    email: 'rohan.deshmukh@gmail.com',
    budgetMinLakhs: 80,
    budgetMaxLakhs: 100,
    preferredLocality: 'Whitefield',
    preferredType: 'BHK_2',
    buyingIntent: 'SELF_USE',
    stage: 'SITE_VISIT_COMPLETED',
    notes: 'Liked the Prestige lake view balcony. Requested bank loan pre-approval assistance with HDFC/ICICI.',
    source: 'Instagram Ad Campaign',
    createdAt: '2026-08-14',
    propertyTitle: 'Prestige Lakeside Habitat',
    propertyId: 'prop-2',
  },
  {
    id: 'lead-5',
    clientName: 'Dr. Siddharth Joshi',
    contactNumber: '+919822077889',
    email: 'dr.siddharth@apollohealth.org',
    budgetMinLakhs: 160,
    budgetMaxLakhs: 200,
    preferredLocality: 'Kharadi',
    preferredType: 'BHK_3',
    buyingIntent: 'END_USER_REPLACEMENT',
    stage: 'NEW_INQUIRY',
    notes: 'Looking to upgrade from existing 2BHK in Viman Nagar to 3BHK in Kharadi near IT corridor.',
    source: 'Walk-in Booth',
    createdAt: '2026-08-20',
    propertyTitle: 'Panchshil Towers Executive Flat',
    propertyId: 'prop-4',
  },
  {
    id: 'lead-6',
    clientName: 'Vikramaditya Rao',
    contactNumber: '+919888822334',
    email: 'vrao@ventures.in',
    budgetMinLakhs: 400,
    budgetMaxLakhs: 500,
    preferredLocality: 'Bandra West',
    preferredType: 'BHK_3',
    buyingIntent: 'INVESTMENT',
    stage: 'CLOSED_WON',
    notes: 'Closed ₹4.85 Cr deal. Stamp duty registered with Sub-Registrar Office Bandra.',
    source: 'HNI Client Network',
    createdAt: '2026-08-01',
    propertyTitle: 'Rustomjee Crown Luxury Residences',
    propertyId: 'prop-1',
  },
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    type: 'SITE_VISIT',
    title: 'Site Visit: DLF Crest Executive Suite',
    description: 'Accompanying Karan Kapoor & family with architect.',
    scheduledAt: '2026-08-23T16:00:00',
    isCompleted: false,
    clientName: 'Karan Kapoor',
    locality: 'DLF Phase 5, Gurugram',
  },
  {
    id: 'act-2',
    type: 'WHATSAPP',
    title: 'Send Cost Sheet & Tax Breakdown',
    description: 'Share Stamp Duty (5%) & GST (5%) estimate breakdown for Whitefield project with Rohan Deshmukh.',
    scheduledAt: '2026-08-22T11:00:00',
    isCompleted: false,
    clientName: 'Rohan Deshmukh',
    locality: 'Whitefield, Bengaluru',
  },
  {
    id: 'act-3',
    type: 'CALL',
    title: 'Token Discount Negotiation Call',
    description: 'Discuss 2% NRI developer discount option for Aarav Singhania with sales director.',
    scheduledAt: '2026-08-22T14:30:00',
    isCompleted: false,
    clientName: 'Aarav Singhania',
    locality: 'Prabhadevi, Mumbai',
  },
  {
    id: 'act-4',
    type: 'NOTE',
    title: 'Bank Home Loan Approved',
    description: 'HDFC approved ₹3.5 Cr home loan sanction letter for Sunita Reddy.',
    scheduledAt: '2026-08-20T18:00:00',
    isCompleted: true,
    clientName: 'Sunita Reddy',
    locality: 'HITEC City, Hyderabad',
  },
];

export const PIPELINE_STAGES = [
  { id: 'NEW_INQUIRY', label: 'New Inquiry', badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: '📩' },
  { id: 'SITE_VISIT_SCHEDULED', label: 'Site Visit Scheduled', badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: '🗓️' },
  { id: 'SITE_VISIT_COMPLETED', label: 'Site Visit Completed', badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: '🚗' },
  { id: 'NEGOTIATION', label: 'Negotiation', badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', icon: '💬' },
  { id: 'TOKEN_PAID', label: 'Token Paid', badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: '💰' },
  { id: 'CLOSED_WON', label: 'Closed / Won', badgeBg: 'bg-gold-500/10 text-gold-400 border-gold-500/30', icon: '🎉' },
];
