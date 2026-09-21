import { FormEvent, useEffect, useState } from 'react';
import { api, downloadFile } from '@/lib/api';
import { MedicalDocument, Patient } from '@/types';
import { entityName, formatDate } from '@/lib/format';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Field';

export function DocumentsManager({ lockPatientId }: { lockPatientId?: string }) {
  const [docs, setDocs] = useState<MedicalDocument[] | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await api<MedicalDocument[]>(
        lockPatientId ? `/documents?patientId=${lockPatientId}` : '/documents',
      );
      setDocs(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load documents');
      setDocs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    if (!lockPatientId) {
      void api<Patient[]>('/patients')
        .then(setPatients)
        .catch(() => setPatients([]));
    }
  }, [lockPatientId]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (lockPatientId) data.set('patientId', lockPatientId);
    setError('');
    try {
      await api('/documents', { method: 'POST', body: data });
      form.reset();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  }

  const items = docs ?? [];

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="pc-card grid gap-3 p-5 sm:grid-cols-4">
        {!lockPatientId ? (
          <Field label="Patient">
            <Select name="patientId" required>
              <option value="">Select</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {entityName(patient)}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}
        <Field label="Category">
          <Select name="category" defaultValue="report">
            <option value="report">Medical report</option>
            <option value="lab">Lab result</option>
            <option value="prescription">Digital prescription</option>
            <option value="other">Other</option>
          </Select>
        </Field>
        <Field label="File">
          <Input name="file" type="file" required />
        </Field>
        <div className="flex items-end">
          <Button type="submit">Upload</Button>
        </div>
        {error ? <p className="sm:col-span-4 text-sm text-danger">{error}</p> : null}
      </form>
      <Table columns={['File', 'Category', 'Uploaded', '']} loading={loading} empty={!loading && items.length === 0}>
        {items.map((doc) => (
          <tr key={doc._id}>
            <td className="px-4 py-3">{doc.originalName}</td>
            <td className="px-4 py-3 capitalize">{doc.category}</td>
            <td className="px-4 py-3 text-muted">{formatDate(doc.createdAt)}</td>
            <td className="px-4 py-3">
              <Button
                variant="secondary"
                onClick={() => void downloadFile(`/documents/${doc._id}/download`, doc.originalName)}
              >
                Download
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
