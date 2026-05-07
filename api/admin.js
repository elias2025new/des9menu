// api/admin.js  — Vercel Serverless Function
// POST /api/admin  →  saves updated menu JSON to Neon (password-protected)

import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Auth check
    const incoming = req.headers['x-admin-password'];
    if (!incoming || incoming !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data } = req.body;
    if (!data || typeof data !== 'object') {
        return res.status(400).json({ error: 'Invalid body — expected { data: {...} }' });
    }

    try {
        const sql = neon(process.env.DATABASE_URL);

        // Check if a row exists
        const existing = await sql`SELECT id FROM menu_config LIMIT 1`;

        if (existing.length > 0) {
            // Update existing row
            await sql`
                UPDATE menu_config
                SET data = ${JSON.stringify(data)}::jsonb, updated_at = NOW()
                WHERE id = ${existing[0].id}
            `;
        } else {
            // Insert first row
            await sql`
                INSERT INTO menu_config (data) VALUES (${JSON.stringify(data)}::jsonb)
            `;
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('POST /api/admin error:', err);
        return res.status(500).json({ error: 'Database error', detail: err.message });
    }
}
