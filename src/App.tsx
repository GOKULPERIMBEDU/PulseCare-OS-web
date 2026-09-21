import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { RoleLayout } from '@/components/layout/RoleLayout';
import LandingPage from '@/app/page';
import LoginPage from '@/app/login/page';
import RegisterPage from '@/app/register/page';
import RegisterHospitalPage from '@/app/register-hospital/page';
import SuperAdminPage from '@/app/super-admin/page';
import SuperAdminHospitalsPage from '@/app/super-admin/hospitals/page';
import SuperAdminBillingPage from '@/app/super-admin/billing/page';
import HospitalAdminPage from '@/app/hospital-admin/page';
import HospitalAdminPatientsPage from '@/app/hospital-admin/patients/page';
import HospitalAdminDoctorsPage from '@/app/hospital-admin/doctors/page';
import HospitalAdminAppointmentsPage from '@/app/hospital-admin/appointments/page';
import HospitalAdminBillingPage from '@/app/hospital-admin/billing/page';
import HospitalAdminDocumentsPage from '@/app/hospital-admin/documents/page';
import HospitalAdminAuditPage from '@/app/hospital-admin/audit/page';
import DoctorHomePage from '@/app/doctor/page';
import DoctorQueuePage from '@/app/doctor/queue/page';
import DoctorPatientsPage from '@/app/doctor/patients/page';
import DoctorEmrPage from '@/app/doctor/patients/detail/page';
import DoctorPrescriptionsPage from '@/app/doctor/prescriptions/page';
import PrescribePage from '@/app/doctor/prescribe/detail/page';
import DoctorDocumentsPage from '@/app/doctor/documents/page';
import PatientHomePage from '@/app/patient/page';
import PatientBookPage from '@/app/patient/book/page';
import PatientRecordsPage from '@/app/patient/records/page';
import PatientBillingPage from '@/app/patient/billing/page';
import InvoicePage from '@/app/patient/billing/detail/page';
import PatientDocumentsPage from '@/app/patient/documents/page';
import QueuePage from '@/app/queue/page';

function AdminRedirect() {
  const { pathname } = useLocation();
  const next = pathname.replace(/^\/admin/, '/hospital-admin') || '/hospital-admin';
  return <Navigate to={next} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register-hospital" element={<RegisterHospitalPage />} />

      <Route element={<RoleLayout roles={['SUPER_ADMIN']} />}>
        <Route path="/super-admin" element={<SuperAdminPage />} />
        <Route path="/super-admin/hospitals" element={<SuperAdminHospitalsPage />} />
        <Route path="/super-admin/billing" element={<SuperAdminBillingPage />} />
      </Route>

      <Route element={<RoleLayout roles={['HOSPITAL_ADMIN']} />}>
        <Route path="/hospital-admin" element={<HospitalAdminPage />} />
        <Route path="/hospital-admin/patients" element={<HospitalAdminPatientsPage />} />
        <Route path="/hospital-admin/doctors" element={<HospitalAdminDoctorsPage />} />
        <Route path="/hospital-admin/appointments" element={<HospitalAdminAppointmentsPage />} />
        <Route path="/hospital-admin/billing" element={<HospitalAdminBillingPage />} />
        <Route path="/hospital-admin/documents" element={<HospitalAdminDocumentsPage />} />
        <Route path="/hospital-admin/audit" element={<HospitalAdminAuditPage />} />
      </Route>

      <Route path="/admin/*" element={<AdminRedirect />} />

      <Route element={<RoleLayout roles={['DOCTOR']} />}>
        <Route path="/doctor" element={<DoctorHomePage />} />
        <Route path="/doctor/queue" element={<DoctorQueuePage />} />
        <Route path="/doctor/patients" element={<DoctorPatientsPage />} />
        <Route path="/doctor/patients/:id" element={<DoctorEmrPage />} />
        <Route path="/doctor/prescriptions" element={<DoctorPrescriptionsPage />} />
        <Route path="/doctor/prescribe/:appointmentId" element={<PrescribePage />} />
        <Route path="/doctor/documents" element={<DoctorDocumentsPage />} />
      </Route>

      <Route element={<RoleLayout roles={['PATIENT']} />}>
        <Route path="/patient" element={<PatientHomePage />} />
        <Route path="/patient/book" element={<PatientBookPage />} />
        <Route path="/patient/records" element={<PatientRecordsPage />} />
        <Route path="/patient/billing" element={<PatientBillingPage />} />
        <Route path="/patient/billing/:id" element={<InvoicePage />} />
        <Route path="/patient/documents" element={<PatientDocumentsPage />} />
      </Route>

      <Route element={<RoleLayout roles={['HOSPITAL_ADMIN', 'DOCTOR']} />}>
        <Route path="/queue" element={<QueuePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
