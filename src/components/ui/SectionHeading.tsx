
import type { ReactNode } from 'react';

type SectionHeadingProps = {
  title: string;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

export default function SectionHeading({
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps) {
  const alignment =
    align === 'left' ? 'items-start text-left' : 'items-center text-center';

  return (
    <div className={`flex flex-col ${alignment} ${className ?? ''}`}>
      <h2 className="text-[45px] font-medium tracking-[0.0em]  uppercase">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-[#7B8EA5]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
