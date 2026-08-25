/**
 * Indian Rupee & Real Estate Tax Formatting Utilities
 */

/**
 * Formats raw INR numeric value into Indian Lakhs (L) or Crores (Cr)
 */
export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    const crores = amount / 10000000;
    return `₹${crores % 1 === 0 ? crores : crores.toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs : lakhs.toFixed(2)} Lakhs`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats property price specified in Lakhs float (e.g. 75.5 -> ₹75.5 Lakhs, 350 -> ₹3.5 Cr)
 */
export function formatPriceInLakhs(lakhs: number): string {
  if (lakhs >= 100) {
    const crores = lakhs / 100;
    return `₹${crores % 1 === 0 ? crores.toFixed(1) : crores.toFixed(2)} Cr`;
  }
  return `₹${lakhs % 1 === 0 ? lakhs : lakhs.toFixed(1)} Lakhs`;
}

/**
 * Formats price per square foot (e.g. ₹18,500 / sq.ft)
 */
export function formatPricePerSqFt(priceInRupees: number, carpetAreaSqFt: number): string {
  if (!carpetAreaSqFt || carpetAreaSqFt <= 0) return 'N/A';
  const perSqFt = Math.round(priceInRupees / carpetAreaSqFt);
  return `₹${perSqFt.toLocaleString('en-IN')} / sq.ft`;
}

export interface TaxBreakdown {
  agreementValue: number;
  stampDutyRate: number;
  stampDutyAmount: number;
  registrationFee: number;
  gstRate: number;
  gstAmount: number;
  totalAcquisitionCost: number;
  isAffordable: boolean;
}

/**
 * Calculates Stamp Duty, GST, Registration, and Total Costs based on Indian real estate laws
 * - Stamp Duty: User configurable (5% - 7% default depending on state)
 * - GST: 1% for Affordable Housing (Price <= ₹45L), 5% for Standard Housing
 * - Registration Fee: 1% (capped at ₹30,000 for residential in major metro states)
 */
export function calculateIndianTax(
  priceInLakhs: number,
  stampDutyPercent: number = 5
): TaxBreakdown {
  const agreementValue = priceInLakhs * 100000;
  const isAffordable = priceInLakhs <= 45;

  const stampDutyAmount = (agreementValue * stampDutyPercent) / 100;
  
  // Registration fee standard cap in states like Maharashtra is ₹30,000 for residential, or 1%
  const registrationFee = Math.min((agreementValue * 0.01), 30000);

  // GST 1% for affordable, 5% for standard housing
  const gstRate = isAffordable ? 1 : 5;
  const gstAmount = (agreementValue * gstRate) / 100;

  const totalAcquisitionCost = agreementValue + stampDutyAmount + registrationFee + gstAmount;

  return {
    agreementValue,
    stampDutyRate: stampDutyPercent,
    stampDutyAmount,
    registrationFee,
    gstRate,
    gstAmount,
    totalAcquisitionCost,
    isAffordable,
  };
}

/**
 * Builds direct WhatsApp chat link for Indian mobile numbers (+91)
 */
export function generateWhatsAppLink(phone: string, clientName?: string, propertyTitle?: string): string {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  // Default to Indian prefix 91 if not present
  const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  
  let msg = `Hello ${clientName || 'Valued Client'}, inquiring from A1 Real Estate CRM regarding `;
  if (propertyTitle) {
    msg += `your interest in "${propertyTitle}". How can I assist you today?`;
  } else {
    msg += `your property inquiry. When would be a good time for a site visit call?`;
  }

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
}
