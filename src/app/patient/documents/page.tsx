'use client';

import { DocumentsManager } from '@/components/documents/DocumentsManager';
import { PageHeader } from '@/components/ui/PageHeader';

export default function PatientDocumentsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="My records"
        title="Reports & files"
        description="Upload and download your medical reports, labs, and prescriptions."
      />
      <DocumentsManager />
    </div>
  );
}
