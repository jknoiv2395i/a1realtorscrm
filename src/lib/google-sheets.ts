import { google } from 'googleapis';
import { getGoogleAuth } from './google-auth';
import { Lead, Activity, MOCK_LEADS, MOCK_ACTIVITIES } from './mock-data';

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function fetchLeadsFromSheet(): Promise<Lead[]> {
  const auth = getGoogleAuth();
  if (!auth || !SHEET_ID) {
    return MOCK_LEADS;
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Leads!A2:J',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return MOCK_LEADS;
    }

    return rows.map((row, index) => ({
      id: row[0] || `lead-${index + 1}`,
      clientName: row[1] || 'Anonymous',
      contactNumber: row[2] || '+91 9800000000',
      budgetMinLakhs: parseFloat(row[3]) || 50,
      budgetMaxLakhs: parseFloat(row[4]) || 100,
      preferredLocality: row[5] || 'Mumbai',
      preferredType: row[6] || 'BHK_2',
      buyingIntent: (row[10] || 'SELF_USE') as Lead['buyingIntent'],
      stage: (row[7] || 'NEW_INQUIRY') as Lead['stage'],
      notes: row[8] || '',
      source: row[9] || 'Website',
      createdAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching leads from Google Sheet, falling back to mock data:', error);
    return MOCK_LEADS;
  }
}

export async function appendLeadToSheet(lead: Lead): Promise<boolean> {
  const auth = getGoogleAuth();
  if (!auth || !SHEET_ID) {
    return false;
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Leads!A:J',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            lead.id,
            lead.clientName,
            lead.contactNumber,
            lead.budgetMinLakhs,
            lead.budgetMaxLakhs,
            lead.preferredLocality,
            lead.preferredType,
            lead.stage,
            lead.notes || '',
            lead.source || 'Website',
          ],
        ],
      },
    });
    return true;
  } catch (error) {
    console.error('Error appending lead to Google Sheet:', error);
    return false;
  }
}

export async function updateLeadStageInSheet(leadId: string, newStage: string): Promise<boolean> {
  const auth = getGoogleAuth();
  if (!auth || !SHEET_ID) {
    return false;
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Leads!A2:A',
    });

    const rows = response.data.values;
    if (!rows) return false;

    const rowIndex = rows.findIndex((r) => r[0] === leadId);
    if (rowIndex === -1) return false;

    // Column H is the 8th column (stage)
    const actualRowNumber = rowIndex + 2;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `Leads!H${actualRowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[newStage]],
      },
    });
    return true;
  } catch (error) {
    console.error('Error updating lead stage in Google Sheet:', error);
    return false;
  }
}

export async function fetchActivitiesFromSheet(): Promise<Activity[]> {
  const auth = getGoogleAuth();
  if (!auth || !SHEET_ID) {
    return MOCK_ACTIVITIES;
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'SiteVisits!A2:F',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return MOCK_ACTIVITIES;
    }

    return rows.map((row, index) => ({
      id: row[0] || `act-${index + 1}`,
      type: (row[1] || 'SITE_VISIT') as Activity['type'],
      title: row[2] || 'Activity',
      description: row[3] || '',
      scheduledAt: row[4] || new Date().toISOString(),
      isCompleted: row[5] === 'TRUE' || row[5] === 'true',
    }));
  } catch (error) {
    console.error('Error fetching activities from Google Sheet, falling back to mock:', error);
    return MOCK_ACTIVITIES;
  }
}

export async function appendActivityToSheet(activity: Activity): Promise<boolean> {
  const auth = getGoogleAuth();
  if (!auth || !SHEET_ID) {
    return false;
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'SiteVisits!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            activity.id,
            activity.type,
            activity.title,
            activity.description || '',
            activity.scheduledAt || '',
            activity.isCompleted ? 'TRUE' : 'FALSE',
          ],
        ],
      },
    });
    return true;
  } catch (error) {
    console.error('Error appending activity to Google Sheet:', error);
    return false;
  }
}
