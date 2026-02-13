import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `menu-items/${fileName}`;

        console.log(`Uploading file: ${fileName}, size: ${file.size}, type: ${file.type}`);

        // Upload to Supabase using Admin client to bypass RLS
        const { data, error: uploadError } = await supabaseAdmin.storage
            .from('menu-images')
            .upload(filePath, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) {
            console.error('Supabase Storage Error:', uploadError);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        console.log('Upload successful:', data);

        // Get the public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('menu-images')
            .getPublicUrl(filePath);

        return NextResponse.json({ url: publicUrl });
    } catch (error: any) {
        console.error('Server Upload Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
