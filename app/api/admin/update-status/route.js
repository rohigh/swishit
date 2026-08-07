import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, newStatus } = body;

    if (!orderId || !newStatus) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Validate Authentication & Authorization using standard server client
    const supabaseServer = await createClient();
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

    const userEmail = user?.email?.toLowerCase().trim();

    if (authError || !user || userEmail !== 'swishitt@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    // 2. Initialize Service Role Client to bypass RLS
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 3. Perform the secure update
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Order status updated securely' });
  } catch (err) {
    console.error('API Route Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
