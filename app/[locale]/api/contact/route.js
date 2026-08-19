import { NextResponse } from 'next/server';
import { validateContact } from '@/lib/validate';
import { checkRateLimit } from '@/lib/rateLimit';

// Attempt to use DB if available, otherwise mock
async function saveToDb(data, ip, userAgent, locale) {
  try {
    const { pool } = await import('@/lib/db');
    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO contact_submissions 
          (name, email, company, service, budget, message, ip_address, user_agent, locale)
         VALUES ($1, $2, $3, $4, $5, $6, $7::inet, $8, $9)`,
        [data.name, data.email, data.company || null, data.service || null,
         data.budget || null, data.message, ip, userAgent, locale]
      );
    } finally {
      client.release();
    }
    return true;
  } catch (err) {
    // DB not available — log and continue
    console.warn('[contact] DB save skipped:', err.message);
    console.log('[contact] Submission:', { ...data, ip, locale });
    return true;
  }
}

export async function POST(request) {
  try {
    // Get IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // Rate limit
    const rl = checkRateLimit(ip);
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many submissions. Please try again in an hour.', retryAfter: rl.retryAfter },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
      );
    }

    const body = await request.json();

    // Honeypot check
    if (body._honeypot && body._honeypot !== '') {
      return NextResponse.json({ success: true, message: 'Message received.' });
    }

    // Validate
    const { valid, errors } = validateContact(body);
    if (!valid) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const userAgent = request.headers.get('user-agent') || '';
    const locale = request.headers.get('accept-language')?.split(',')[0] || 'en';

    await saveToDb(body, ip, userAgent, locale);

    return NextResponse.json({
      success: true,
      message: "Your message has been received. We'll be in touch within 24 hours.",
    });
  } catch (err) {
    console.error('[contact] Error:', err);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
