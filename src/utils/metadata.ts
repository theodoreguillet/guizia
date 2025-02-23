'use server';

const IMAGE_GENERATOR_API_URL = process.env
  .NEXT_IMAGE_GENERATOR_API_URL as string;

const IMAGE_GENERATOR_API_KEY = process.env
  .NEXT_IMAGE_GENERATOR_API_KEY as string;

export async function generateMetadata(twitter: string) {
  if (!IMAGE_GENERATOR_API_URL || !IMAGE_GENERATOR_API_KEY) {
    throw new Error('Missing image generator infos in environment variables.');
  }

  try {
    const twitterParam = twitter ? `?twitter_username=${twitter}` : '';
    const response = await fetch(
      `${IMAGE_GENERATOR_API_URL}/gen-image-personality${twitterParam}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': `${IMAGE_GENERATOR_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
}
