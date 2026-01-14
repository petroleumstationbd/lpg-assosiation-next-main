import AlbumDetail from '@/components/PhotoGallery/AlbumDetail';

type PhotoGalleryAlbumPageProps = {
  params: {
    id: string;
  };
};

export default function PhotoGalleryAlbumPage({
  params,
}: PhotoGalleryAlbumPageProps) {
  return <AlbumDetail albumId={params.id} />;
}
