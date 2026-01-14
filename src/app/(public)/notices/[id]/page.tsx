import NoticeDetailsSection from '@/components/notices/NoticeDetailsSection';

export default function NoticeDetailsPage({
  params,
}: {
  params: {id: string};
}) {
  return <NoticeDetailsSection id={params.id} />;
}
