'use client';

import {useMemo} from 'react';
import {useRouter} from 'next/navigation';
import Loader from '@/components/shared/Loader';
import TablePanel from '@/components/ui/table-panel/TablePanel';
import type {ColumnDef} from '@/components/ui/table-panel/types';
import {useStationDetails} from './queries';

function pick<T>(...v: Array<T | null | undefined>) {
   for (const x of v) if (x != null && x !== ('' as any)) return x;
   return undefined;
}

function str(value: any, fallback = '—') {
   const s = String(value ?? '').trim();
   return s || fallback;
}

function formatDate(value?: string) {
   if (!value) return '—';
   const parsed = new Date(value);
   if (Number.isNaN(parsed.getTime())) return value;
   return parsed.toISOString().slice(0, 10);
}

function InfoRow({label, value}: {label: string; value?: string}) {
   return (
      <div className='flex items-center justify-between gap-4 py-3 text-[13px] text-[#6B7280]'>
         <span className='font-medium text-[#364152]'>{label}</span>
         <span className='text-right text-[#1F2937]'>{value || '—'}</span>
      </div>
   );
}

function mapStationDetails(data: any) {
   const user = data?.station_owner?.user ?? data?.owner?.user ?? data?.user;
   const ownerName = pick(
      user?.full_name,
      user?.name,
      data?.owner_name,
      data?.contact_person_name
   );
   const ownerPhone = pick(
      user?.phone_number,
      data?.owner_phone,
      data?.contact_person_phone
   );
   const ownerEmail = pick(user?.email, data?.owner_email, data?.contact_person_email);

   const stationType = pick(
      data?.station_type?.name,
      data?.station_type,
      data?.station_type_name,
      data?.type
   );
   const fuelType = pick(data?.fuel_type?.name, data?.fuel_type, data?.fuel_type_name);

   const division = pick(data?.division?.name, data?.division_name, data?.divisionName);
   const district = pick(data?.district?.name, data?.district_name, data?.districtName);
   const upazila = pick(data?.upazila?.name, data?.upazila_name, data?.upazilaName);

   return {
      stationName: str(pick(data?.station_name, data?.stationName, data?.name)),
      stationStatus: str(pick(data?.station_status, data?.status, data?.verification_status)),
      stationType: str(stationType),
      fuelType: str(fuelType),
      businessType: str(data?.business_type),
      dealershipAgreement: str(data?.dealership_agreement),
      stationAddress: str(pick(data?.station_address, data?.address)),
      division: str(division),
      district: str(district),
      upazila: str(upazila),
      commencementDate: formatDate(data?.commencement_date),
      verificationStatus: str(pick(data?.verification_status, data?.station_status)),
      verifiedBy: str(data?.verified_by),
      verifiedAt: formatDate(data?.verified_at),
      ownerName: str(ownerName),
      ownerPhone: str(ownerPhone),
      ownerEmail: str(ownerEmail),
      ownerAddress: str(pick(data?.owner_address, data?.contact_person_address)),
   };
}

type PaymentRow = {
   id: string;
   date: string;
   amount: string;
   method: string;
   status: string;
};

type Props = {
   stationId: string;
};

export default function StationProfileSection({stationId}: Props) {
   const router = useRouter();
   const q = useStationDetails(stationId);

   const paymentColumns = useMemo<ColumnDef<PaymentRow>[]>(() => {
      return [
         {
            id: 'date',
            header: 'Date',
            sortable: false,
            csvHeader: 'Date',
            csvValue: row => row.date,
            cell: row => <span className='text-[#133374]'>{row.date}</span>,
         },
         {
            id: 'amount',
            header: 'Amount',
            sortable: false,
            csvHeader: 'Amount',
            csvValue: row => row.amount,
            cell: row => <span className='text-[#133374]'>{row.amount}</span>,
         },
         {
            id: 'method',
            header: 'Method',
            sortable: false,
            csvHeader: 'Method',
            csvValue: row => row.method,
            cell: row => <span className='text-[#133374]'>{row.method}</span>,
         },
         {
            id: 'status',
            header: 'Status',
            sortable: false,
            csvHeader: 'Status',
            csvValue: row => row.status,
            cell: row => <span className='text-[#133374]'>{row.status}</span>,
         },
      ];
   }, []);

   const paymentRows: PaymentRow[] = [];

   if (q.isLoading) return <Loader label='Loading...' />;
   if (q.isError || !q.data) {
      return (
         <div className='rounded-xl bg-white/70 p-6 text-sm text-red-600 shadow'>
            Failed to load station profile.
         </div>
      );
   }

   const station = mapStationDetails(q.data);

   return (
      <div className='space-y-6'>
         <div className='flex items-center justify-between'>
            <h2 className='text-[18px] font-semibold text-[#2B3A4A]'>
               Station Profile
            </h2>
            <button
               type='button'
               onClick={() => router.back()}
               className='rounded-full border border-[#D0D5DD] px-4 py-2 text-[12px] font-semibold text-[#344054] shadow-sm hover:bg-white'>
               Back
            </button>
         </div>

         <div className='grid gap-6 lg:grid-cols-[260px,1fr]'>
            <div className='rounded-[16px] bg-white/80 p-6 text-center shadow-[0_18px_55px_rgba(0,0,0,0.08)]'>
               <div className='mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#EEF2FF] text-[26px] font-semibold text-[#4F62C0]'>
                  {station.stationName.slice(0, 1).toUpperCase() || 'S'}
               </div>
               <p className='mt-4 text-[15px] font-semibold text-[#2B3A4A]'>
                  {station.stationName}
               </p>
               <p className='mt-1 text-[12px] text-[#4F62C0]'>
                  Status: {station.stationStatus}
               </p>
               <p className='mt-1 text-[12px] text-[#6B7280]'>
                  Type: {station.stationType}
               </p>
            </div>

            <div className='rounded-[16px] bg-white/80 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.08)]'>
               <h3 className='text-[14px] font-semibold text-[#2B3A4A]'>
                  Station Information
               </h3>
               <div className='mt-4 divide-y divide-[#E5E7EB]'>
                  <InfoRow label='Station Name' value={station.stationName} />
                  <InfoRow label='Fuel Type' value={station.fuelType} />
                  <InfoRow label='Business Type' value={station.businessType} />
                  <InfoRow label='Dealership Agreement' value={station.dealershipAgreement} />
                  <InfoRow label='Address' value={station.stationAddress} />
                  <InfoRow label='Division' value={station.division} />
                  <InfoRow label='District' value={station.district} />
                  <InfoRow label='Upazila' value={station.upazila} />
                  <InfoRow label='Commencement Date' value={station.commencementDate} />
                  <InfoRow label='Verification Status' value={station.verificationStatus} />
                  <InfoRow label='Verified By' value={station.verifiedBy} />
                  <InfoRow label='Verified At' value={station.verifiedAt} />
               </div>
            </div>
         </div>

         <div className='rounded-[16px] bg-white/80 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.08)]'>
            <h3 className='text-[14px] font-semibold text-[#2B3A4A]'>
               Owner Information
            </h3>
            <div className='mt-4 divide-y divide-[#E5E7EB]'>
               <InfoRow label='Full Name' value={station.ownerName} />
               <InfoRow label='Email' value={station.ownerEmail} />
               <InfoRow label='Phone' value={station.ownerPhone} />
               <InfoRow label='Address' value={station.ownerAddress} />
            </div>
         </div>

         <div className='space-y-4'>
            <div className='flex items-center justify-between'>
               <h3 className='text-[14px] font-semibold text-[#2B3A4A]'>
                  Payment History
               </h3>
               <span className='text-[12px] text-[#6B7280]'>
                  Payment history will be available soon.
               </span>
            </div>

            <TablePanel<PaymentRow>
               rows={paymentRows}
               columns={paymentColumns}
               getRowKey={row => row.id}
               searchText={() => ''}
               exportFileName=''
               showTopBar={false}
               showControlsRow={false}
               showFooter={false}
               showExport={false}
               className='shadow-[0_18px_55px_rgba(0,0,0,0.10)]'
            />
            {paymentRows.length === 0 ? (
               <div className='rounded-[12px] bg-white/80 py-6 text-center text-sm text-[#6B7280] shadow-[0_18px_55px_rgba(0,0,0,0.05)]'>
                  No payment history available yet.
               </div>
            ) : null}
         </div>
      </div>
   );
}
