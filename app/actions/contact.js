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

    return { success: true };
  } catch (err) {
    console.error('Unexpected error in submitContactForm:', err);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
