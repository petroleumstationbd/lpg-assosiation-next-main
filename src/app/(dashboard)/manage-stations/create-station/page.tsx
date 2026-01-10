import CreateStationSection from '@/features/dashboard/stations/create/CreateStationSection';
import type {StationFormDefaults} from '@/features/dashboard/stations/StationForm';

type PageProps = {
   searchParams?: {
      returnTo?: string;
      ownerId?: string;
      ownerName?: string;
      ownerPhone?: string;
      ownerAddress?: string;
   };
};

export default function CreateStationPage({searchParams}: PageProps) {
   const defaults: StationFormDefaults = {};

   if (searchParams?.ownerId) defaults.station_owner_id = searchParams.ownerId;
   if (searchParams?.ownerName)
      defaults.contact_person_name = searchParams.ownerName;
   if (searchParams?.ownerPhone)
      defaults.contact_person_phone = searchParams.ownerPhone;
   if (searchParams?.ownerAddress)
      defaults.station_address = searchParams.ownerAddress;

   const returnTo = searchParams?.returnTo
      ? decodeURIComponent(searchParams.returnTo)
      : undefined;

   return <CreateStationSection initialValues={defaults} returnTo={returnTo} />;
}
