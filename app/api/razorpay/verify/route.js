import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      return NextResponse.json({ error: 'Razorpay secret is not configured' }, { status: 500 });
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      return NextResponse.json({ message: 'Payment verified successfully', isOk: true }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid signature', isOk: false }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying Razorpay signature:', error);
    return NextResponse.json({ error: 'Failed to verify signature', isOk: false }, { status: 500 });
  }
}
