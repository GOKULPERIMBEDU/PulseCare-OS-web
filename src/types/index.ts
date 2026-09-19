export type UserRole = 'SUPER_ADMIN' | 'HOSPITAL_ADMIN' | 'DOCTOR' | 'PATIENT';

export type AppointmentStatus =
  | 'Scheduled'
  | 'Waiting'
  | 'In-Consultation'
  | 'Completed'
  | 'Cancelled';

export type PaymentStatus = 'Paid' | 'Pending';
export type DocumentCategory = 'report' | 'lab' | 'prescription' | 'other';

export type BaseCurrency = 'INR' | 'USD';

export type AuthUser = {
  id: string;
  role: UserRole;
  email: string;
  firstName: string;
  lastName: string;
  hospitalId?: string;
  hospitalName?: string;
  baseCurrency: BaseCurrency;
};

export type HospitalDirectoryItem = {
  _id: string;
  name: string;
  slug: string;
  region: string;
  baseCurrency: BaseCurrency;
};

export type DemoAccountKey = 'super' | 'hospital' | 'doctor' | 'patient';

export type DemoAccount = {
  key: DemoAccountKey;
  label: string;
  description: string;
  email: string;
  password: string;
};

export type DemoAccountsPayload = {
  hospital: HospitalDirectoryItem | null;
  accounts: DemoAccount[];
};

export type SessionPayload = {
  token: string;
  user: AuthUser;
  profileId: string | null;
  hospital?: {
    id: string;
    name: string;
    slug: string;
    baseCurrency: BaseCurrency;
    region: string;
  };
};

export type UserRef = {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role?: UserRole;
};

export type Address = {
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type EmergencyContact = {
  name: string;
  relationship: string;
  phone: string;
};

export type MedicalHistoryReference = {
  title: string;
  note?: string;
  recordedAt?: string;
  documentId?: string;
};

export type Patient = {
  _id: string;
  userId: UserRef | string;
  mrn: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  phone: string;
  address: Address;
  emergencyContacts: EmergencyContact[];
  medicalHistory: MedicalHistoryReference[];
  allergies: string[];
  chronicConditions: string[];
};

export type AvailabilityWindow = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotMinutes: number;
};

export type Doctor = {
  _id: string;
  userId: UserRef | string;
  specialization: string;
  department: string;
  consultationFee: number;
  licenseNumber: string;
  bio?: string;
  availability: AvailabilityWindow[];
};

export type Appointment = {
  _id: string;
  patientId: Patient | string;
  doctorId: Doctor | string;
  date: string;
  timeSlot: string;
  endTime: string;
  reason: string;
  notes?: string;
  status: AppointmentStatus;
};

export type MedicationItem = {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
};

export type Prescription = {
  _id: string;
  patientId: Patient | string;
  doctorId: Doctor | string;
  appointmentId: Appointment | string;
  medications: MedicationItem[];
  notes?: string;
  issuedAt: string;
};

export type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

export type Invoice = {
  _id: string;
  invoiceNumber: string;
  patientId: Patient | string;
  doctorId?: Doctor | string;
  appointmentId?: Appointment | string;
  items: InvoiceItem[];
  consultationFee: number;
  treatmentFees: number;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paidAt?: string;
  createdAt: string;
  notes?: string;
};

export type AuditLog = {
  _id: string;
  userId?: UserRef | string;
  role?: UserRole;
  actionType: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
};

export type MedicalDocument = {
  _id: string;
  patientId: string;
  uploadedBy?: UserRef | string;
  category: DocumentCategory;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
};

export type AvailabilityResponse = {
  date: string;
  doctorId: string;
  consultationFee: number;
  slotMinutes: number;
  slots: { time: string; available: boolean }[];
};

export type AnalyticsOverview = {
  patients: number;
  doctors: number;
  todayAppointments: number;
  queue: Record<string, number>;
  revenue: {
    collected: number;
    paidInvoices: number;
    outstanding: number;
    pendingInvoices: number;
  };
  hospital?: {
    id: string;
    name: string;
    baseCurrency: BaseCurrency;
  };
};

export type PlatformHospital = {
  id: string;
  name: string;
  slug: string;
  region: string;
  baseCurrency: BaseCurrency;
  isActive: boolean;
  createdAt: string;
  subscription: {
    id: string;
    invoiceNumber: string;
    plan: string;
    amount: number;
    currency: BaseCurrency;
    status: 'Paid' | 'Pending' | 'Overdue';
    billingPeriod: string;
    periodEnd: string;
  } | null;
};

export type SaaSInvoice = {
  _id: string;
  invoiceNumber: string;
  hospitalId: { _id: string; name: string; slug?: string; region?: string } | string;
  plan: string;
  billingPeriod: string;
  amount: number;
  currency: BaseCurrency;
  status: 'Paid' | 'Pending' | 'Overdue';
  periodStart: string;
  periodEnd: string;
  paidAt?: string;
  createdAt: string;
  notes?: string;
};

export type CurrencyTotal = {
  currency: BaseCurrency;
  total: number;
  count: number;
};

export type PlatformOverview = {
  hospitals: number;
  activeHospitals: number;
  doctors: number;
  patients: number;
  saasRevenue: CurrencyTotal[];
  saasOutstanding: CurrencyTotal[];
  health: HealthStatus;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type HealthStatus = {
  status: 'ok' | 'degraded';
  service: string;
  timestamp: string;
  database: 'connected' | 'disconnected';
};
