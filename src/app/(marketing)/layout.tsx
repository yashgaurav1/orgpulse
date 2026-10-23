import React from 'react';
import { AnnouncementBar } from '@/components/home/AnnouncementBar';
import { LandingNav } from '@/components/home/LandingNav';
import { LandingFooter } from '@/components/home/LandingFooter';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-theme-bg text-theme-primary selection:bg-accent/20">
      <AnnouncementBar />
      <LandingNav />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
