const WHATSAPP_NUMBER = '8801730178288';
const WHATSAPP_MESSAGE = 'Hello! I would like to get in touch.';

const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
   WHATSAPP_MESSAGE
)}`;

export default function WhatsAppStickyButton() {
   return (
      <a
         href={whatsappHref}
         target='_blank'
         rel='noopener noreferrer'
         aria-label='Chat with us on WhatsApp'
         className='fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80'>
         <svg
            aria-hidden='true'
            viewBox='0 0 32 32'
            className='h-6 w-6 fill-current'>
            <path d='M16.003 3.2c-7.064 0-12.8 5.736-12.8 12.8 0 2.254.59 4.455 1.71 6.4L3.2 28.8l6.579-1.684a12.77 12.77 0 0 0 6.224 1.612h.001c7.064 0 12.8-5.736 12.8-12.8 0-7.064-5.736-12.8-12.801-12.8zm0 23.2h-.001a10.6 10.6 0 0 1-5.406-1.48l-.387-.23-3.9.999 1.04-3.796-.252-.399a10.53 10.53 0 0 1-1.63-5.694c0-5.838 4.75-10.6 10.6-10.6 5.848 0 10.6 4.762 10.6 10.6 0 5.838-4.752 10.6-10.6 10.6zm6.16-7.97c-.337-.169-1.994-.984-2.303-1.095-.31-.113-.536-.169-.762.168-.225.337-.874 1.095-1.071 1.32-.197.225-.394.253-.731.085-.337-.169-1.423-.524-2.711-1.67-1.003-.894-1.679-1.999-1.876-2.336-.197-.337-.021-.52.148-.688.152-.152.337-.394.506-.591.169-.197.225-.337.337-.562.112-.225.056-.422-.028-.591-.085-.169-.762-1.835-1.044-2.516-.275-.662-.554-.571-.762-.582l-.649-.013c-.225 0-.591.085-.902.422-.31.337-1.183 1.155-1.183 2.816 0 1.66 1.211 3.263 1.38 3.489.169.225 2.384 3.64 5.777 5.106.807.347 1.437.555 1.927.71.809.257 1.545.221 2.129.134.649-.097 1.994-.815 2.276-1.604.282-.789.282-1.465.197-1.604-.084-.14-.309-.225-.647-.394z' />
         </svg>
         <span className='sr-only'>WhatsApp</span>
      </a>
   );
}
