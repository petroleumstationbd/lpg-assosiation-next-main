
import AccentCard from '@/components/ui/AccentCard';

const activities: string[] = [
  'To bring all Autogas station and conversion workshop owners under one unique platform. We are working to get an order from the Ministry of Commerce to make our membership compulsory so that we can build a strong relationship with each and every owner like a family.',
  'To develop a strong communication and understanding between Autogas station owner and LPG operators.',
  'To ensure that Autogas stations are getting LPG as per BERC rate from the LPG operators and owner is not violating any terms and conditions with his LPG operator.',
  'To ensure that all Autogas stations are following the BERC retail price. We have 11 zonal committee in order to implement the BERC retail price all over the country.',
  'It is very important to increase the conversion of vehicles to LPG. We are working with the concerned government authorities for a duty-free facility in importing conversion kits.',
  'VAT exemption will help the sector flourish in the line with the government’s priority to promote this alternative fuel. We have already demanded the VAT exemption from the retail price and requested for government subsidies in this Autogas sector in order to establish an acceptable and sustainable retail price.',
  'To ensure measurement accuracy of the technical issues. For example, the supply of Autogas from road tanker to LPG tank at Autogas station, from LPG dispenser to vehicles, the tank level etc. We demand to engage government authority to make sure of the quantity and quality of this fuel.',
  'To liaise with the concerned government authorities to make it convenient for the entrepreneurs to set up an Autogas station and conversion workshop.',
  'To make sure that each Autogas station has an emergency safety plan for prevention of natural disaster or any kind of accident.',
];

const MissionVisionActivitiesSection = () => {
  return (
    <section className="relative  py-10 md:py-16">
      <div className="lpg-container space-y-6 md:space-y-8">
        {/* top two cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* OUR MISSION */}
          <AccentCard>
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5FBF5] text-xl text-[#6CC12A]">
                ✓
              </div>
              <h3 className="text-lg font-semibold text-[#003B4A] md:text-xl">
                OUR MISSION
              </h3>
            </div>
            <p className="text-[13px] leading-relaxed text-[#23425A] md:text-[14px]">
              Our mission is to bring all the Autogas station owners under one unique platform
              and build strong relationship with each other. The primary goal of the Association
              is to secure the 80B+ crores investment in this sector by promoting LPG Autogas as
              an alternative, efficient and environment-friendly fuel.
            </p>
          </AccentCard>

          {/* OUR VISION */}
          <AccentCard>
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5FBF5] text-xl text-[#6CC12A]">
                👁
              </div>
              <h3 className="text-lg font-semibold text-[#003B4A] md:text-xl">
                OUR VISION
              </h3>
            </div>
            <p className="text-[13px] leading-relaxed text-[#23425A] md:text-[14px]">
              Our vision is to bring all the Autogas station owners under one unique platform and
              build strong relationship with each other. The primary goal of the Association is
              to secure the 80B+ crores investment in this sector by promoting LPG Autogas as an
              alternative, efficient and environment-friendly fuel.
            </p>
          </AccentCard>
        </div>

        {/* large activities card */}
        <AccentCard fullcard={true} className="mt-2">
          <div className="mb-4 flex items-center gap-3 md:mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5FBF5] text-xl text-[#6CC12A]">
              ✓
            </div>
            <h3 className="text-lg font-semibold text-[#003B4A] md:text-xl">
              OUR ACTIVITIES
            </h3>
          </div>

          <ul className="space-y-3 text-[13px] leading-relaxed text-[#23425A] md:text-[14px]">
            {activities.map((item, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="mt-[2px] inline-flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full border border-[#6CC12A] text-[11px] text-[#6CC12A]">
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
