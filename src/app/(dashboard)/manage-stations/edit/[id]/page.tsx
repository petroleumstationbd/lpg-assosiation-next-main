import StationUpsertSection from '@/features/dashboard/stations/upsert/StationUpsertSection';

type PageProps = {
   params: Promise<{id: string}>;
   searchParams?: {
      returnTo?: string;
   };
};

export default async function EditStationPage({
   params,
   searchParams,
}: PageProps) {
   const {id} = await params;
   const returnTo = searchParams?.returnTo
      ? decodeURIComponent(searchParams.returnTo)
      : undefined;

   return (
      <StationUpsertSection
         mode='edit'
         stationId={id}
         title='Update Station'
         returnTo={returnTo}
      />
   );
}
