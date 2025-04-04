
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-20 pt-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: April 1, 2025</p>
          
          <div className="prose prose-lg max-w-none">
            <p>
              At ResidentPro, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our platform.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, fill out a form, or communicate with us. This may include:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Personal information, such as your name, email address, mailing address, phone number, and payment information</li>
              <li>Account information, such as your username and password</li>
              <li>Community and property information, including property records, resident contact details, and financial data</li>
              <li>Communication records, including emails, chat messages, and support tickets</li>
            </ul>
            
            <p>
              We also automatically collect certain information when you visit, use, or navigate our platform. This information may include:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Device and connection information, such as IP address, browser type, operating system, and device information</li>
              <li>Usage data, including pages visited, features used, and time spent on the platform</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
            <p>
              We may use the information we collect for various purposes, including to:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Provide, maintain, and improve our platform and services</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative information, such as updates, security alerts, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Personalize your experience and deliver content relevant to your interests</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our platform</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Sharing Your Information</h2>
            <p>
              We may share your information in the following situations:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>With service providers who perform services on our behalf</li>
              <li>With your community association or property management company, as necessary to provide our services</li>
              <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition</li>
              <li>When we believe disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request</li>
              <li>With your consent or at your direction</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal information. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Your Privacy Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, such as:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>The right to access and receive a copy of your personal information</li>
              <li>The right to correct inaccurate or incomplete information</li>
              <li>The right to delete your personal information</li>
              <li>The right to restrict or object to processing</li>
              <li>The right to data portability</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided below.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last updated" date. We encourage you to review this Privacy Policy frequently to stay informed about how we are protecting your information.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our practices, please contact us at:
            </p>
            <p className="mt-2">
              ResidentPro, Inc.<br />
              1234 Community Avenue, Suite 500<br />
              Austin, TX 78701<br />
              privacy@residentpro.com<br />
              (800) 555-1234
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Privacy;
