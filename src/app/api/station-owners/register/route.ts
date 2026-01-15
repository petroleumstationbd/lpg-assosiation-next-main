import {NextResponse} from 'next/server';
import {laravelFetch, LaravelHttpError} from '@/lib/http/laravelFetch';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
   try {
      const contentType = req.headers.get('content-type') ?? '';
      const isMultipart = contentType.includes('multipart/form-data');

      if (isMultipart) {
         const form = await req.formData();
         const fullName = String(
            form.get('full_name') ?? form.get('stationOwnerName') ?? ''
         ).trim();
         const phoneNumber = String(
            form.get('phone_number') ?? form.get('phone') ?? ''
         ).trim();
         const email = String(form.get('email') ?? '').trim();
         const password = String(form.get('password') ?? '');
         const passwordConfirmation = String(
            form.get('password_confirmation') ?? form.get('confirmPassword') ?? ''
         );
         const address = String(
            form.get('address') ?? form.get('residentialAddress') ?? ''
         ).trim();
         const profileImage = form.get('profile_image');

         if (!fullName || !phoneNumber || !email || !password || !address) {
            return NextResponse.json(
               {message: 'Missing required fields'},
               {status: 400}
            );
         }

         const payload = new FormData();
         payload.set('full_name', fullName);
         payload.set('phone_number', phoneNumber);
         payload.set('email', email);
         payload.set('password', password);
         if (passwordConfirmation) {
            payload.set('password_confirmation', passwordConfirmation);
         }
         payload.set('address', address);

         if (profileImage instanceof File) {
            const maxBytes = 10 * 1024 * 1024;
            if (profileImage.size > maxBytes) {
               return NextResponse.json(
                  {message: 'Profile image must be 10MB or less'},
                  {status: 400}
               );
            }
            payload.set('profile_image', profileImage);
         }

         const owner = await laravelFetch<any>('/station-owners', {
            method: 'POST',
            auth: false,
            body: payload,
         });

         const ownerId =
            owner?.id ?? owner?.station_owner?.id ?? owner?.data?.id;

         return NextResponse.json({id: ownerId, owner}, {status: 201});
      }

      const body = (await req.json().catch(() => null)) as {
         stationOwnerName?: string;
         full_name?: string;
         email?: string;
         phone?: string;
         phone_number?: string;
         password?: string;
         password_confirmation?: string;
         confirmPassword?: string;
         address?: string;
         residentialAddress?: string;
      } | null;

      if (!body)
         return NextResponse.json(
            {message: 'Invalid JSON body'},
            {status: 400}
         );

      const payload: {
         full_name: string;
         email: string;
         phone_number: string;
         password: string;
         address: string;
         password_confirmation?: string;
      } = {
         full_name: (body.full_name ?? body.stationOwnerName ?? '').trim(),
         email: (body.email ?? '').trim(),
         phone_number: (body.phone_number ?? body.phone ?? '').trim(),
         password: body.password ?? '',
         address: (body.address ?? body.residentialAddress ?? '').trim(),
      };
      const passwordConfirmation =
         body.password_confirmation ?? body.confirmPassword ?? '';

      if (passwordConfirmation) {
         payload.password_confirmation = passwordConfirmation;
      }

      if (
         !payload.full_name ||
         !payload.email ||
         !payload.phone_number ||
         !payload.password ||
         !payload.address
      ) {
         return NextResponse.json(
            {message: 'Missing required fields'},
            {status: 400}
         );
      }

      const owner = await laravelFetch<any>('/station-owners', {
         method: 'POST',
         auth: false,
         body: JSON.stringify(payload),
      });

      const ownerId = owner?.id ?? owner?.station_owner?.id ?? owner?.data?.id;

      return NextResponse.json({id: ownerId, owner}, {status: 201});
   } catch (e) {
      if (e instanceof LaravelHttpError) {
         return NextResponse.json(
            {message: e.message, errors: e.errors ?? null},
            {status: e.status}
         );
      }
      console.error(e);
      return NextResponse.json(
         {message: 'Internal Server Error'},
         {status: 500}
      );
   }
}
