import StationProfileSection from '@/features/dashboard/stations/profile/StationProfileSection';

type PageProps = {
   params: Promise<{id: string}>;
};

export default async function StationProfilePage({params}: PageProps) {
   const {id} = await params;
   return <StationProfileSection stationId={id} />;
}
