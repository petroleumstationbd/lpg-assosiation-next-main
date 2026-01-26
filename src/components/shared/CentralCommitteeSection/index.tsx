'use client';

import {useEffect, useMemo, useState} from 'react';
import {type StaticImageData} from 'next/image';
import SectionHeading from '@components/ui/SectionHeading';
import CommitteeMemberCard from './CommitteeMemberCard';

import leaderImg1 from '@assets/leader-img/md-serajul-mawla.png';

type SocialKind = 'facebook' | 'twitter' | 'linkedin' | 'phone';

type CommitteeApiItem = {
   id: number;
   position_name: string;
   position_order: number;
   full_name: string;
   designation: string;
   company_name: string;
   profile_image: string | null;
   facebook_url: string | null;
   linkedin_url: string | null;
   whatsapp_url: string | null;
   is_active: boolean;
};

export type CommitteeMember = {
   id: string;
   role: string;
   name: string;
   descriptionLines: string[];
   photo: StaticImageData | string;
   socials: {kind: SocialKind; href: string}[];
};

const LARAVEL_ORIGIN =
   process.env.NEXT_PUBLIC_LARAVEL_ORIGIN ??
   'https://admin.petroleumstationbd.com';

function toAbsoluteUrl(pathOrUrl: string | null | undefined) {
   if (!pathOrUrl) return null;
   if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
   const p = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
   return `${LARAVEL_ORIGIN}${p}`;
}

function normalizeList(raw: unknown): CommitteeApiItem[] {
   if (Array.isArray(raw)) return raw as CommitteeApiItem[];
   if (Array.isArray((raw as {data?: CommitteeApiItem[]})?.data)) {
      return (raw as {data: CommitteeApiItem[]}).data;
   }
   return [];
}

function buildDescriptionLines(designation?: string, company?: string) {
   return [designation, company].filter(Boolean) as string[];
}

function buildSocials(item: CommitteeApiItem) {
   const socials: {kind: SocialKind; href: string}[] = [];
   if (item.facebook_url)
      socials.push({kind: 'facebook', href: item.facebook_url});
   if (item.linkedin_url)
      socials.push({kind: 'linkedin', href: item.linkedin_url});
   if (item.whatsapp_url)
      socials.push({kind: 'phone', href: item.whatsapp_url});
   return socials;
}

function LoadingBar() {
   return (
      <div className='mt-10 w-full'>
         <div className='h-[10px] w-full overflow-hidden rounded-full bg-black/10'>
            <div className='h-full w-1/3 animate-[committeeBar_1.1s_ease-in-out_infinite] rounded-full bg-[#1FA36B]' />
         </div>

         <style jsx>{`
            @keyframes committeeBar {
               0% {
                  transform: translateX(-120%);
               }
               50% {
                  transform: translateX(80%);
               }
               100% {
                  transform: translateX(220%);
               }
            }
         `}</style>
      </div>
   );
}

export default function CentralCommitteeSection() {
   const [members, setMembers] = useState<CommitteeMember[]>([]);
   const [loading, setLoading] = useState(true);
   const [errorMsg, setErrorMsg] = useState<string | null>(null);

   useEffect(() => {
      let active = true;
      const controller = new AbortController();

      const loadMembers = async () => {
         try {
            setLoading(true);
            setErrorMsg(null);

            const res = await fetch('/api/central-committees', {
               cache: 'no-store',
               signal: controller.signal,
            });

            if (!res.ok) {
               throw new Error(`Request failed (${res.status})`);
            }

            const raw = await res.json();
            const list = normalizeList(raw)
               .filter(item => item.is_active)
               .sort((a, b) => {
                  const orderA = Number.isFinite(Number(a.position_order))
                     ? Number(a.position_order)
                     : Number.POSITIVE_INFINITY;
                  const orderB = Number.isFinite(Number(b.position_order))
                     ? Number(b.position_order)
                     : Number.POSITIVE_INFINITY;
                  if (orderA !== orderB) return orderA - orderB;
                  return Number(b.id) - Number(a.id);
               })
               .map(item => {
                  const photoUrl = toAbsoluteUrl(item.profile_image);
                  return {
                     id: String(item.id),
                     role:
                        item.position_name?.toUpperCase?.() ??
                        'COMMITTEE MEMBER',
                     name: item.full_name,
                     descriptionLines: buildDescriptionLines(
                        item.designation,
                        item.company_name,
                     ),
                     photo: photoUrl ?? leaderImg1, // if API has no image, keep a safe placeholder image (not fallback list)
                     socials: buildSocials(item),
                  } satisfies CommitteeMember;
               });

            if (!active) return;
            setMembers(list);
         } catch (error) {
            if ((error as DOMException).name === 'AbortError') return;
            if (!active) return;
            setErrorMsg(
               (error as Error).message || 'Failed to load committee members',
            );
            setMembers([]);
         } finally {
            if (active) setLoading(false);
         }
      };

      loadMembers();

      return () => {
         active = false;
         controller.abort();
      };
   }, []);

   const renderedMembers = useMemo(() => members, [members]);

   return (
      <section className='relative bg-[#F4F9F4] py-16'>
         <div className='pointer-events-none absolute -left-24 top-[120px] h-[260px] w-[260px] rounded-[40px] bg-[radial-gradient(circle_at_center,_#D5E6FF66,_transparent_70%)]' />

         <div className='lpg-container relative'>
            <SectionHeading
               title='CENTRAL COMMITTEE'
               subtitle='The present committee was formed in a general meeting held on January 1, 2000. The meeting was chaired by Syed Sajjadul Karim Kabul and was attended by about 200 petrol pump station owners and various individuals. Syed Sajjadul Karim Kabul, Mir Ahsan Uddin Parvez and a 41-member panel are running the present committee. The following panel members are playing an important role in promoting the Bangladesh Petroleum Dealers, Distributors, Agents and Petrol Pump Owners Association throughout the country as the general secretaries of this association.

'
            />

            {loading ? (
               <LoadingBar />
            ) : errorMsg ? (
               <div className='mt-10 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700'>
                  {errorMsg}
               </div>
            ) : renderedMembers.length === 0 ? (
               <div className='mt-10 rounded-xl border border-black/10 bg-white/60 px-4 py-6 text-sm text-black/70'>
                  No committee members found.
               </div>
            ) : (
               <div className='mt-10 grid gap-7 justify-center px-4 md:px-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                  {renderedMembers.map(member => (
                     <CommitteeMemberCard key={member.id} member={member} />
                  ))}
               </div>
            )}
         </div>
      </section>
   );
}
