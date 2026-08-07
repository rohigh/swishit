import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing payment verification fields' },
        { status: 400 }
      );
    }

    // Create HMAC-SHA256 signature using order_id + | + payment_id
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Payment signature mismatch. Possible tamper attempt.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, paymentId: razorpay_payment_id });
  } catch (error) {
    console.error('Razorpay verify-payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed. Please contact support.' },
      { status: 500 }
    );
  }
}
