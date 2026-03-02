export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSessionFromRequest } from '@/lib/session'
import crypto from 'crypto'

// You must define these in your .env file
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // e.g. https://pub-xxxxxxxx.r2.dev

export async function POST(request: Request) {
    try {
        const session = await getSessionFromRequest(request)
        if (!session || session.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Validate R2 Credentials exist
        if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
            // Se as chaves do R2 não estiverem configuradas, falha elegantemente (poderia ter um fallback local)
            return NextResponse.json({
                error: 'R2 Configuration is missing in environment variables. Please configure R2_ACCOUNT_ID, etc.'
            }, { status: 500 })
        }

        const s3Client = new S3Client({
            region: "auto",
            endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: R2_ACCESS_KEY_ID,
                secretAccessKey: R2_SECRET_ACCESS_KEY,
            },
        });

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer())
        const fileExtension = file.name.split('.').pop() || 'jpg'
        const randomString = crypto.randomBytes(8).toString('hex')

        // Include tenant slug or ID in path for organization
        const key = `tenants/${session.tenantId}/uploads/${Date.now()}-${randomString}.${fileExtension}`

        await s3Client.send(new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type || 'image/jpeg',
            // ACL: 'public-read' // Cloudflare R2 manages public access via bucket settings/custom domains
        }));

        // Construct the public URL
        const publicUrl = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;

        return NextResponse.json({ url: publicUrl })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
