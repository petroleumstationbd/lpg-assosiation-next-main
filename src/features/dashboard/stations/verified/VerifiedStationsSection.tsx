
'use client';

import VerifiedStationsTable from './VerifiedStationsTable';

export default function VerifiedStationsSection() {
  return (
    <section className="space-y-6">
      <h2 className="text-center text-[32px] font-medium text-[#0A2F59]">
        Verified Stations
      </h2>

      <VerifiedStationsTable />
    </section>
  );
}
