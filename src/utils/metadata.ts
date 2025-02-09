'use server';

const N8N_API_URL =
  'https://guillettheodore.app.n8n.cloud/webhook/00fc3ac3-28a6-485b-8d43-7a54a97c47aa?personality=Sh*tposter';
const N8N_API_TOKEN = process.env.NEXT_N8N_API_TOKEN;

export async function generateMetadata() {
  if (!N8N_API_TOKEN) {
    throw new Error('Missing API token in environment variables.');
  }

  try {
    // const response = await fetch(N8N_API_URL, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${N8N_API_TOKEN}`,
    //     'Content-Type': 'application/json',
    //   },
    // });

    // if (!response.ok) {
    //   throw new Error(`API request failed with status ${response.status}`);
    // }

    // const data = await response.json();
    // return data;
    const mockData = {
      output:
        'https://replicate.delivery/xezq/rskpCneg8ITXfk9SedF4KEgzrjXvWq3NHOBwbKXkHDFanqaoA/out-0.webp',
      image_prompt:
        'A cute anthropomorphic raccoon standing confidently, facing to the right, in a clean and modern cartoon style with bold outlines. The character has a simple background with a chaotic swirl of neon colors. Its skin is a glitchy digital pattern, giving it a unique and distinct appearance. On its head, it features a jester hat with clashing colors, adding personality to the design. The facial expression is a mischievous grin, reflecting its mood and attitude. Additionally, the raccoon may have an optional accessory: sunglasses with pixelated lenses. The overall aesthetic is minimalistic yet stylish, making it ideal for an NFT collection.',
      features: {
        background: 'a chaotic swirl of neon colors',
        skin: 'a glitchy digital pattern',
        head: 'a jester hat with clashing colors',
        face: 'a mischievous grin',
        accessory: 'sunglasses with pixelated lenses',
      },
      personality: 'Sh*tposter',
    };

    return mockData;
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
}
