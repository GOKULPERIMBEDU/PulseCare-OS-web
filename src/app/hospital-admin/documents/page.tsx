import { DocumentsManager } from '@/components/documents/DocumentsManager';
import { PageHeader } from '@/components/ui/PageHeader';

export default function AdminDocumentsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Records"
        title="Clinical documents"
        description="Secure upload and retrieval of reports, labs, and digital prescriptions."
      />
      <DocumentsManager />
    </div>
  );
}
