import { createThirdwebClient } from 'thirdweb';

// Thirdweb client Id
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!clientId) {
  throw new Error('No client ID provided');
}

export const client = createThirdwebClient({
  clientId: clientId,
});
