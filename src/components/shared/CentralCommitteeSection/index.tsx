'use client';

import {useEffect, useMemo, useState} from 'react';
import {type StaticImageData} from 'next/image';
import SectionHeading from '@components/ui/SectionHeading';
import CommitteeMemberCard from './CommitteeMemberCard';

import leaderImg1 from '@assets/leader-img/md-serajul-mawla.png';
import leaderImg2 from '@assets/leader-img/hasin-parfez.png';

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

const fallbackCommitteeMembers: CommitteeMember[] = [
   {
      id: 'president-1',
      role: 'PRESIDENT',
      name: 'ENGR. MOHAMMAD SERAJUL MAWLA',
      descriptionLines: [
         'Managing Director, Saad Motors Ltd.',
         'Managing Director, SMT Energy Ltd.',
      ],
      photo: leaderImg1,
      socials: [
         {kind: 'facebook', href: '#'},
         {kind: 'twitter', href: '#'},
         {kind: 'linkedin', href: '#'},
         {kind: 'phone', href: '#'},
      ],
   },
   {
      id: 'vp-1',
      role: 'VICE PRESIDENT',
      name: 'ABDULLAH AL KAFEE',
      descriptionLines: ['Proprietor, Shefaat Fuel Station'],
      photo: leaderImg2,
      socials: [
         {kind: 'facebook', href: '#'},
         {kind: 'twitter', href: '#'},
         {kind: 'linkedin', href: '#'},
         {kind: 'phone', href: '#'},
      ],
   },
   {
      id: 'vp-2',
      role: 'VICE PRESIDENT',
      name: 'KRISHNA KANTA DAS',
      descriptionLines: [
         'Proprietor, K.T. Service Station',
         '& LPG Conversion Center',
      ],
      photo: leaderImg1,
      socials: [
         {kind: 'facebook', href: '#'},
         {kind: 'twitter', href: '#'},
         {kind: 'linkedin', href: '#'},
         {kind: 'phone', href: '#'},
      ],
   },
   {
      id: 'vp-3',
      role: 'VICE PRESIDENT',
      name: 'T MASHFU BOBBY',
      descriptionLines: ['Managing Director, Super Gas Ltd.'],
      photo: leaderImg2,
      socials: [
         {kind: 'facebook', href: '#'},
         {kind: 'twitter', href: '#'},
         {kind: 'linkedin', href: '#'},
         {kind: 'phone', href: '#'},
      ],
   },
   {
      id: 'vp-4',
      role: 'VICE PRESIDENT',
      name: 'MD. ABDUS SABUR REA',
      descriptionLines: ['Proprietor, Sabur Auto Filling Station'],
      photo: leaderImg1,
      socials: [
         {kind: 'facebook', href: '#'},
         {kind: 'twitter', href: '#'},
         {kind: 'linkedin', href: '#'},
         {kind: 'phone', href: '#'},
      ],
   },
   {
      id: 'vp-5',
      role: 'VICE PRESIDENT',
      name: 'MD. EMAMUL HASAN',
      descriptionLines: ['Proprietor, Samiron LPG Filling Station'],
      photo: leaderImg2,
      socials: [
         {kind: 'facebook', href: '#'},
         {kind: 'twitter', href: '#'},
         {kind: 'linkedin', href: '#'},
         {kind: 'phone', href: '#'},
      ],
   },
   {
      id: 'vp-6',
      role: 'VICE PRESIDENT',
      name: 'SAYEDA AKTER',
      descriptionLines: [
         'Proprietor, Green LP Gas Autogas Filling Station & Conversions',
      ],
      photo: leaderImg1,
      socials: [
         {kind: 'facebook', href: '#'},
         {kind: 'twitter', href: '#'},
         {kind: 'linkedin', href: '#'},
         {kind: 'phone', href: '#'},
      ],
   },
   {
      id: 'gs-1',
      role: 'GENERAL SECRETARY',
      name: 'MD. HASIN PARVEZ',
      descriptionLines: ['CEO, Green Fuel Technologies Ltd.'],
      photo: leaderImg2,
      socials: [
         {kind: 'facebook', href: '#'},
         {kind: 'twitter', href: '#'},
         {kind: 'linkedin', href: '#'},
         {kind: 'phone', href: '#'},
      ],
   },
];

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

export default function CentralCommitteeSection() {
   const [members, setMembers] = useState<CommitteeMember[]>(
      fallbackCommitteeMembers
   );

   useEffect(() => {
      let active = true;
      const controller = new AbortController();

      const loadMembers = async () => {
         try {
            const res = await fetch('/api/central-committees', {
               cache: 'no-store',
               signal: controller.signal,
            });
            if (!res.ok) return;
            const raw = await res.json().catch(() => null);
            const list = normalizeList(raw)
               .filter(item => item.is_active)
               .sort(
                  (a, b) => Number(a.position_order) - Number(b.position_order)
               )
               .map(item => {
                  const photoUrl = toAbsoluteUrl(item.profile_image);
                  return {
                     id: String(item.id),
                     role:
                        item.position_name?.toUpperCase() ?? 'COMMITTEE MEMBER',
                     name: item.full_name,
                     descriptionLines: buildDescriptionLines(
                        item.designation,
                        item.company_name
                     ),
                     photo: photoUrl ?? leaderImg1,
                     socials: buildSocials(item),
                  } satisfies CommitteeMember;
               });

            if (active && list.length > 0) {
               setMembers(list);
            }
         } catch (error) {
            if ((error as DOMException).name === 'AbortError') return;
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
         {/* side background glows */}
         <div className='pointer-events-none absolute -left-24 top-[120px] h-[260px] w-[260px] rounded-[40px] bg-[radial-gradient(circle_at_center,_#D5E6FF66,_transparent_70%)]' />
         {/* <div className='pointer-events-none absolute right-[-40px] bottom-[80px] h-[260px] w-[260px] rounded-[40px] bg-[radial-gradient(circle_at_center,_#E1F4E880,_transparent_70%)]' /> */}

         <div className='lpg-container relative'>
            <SectionHeading
               title='CENTRAL COMMITTEE'
               subtitle='The current committee has been formed in a general meeting held on 27 February, 2021. About 200 owners of autogas stations and conversion workshops were present at the meeting chaired by Engr. Mohammad Serajul Mawla. The panel of Engr. Mohammad Serajul Mawla and SMT Energy Ltd. was elected to the present committee. The following panel members are playing important roles in promoting LPG Autogas and LPG Conversion Center across the country as the General Secretary of this association.'
            />

            <div className='mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center'>
               {renderedMembers.map(member => (
                  <CommitteeMemberCard key={member.id} member={member} />
               ))}
            </div>
         </div>
      </section>
   );
}
