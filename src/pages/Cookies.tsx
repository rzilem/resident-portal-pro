
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Cookies = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-20 pt-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: April 1, 2025</p>
          
          <div className="prose prose-lg max-w-none">
            <p>
              This Cookie Policy explains how ResidentPro ("we", "us", or "our") uses cookies and similar technologies on our website and platform. By using our website or platform, you consent to the use of cookies as described in this policy.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device when you go offline, while session cookies are deleted as soon as you close your web browser.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Types of Cookies We Use</h2>
            <p>
              We use the following types of cookies:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>
                <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access. You may disable these by changing your browser settings, but this may affect how the website functions.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site.
              </li>
              <li>
                <strong>Functionality Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
              </li>
              <li>
                <strong>Advertising Cookies:</strong> These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.
              </li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Third-Party Cookies</h2>
            <p>
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics, deliver advertisements, and so on. These cookies may include:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Google Analytics cookies to analyze how users use our website</li>
              <li>Social media cookies to enable you to share content on platforms like Facebook, Twitter, and LinkedIn</li>
              <li>Payment processor cookies to enable secure transactions</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Delete all cookies from your browser</li>
              <li>Block all cookies by activating the setting on your browser that allows you to refuse all cookies</li>
              <li>Block third-party cookies by activating the setting on your browser that allows you to refuse third-party cookies</li>
              <li>Allow only first-party cookies by activating the setting on your browser that allows you to refuse all third-party cookies</li>
            </ul>
            <p>
              Please note that if you choose to block or delete cookies, you may not be able to access certain areas or features of our website, and some services may not function properly.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Changes to Our Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. The updated version will be indicated by an updated "Last updated" date. We encourage you to review this Cookie Policy frequently to stay informed about how we are using cookies.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <p>
              If you have questions or concerns about this Cookie Policy or our use of cookies, please contact us at:
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

export default Cookies;
