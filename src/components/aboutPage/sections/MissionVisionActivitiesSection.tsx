import AccentCard from '@/components/ui/AccentCard';

const activities: string[] = [
   "To increase coordination and cooperation between petrol pump owners, dealers, distributors and agents to ensure the country's energy security.",
   'To protect the interests of members and to provide regular communication and advice to the government and regulatory agencies in formulating and amending policies, laws and regulations related to the energy sector.',
   'To conduct awareness activities to maintain transparency, discipline and standards in the petroleum product supply system.',
   'To monitor and increase awareness on issues related to price, size and quality to ensure consumer-friendly services.',
   'To implement safety provisions in petrol pumps and fuel distribution systems and provide training and guidance to prevent fires and accidents.',
   "To encourage the use of environmentally friendly and alternative fuels and play a supportive role in implementing the government's energy policy.",
   'To organize training, workshops and seminars to improve the skills of members.',
   'To take coordinated initiatives with the relevant authorities to maintain normal fuel supply in emergency situations.',
   'To present reasonable proposals with policymakers for creating an investment-friendly environment in the energy sector and sustainable development.',
   'To encourage members to ensure responsible and ethical business practices in the national interest.',
];

const MissionVisionActivitiesSection = () => {
   return (
      <section className='relative  py-10 md:py-16'>
         <div className='lpg-container space-y-6 md:space-y-8'>
            {/* top two cards */}
            <div className='grid gap-6 md:grid-cols-2'>
               {/* OUR MISSION */}
               <AccentCard>
                  <div className='mb-3 flex items-center gap-3 md:mb-4'>
                     <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#F5FBF5] text-xl text-[#6CC12A]'>
                        ✓
                     </div>
                     <h3 className='text-lg font-semibold text-[#003B4A] md:text-xl'>
                        OUR MISSION
                     </h3>
                  </div>
                  <p className='text-[13px] leading-relaxed text-[#23425A] md:text-[14px]'>
                     Our mission is to play an effective role in the country's
                     energy security and economic development, protect the
                     interests of petrol pump owners, dealers, distributors and
                     agents and ensure consumer-friendly, safe and
                     environmentally friendly fuel supply. We are committed to
                     building a modern, sustainable and transparent fuel
                     distribution system through coordination with the
                     government and all relevant stakeholders.
                  </p>
               </AccentCard>

               {/* OUR VISION */}
               <AccentCard>
                  <div className='mb-3 flex items-center gap-3 md:mb-4'>
                     <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#F5FBF5] text-xl text-[#6CC12A]'>
                        👁
                     </div>
                     <h3 className='text-lg font-semibold text-[#003B4A] md:text-xl'>
                        OUR VISION
                     </h3>
                  </div>
                  <p className='text-[13px] leading-relaxed text-[#23425A] md:text-[14px]'>
                     To develop a safe, sustainable and modern fuel supply
                     system in Bangladesh—where the collective participation of
                     petrol pump owners, dealers, distributors and agents
                     ensures a balanced combination of consumer-friendly
                     services, energy security and environmental protection.
                  </p>
               </AccentCard>
            </div>

            {/* large activities card */}
            <AccentCard fullcard={true} className='mt-2'>
               <div className='mb-4 flex items-center gap-3 md:mb-5'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#F5FBF5] text-xl text-[#6CC12A]'>
                     ✓
                  </div>
                  <h3 className='text-lg font-semibold text-[#003B4A] md:text-xl'>
                     OUR ACTIVITIES
                  </h3>
               </div>

               <ul className='space-y-3 text-[13px] leading-relaxed text-[#23425A] md:text-[14px]'>
                  {activities.map((item, idx) => (
                     <li key={idx} className='flex gap-3'>
                        <span className='mt-[2px] inline-flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full border border-[#6CC12A] text-[11px] text-[#6CC12A]'>
                           ✓
                        </span>
                        <span>{item}</span>
                     </li>
                  ))}
               </ul>
            </AccentCard>
         </div>
      </section>
   );
};

export default MissionVisionActivitiesSection;
