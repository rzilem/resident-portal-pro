import { lazy } from 'react';

// Layouts
import AuthLayout from '@/layouts/AuthLayout';
import AppLayout from '@/layouts/AppLayout';

// Authentication Pages
const SignIn = lazy(() => import('@/pages/auth/SignIn'));
const SignUp = lazy(() => import('@/pages/auth/SignUp'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('@/pages/auth/VerifyEmail'));

// App Pages
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Properties = lazy(() => import('@/pages/Properties'));
const AssociationProfile = lazy(() => import('@/pages/AssociationProfile'));
const Calendar = lazy(() => import('@/pages/Calendar'));
const Documents = lazy(() => import('@/pages/Documents'));
const Residents = lazy(() => import('@/pages/Residents'));
const ResidentProfile = lazy(() => import('@/pages/ResidentProfile'));
const Accounting = lazy(() => import('@/pages/Accounting'));
const Settings = lazy(() => import('@/pages/Settings'));
const AssociationSettings = lazy(() => import('@/pages/AssociationSettings'));
const Integrations = lazy(() => import('@/pages/Integrations'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const ResaleCertificates = lazy(() => import('@/pages/ResaleCertificates'));
const Maintenance = lazy(() => import('@/pages/Maintenance'));
const Violations = lazy(() => import('@/pages/Violations'));
const Voting = lazy(() => import('@/pages/Voting'));
const Directory = lazy(() => import('@/pages/Directory'));
const Communication = lazy(() => import('@/pages/Communication'));
const CommunicationTemplate = lazy(() => import('@/pages/CommunicationTemplate'));
const CommunicationBlast = lazy(() => import('@/pages/CommunicationBlast'));
const PropertyProfile = lazy(() => import('@/pages/PropertyProfile'));
const PropertyEditor = lazy(() => import('@/pages/PropertyEditor'));
const ResidentEditor = lazy(() => import('@/pages/ResidentEditor'));
const AssociationEditor = lazy(() => import('@/pages/AssociationEditor'));
const DocumentEditor = lazy(() => import('@/pages/DocumentEditor'));
const DocumentCategoryEditor = lazy(() => import('@/pages/DocumentCategoryEditor'));
const TaskEditor = lazy(() => import('@/pages/TaskEditor'));
const TaskProfile = lazy(() => import('@/pages/TaskProfile'));
const WorkflowEditor = lazy(() => import('@/pages/WorkflowEditor'));
const WorkflowProfile = lazy(() => import('@/pages/WorkflowProfile'));
const ResaleCertificateEditor = lazy(() => import('@/pages/ResaleCertificateEditor'));
const ViolationEditor = lazy(() => import('@/pages/ViolationEditor'));
const ViolationProfile = lazy(() => import('@/pages/ViolationProfile'));
const VendorEditor = lazy(() => import('@/pages/VendorEditor'));
const VendorProfile = lazy(() => import('@/pages/VendorProfile'));
const InvoiceEditor = lazy(() => import('@/pages/InvoiceEditor'));
const InvoiceProfile = lazy(() => import('@/pages/InvoiceProfile'));
const PaymentEditor = lazy(() => import('@/pages/PaymentEditor'));
const PaymentProfile = lazy(() => import('@/pages/PaymentProfile'));
const MeetingEditor = lazy(() => import('@/pages/MeetingEditor'));
const MeetingProfile = lazy(() => import('@/pages/MeetingProfile'));
const BallotEditor = lazy(() => import('@/pages/BallotEditor'));
const BallotProfile = lazy(() => import('@/pages/BallotProfile'));
const TagEditor = lazy(() => import('@/pages/TagEditor'));
const TagProfile = lazy(() => import('@/pages/TagProfile'));
const CustomMergeTagEditor = lazy(() => import('@/pages/CustomMergeTagEditor'));
const CustomMergeTagProfile = lazy(() => import('@/pages/CustomMergeTagProfile'));
const AmenityEditor = lazy(() => import('@/pages/AmenityEditor'));
const AmenityProfile = lazy(() => import('@/pages/AmenityProfile'));
const ServiceEditor = lazy(() => import('@/pages/ServiceEditor'));
const ServiceProfile = lazy(() => import('@/pages/ServiceProfile'));
const ResidentInvitation = lazy(() => import('@/pages/ResidentInvitation'));
const ResidentOnboarding = lazy(() => import('@/pages/ResidentOnboarding'));
const ResidentDirectory = lazy(() => import('@/pages/ResidentDirectory'));
const ResidentCommunication = lazy(() => import('@/pages/ResidentCommunication'));
const ResidentDocuments = lazy(() => import('@/pages/ResidentDocuments'));
const ResidentMaintenance = lazy(() => import('@/pages/ResidentMaintenance'));
const ResidentViolations = lazy(() => import('@/pages/ResidentViolations'));
import CompanySettings from '@/pages/settings/CompanySettings';

const routes = [
  // Auth Routes
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'sign-in', element: <SignIn /> },
      { path: 'sign-up', element: <SignUp /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'verify-email', element: <VerifyEmail /> },
    ],
  },

  // App Routes
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '', element: <Dashboard /> },
      { path: 'properties', element: <Properties /> },
      { path: 'properties/:id', element: <PropertyProfile /> },
      { path: 'properties/:id/edit', element: <PropertyEditor /> },
      { path: 'associations/:id', element: <AssociationProfile /> },
      { path: 'associations/:id/edit', element: <AssociationEditor /> },
      { path: 'calendar', element: <Calendar /> },
      { path: 'documents', element: <Documents /> },
      { path: 'documents/:id/edit', element: <DocumentEditor /> },
      { path: 'document-categories/:id/edit', element: <DocumentCategoryEditor /> },
      { path: 'residents', element: <Residents /> },
      { path: 'residents/invite', element: <ResidentInvitation /> },
      { path: 'residents/onboard/:token', element: <ResidentOnboarding /> },
      { path: 'residents/:id', element: <ResidentProfile /> },
      { path: 'residents/:id/edit', element: <ResidentEditor /> },
      { path: 'accounting', element: <Accounting /> },
      { path: 'settings', element: <Settings /> },
      { path: 'settings/association', element: <AssociationSettings /> },
      { path: 'integrations', element: <Integrations /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'resale-certificates', element: <ResaleCertificates /> },
      { path: 'resale-certificates/:id/edit', element: <ResaleCertificateEditor /> },
      { path: 'maintenance', element: <Maintenance /> },
      { path: 'maintenance/:id/edit', element: <TaskEditor /> },
      { path: 'maintenance/:id', element: <TaskProfile /> },
      { path: 'violations', element: <Violations /> },
      { path: 'violations/:id/edit', element: <ViolationEditor /> },
      { path: 'violations/:id', element: <ViolationProfile /> },
      { path: 'voting', element: <Voting /> },
      { path: 'voting/:id/edit', element: <BallotEditor /> },
      { path: 'voting/:id', element: <BallotProfile /> },
      { path: 'directory', element: <Directory /> },
      { path: 'communication', element: <Communication /> },
      { path: 'communication/templates/:id/edit', element: <CommunicationTemplate /> },
      { path: 'communication/blast', element: <CommunicationBlast /> },
      { path: 'workflows/:id/edit', element: <WorkflowEditor /> },
      { path: 'workflows/:id', element: <WorkflowProfile /> },
      { path: 'vendors/:id/edit', element: <VendorEditor /> },
      { path: 'vendors/:id', element: <VendorProfile /> },
      { path: 'invoices/:id/edit', element: <InvoiceEditor /> },
      { path: 'invoices/:id', element: <InvoiceProfile /> },
      { path: 'payments/:id/edit', element: <PaymentEditor /> },
      { path: 'payments/:id', element: <PaymentProfile /> },
      { path: 'meetings/:id/edit', element: <MeetingEditor /> },
      { path: 'meetings/:id', element: <MeetingProfile /> },
      { path: 'tags/:id/edit', element: <TagEditor /> },
      { path: 'tags/:id', element: <TagProfile /> },
      { path: 'custom-merge-tags/:id/edit', element: <CustomMergeTagEditor /> },
      { path: 'custom-merge-tags/:id', element: <CustomMergeTagProfile /> },
      { path: 'amenities/:id/edit', element: <AmenityEditor /> },
      { path: 'amenities/:id', element: <AmenityProfile /> },
      { path: 'services/:id/edit', element: <ServiceEditor /> },
      { path: 'services/:id', element: <ServiceProfile /> },
      { path: 'resident-directory', element: <ResidentDirectory /> },
      { path: 'resident-communication', element: <ResidentCommunication /> },
      { path: 'resident-documents', element: <ResidentDocuments /> },
      { path: 'resident-maintenance', element: <ResidentMaintenance /> },
      { path: 'resident-violations', element: <ResidentViolations /> },
      {
        path: '/settings/company',
        element: <CompanySettings />
      },
    ],
  },
];

export default routes;
