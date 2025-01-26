import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThirdwebProvider } from 'thirdweb/react';
import { Navbar } from './components/Navbar/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Guizia - DefAI NFT Agent',
  description: 'Discover and mint NFTs on Sonic blockchain.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>
          <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
            <Navbar />
            {children}
          </main>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
