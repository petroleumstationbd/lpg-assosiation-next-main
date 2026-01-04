import AlbumImagesSection from '@/features/dashboard/multimedia/photo-gallery/AlbumImagesSection';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <AlbumImagesSection albumId={id} />;
}
