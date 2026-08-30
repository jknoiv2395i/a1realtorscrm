import { google } from 'googleapis';
import { getGoogleAuth } from './google-auth';

interface DocumentReplacement {
  [key: string]: string;
}

export async function generateDocumentFromTemplate(
  templateDocId: string,
  title: string,
  replacements: DocumentReplacement
): Promise<{ docId: string; url: string } | null> {
  const auth = getGoogleAuth();
  if (!auth) {
    return null;
  }

  try {
    const drive = google.drive({ version: 'v3', auth });
    const docs = google.docs({ version: 'v1', auth });

    // 1. Duplicate the template Google Doc
    const copyResponse = await drive.files.copy({
      fileId: templateDocId,
      requestBody: {
        name: title,
      },
    });

    const newDocId = copyResponse.data.id;
    if (!newDocId) {
      throw new Error('Failed to create copy of template document');
    }

    // 2. Build batch update requests for text replacement (e.g. {{Client_Name}} -> "Rajesh Sharma")
    const requests = Object.entries(replacements).map(([key, value]) => ({
      replaceAllText: {
        containsText: {
          text: `{{${key}}}`,
          matchCase: true,
        },
        replaceText: value,
      },
    }));

    if (requests.length > 0) {
      await docs.documents.batchUpdate({
        documentId: newDocId,
        requestBody: {
          requests,
        },
      });
    }

    // 3. Make the created Doc readable via link
    await drive.permissions.create({
      fileId: newDocId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return {
      docId: newDocId,
      url: `https://docs.google.com/document/d/${newDocId}/edit`,
    };
  } catch (error) {
    console.error('Error generating Google Doc from template:', error);
    return null;
  }
}
