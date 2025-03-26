import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
