'use client';

import { DocumentsManager } from '@/components/documents/DocumentsManager';
import { PageHeader } from '@/components/ui/PageHeader';

export default function DoctorDocumentsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Records"
        title="Clinical documents"
        description="Attach lab results and reports to the patient chart."
      />
      <DocumentsManager />
    </div>
  );
}
