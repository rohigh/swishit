'use server';

import { createClient } from '@/lib/supabase/server';

export async function submitContactForm(formData) {
  try {
    const supabase = await createClient();

    const { name, email, subject, message } = formData;

    if (!name || !email || !message) {
      return { success: false, error: 'Name, email, and message are required.' };
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          subject,
          message,
        },
      ]);

    if (error) {
      console.error('Supabase error inserting contact message:', error);
      return { success: false, error: 'Failed to send message. Please try again later.' };
    }

    // Send email notification to admin via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'Swishit Contact <onboarding@resend.dev>',
          to: ['hello.swishit@gmail.com'],
          subject: `New Contact Form Message: ${subject}`,
          html: `<h2>New Contact Message Received</h2>
                 <p><strong>Name:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Subject:</strong> ${subject}</p>
                 <p><strong>Message:</strong></p>
                 <p style="white-space: pre-wrap; background: #f4f4f5; padding: 15px; border-radius: 8px;">${message}</p>`
        })
      }).catch(e => console.error('Failed to send contact email:', e));
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error in submitContactForm:', err);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
