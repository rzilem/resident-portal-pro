
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-20 pt-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: April 1, 2025</p>
          
          <div className="prose prose-lg max-w-none">
            <p>
              These Terms of Service ("Terms") govern your access to and use of the ResidentPro platform and services. Please read these Terms carefully before using our services.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using our platform, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use our services.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Description of Services</h2>
            <p>
              ResidentPro provides a platform for community management, including financial management, resident tracking, document storage, communication tools, maintenance tracking, and online payments. Our services are designed for use by homeowners associations, condominium associations, and property management companies.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Account Registration and Security</h2>
            <p>
              To use certain features of our platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <p>
              You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Subscription and Payments</h2>
            <p>
              Our services are offered on a subscription basis. You agree to pay all fees associated with your chosen subscription plan. All fees are exclusive of taxes, which you are responsible for paying.
            </p>
            <p>
              Subscription fees are billed in advance and are non-refundable. You may cancel your subscription at any time, but no refunds will be provided for the current billing period.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">5. User Content</h2>
            <p>
              Our platform allows you to store, share, and publish content. You retain ownership of any intellectual property rights in the content you submit, but you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content.
            </p>
            <p>
              You are solely responsible for all content that you upload, post, email, transmit, or otherwise make available through our platform. You agree not to post content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Intellectual Property</h2>
            <p>
              The ResidentPro platform and its contents, features, and functionality are owned by ResidentPro and its licensors and are protected by copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p>
              You are granted a limited, non-exclusive, non-transferable, revocable license to access and use our platform for its intended purposes.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Privacy</h2>
            <p>
              Our Privacy Policy governs the collection, use, and disclosure of personal information you provide to us. By using our platform, you consent to the collection, use, and disclosure of your information as described in our Privacy Policy.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, ResidentPro shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the platform.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">9. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless ResidentPro and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including without limitation reasonable attorney fees and costs, arising out of or in any way connected with your access to or use of the platform or your violation of these Terms.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">10. Termination</h2>
            <p>
              We may terminate or suspend your account and access to our platform at any time, without prior notice or liability, for any reason, including without limitation if you breach these Terms.
            </p>
            <p>
              Upon termination, your right to use the platform will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive termination.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. The updated version will be indicated by an updated "Last updated" date. Your continued use of the platform after any changes indicates your acceptance of the modified Terms.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">12. Governing Law</h2>
            <p>
              These Terms shall be governed by the laws of the State of Texas, without regard to its conflict of law provisions. Any legal action or proceeding relating to your access to or use of the platform shall be instituted in the courts of Travis County, Texas.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">13. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              ResidentPro, Inc.<br />
              1234 Community Avenue, Suite 500<br />
              Austin, TX 78701<br />
              legal@residentpro.com<br />
              (800) 555-1234
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Terms;
