import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function AlumniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['alumni']}>
      {children}
    </ProtectedRoute>
  );
}
