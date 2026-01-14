import AlbumDetail from '@/components/PhotoGallery/AlbumDetail';

type PhotoGalleryAlbumPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PhotoGalleryAlbumPage({
  params,
}: PhotoGalleryAlbumPageProps) {
  const { id } = await params;

  // console.log(id); // now string
  return <AlbumDetail albumId={id} />;
}