'use client';

import React from 'react';
import { BotCatalog } from '@/components/companion/BotCatalog';

export default function CompanionCatalogPage() {
  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <BotCatalog />
    </div>
  );
}
