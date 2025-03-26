import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdminAlertsProps {
  error: string | null;
  adminMessage: string | null;
}

const AdminAlerts = ({ error, adminMessage }: AdminAlertsProps) => {
  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {adminMessage && (
        <Alert className="mb-4 border-primary bg-primary/10">
          <AlertDescription className="text-primary">{adminMessage}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AdminAlerts;
