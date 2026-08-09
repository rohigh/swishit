import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { orderDetails, email, name } = await request.json();

    if (!orderDetails || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('Missing RESEND_API_KEY in environment variables');
      return NextResponse.json({ error: 'Email service configuration missing' }, { status: 500 });
    }

    // Format items into HTML table rows
    const itemsHtml = orderDetails.items.map(item => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <strong style="color: #1A1A1A;">${item.name}</strong><br/>
          <span style="color: #6B7280; font-size: 14px;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; text-align: right; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A;">
          ₹${(item.price * item.quantity).toLocaleString('en-IN')}
        </td>
      </tr>
    `).join('');

    // HTML Email Template
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <div style="max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background-color: #1A1A1A; padding: 40px 30px; text-align: center;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">Swish It</h1>
          <p style="color: #A1A1AA; margin: 10px 0 0 0; font-size: 16px;">The standard for effortless clean.</p>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #1A1A1A; margin: 0 0 20px 0; font-size: 22px;">Thank you for your order, ${name}!</h2>
          <p style="color: #4B5563; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
            We're getting your order ready to be shipped. We will notify you when it has been sent.
          </p>

          <div style="background-color: #F9FAFB; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <p style="margin: 0 0 5px 0; color: #6B7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Order Number</p>
            <p style="margin: 0; color: #1A1A1A; font-size: 18px; font-weight: 600; font-family: monospace;">${orderDetails.orderId}</p>
          </div>

          <!-- Order Summary -->
          <h3 style="color: #1A1A1A; font-size: 18px; margin: 0 0 15px 0; border-bottom: 2px solid #F3F4F6; padding-bottom: 10px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            ${itemsHtml}
          </table>

          <!-- Totals -->
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #4B5563; font-size: 15px;">Subtotal</td>
              <td style="padding: 8px 0; text-align: right; color: #1A1A1A; font-size: 15px;">₹${orderDetails.subtotal.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #4B5563; font-size: 15px;">Shipping</td>
              <td style="padding: 8px 0; text-align: right; color: #1A1A1A; font-size: 15px;">${orderDetails.shippingFee === 0 ? 'Free' : `₹${orderDetails.shippingFee}`}</td>
            </tr>
            <tr>
              <td style="padding: 16px 0 0 0; color: #1A1A1A; font-size: 18px; font-weight: bold; border-top: 2px solid #F3F4F6;">Total</td>
              <td style="padding: 16px 0 0 0; text-align: right; color: #1A1A1A; font-size: 18px; font-weight: bold; border-top: 2px solid #F3F4F6;">₹${orderDetails.total.toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>

        <!-- Footer -->
        <div style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 14px; margin: 0;">
            If you have any questions, reply to this email or contact us at <a href="mailto:support@swishit.in" style="color: #1A1A1A; text-decoration: underline;">support@swishit.in</a>
          </p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Make native fetch call to Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'Swishit <support@swishit.in>',
        to: [email],
        bcc: ['hello.swishit@gmail.com'],
        subject: `Your Swishit Order Confirmation (#${orderDetails.orderId})`,
        html: htmlTemplate
      })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend API Error:', data);
      throw new Error(data.message || 'Failed to send email');
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
