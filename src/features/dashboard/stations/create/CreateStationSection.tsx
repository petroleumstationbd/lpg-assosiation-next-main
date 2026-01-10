'use client';

import type {StationFormDefaults} from '../StationForm';
import StationUpsertSection from '../upsert/StationUpsertSection';

type Props = {
   initialValues?: StationFormDefaults;
   returnTo?: string;
};

export default function CreateStationSection({
   initialValues,
   returnTo,
}: Props) {
   return (
      <StationUpsertSection
         mode='create'
         title='Create Station'
         initialValues={initialValues}
         returnTo={returnTo}
      />
   );
}
