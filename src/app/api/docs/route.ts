import { NextResponse } from 'next/server';
import { generateDocumentFromTemplate } from '@/lib/google-docs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { templateId, title, replacements } = body;

    const template = templateId || process.env.GOOGLE_DOC_COST_SHEET_TEMPLATE_ID;

    if (!template) {
      return NextResponse.json(
        {
          success: false,
          error: 'No template ID provided or configured in GOOGLE_DOC_COST_SHEET_TEMPLATE_ID environment variable.',
        },
        { status: 400 }
      );
    }

    const result = await generateDocumentFromTemplate(
      template,
      title || `Cost Sheet - ${new Date().toLocaleDateString()}`,
      replacements || {}
    );

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: 'Could not generate document. Please check your Google Service Account credentials.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error while generating document' },
      { status: 500 }
    );
  }
}
