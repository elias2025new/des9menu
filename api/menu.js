// api/menu.js  — Vercel Serverless Function
// GET /api/menu  →  returns current menu JSON from Neon

import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    // CORS headers so the React app can call this from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const sql = neon(process.env.DATABASE_URL);

        const rows = await sql`
            SELECT data FROM menu_config ORDER BY id DESC LIMIT 1
        `;

        if (!rows.length || !rows[0].data || Object.keys(rows[0].data).length === 0) {
            // DB is empty — tell the client to seed it
            return res.status(200).json({ empty: true, data: null });
        }

        return res.status(200).json({ empty: false, data: rows[0].data });
    } catch (err) {
        console.error('GET /api/menu error:', err);
        return res.status(500).json({ error: 'Database error', detail: err.message });
    }
}
