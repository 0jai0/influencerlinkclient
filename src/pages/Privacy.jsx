import React from 'react';
import { Helmet } from 'react-helmet';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy container mx-auto px-4 py-8">
      <Helmet>
        <title>Privacy Policy - PromoterLink</title>
        <meta name="description" content="Read our Privacy Policy to understand how PromoterLink collects, uses, and protects your data." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6">Privacy Policy for PromoterLink.com</h1>
      <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p className="mb-4">
          Welcome to PromoterLink ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website promoterlink.com and our link promotion services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
        <p className="mb-4">We may collect the following types of information:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2"><strong>Personal Information:</strong> Name, email address, contact details when you register.</li>
          <li className="mb-2"><strong>Payment Information:</strong> Processed securely through our payment providers (we don't store full card details).</li>
          <li className="mb-2"><strong>Link Data:</strong> URLs you submit for promotion and related analytics.</li>
          <li className="mb-2"><strong>Usage Data:</strong> IP address, browser type, pages visited, referring URLs.</li>
          <li className="mb-2"><strong>Cookies:</strong> We use cookies to improve your experience (manage in browser settings).</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
        <p className="mb-4">We use the information we collect to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Provide and maintain our services</li>
          <li className="mb-2">Process transactions and send receipts</li>
          <li className="mb-2">Improve our website and services</li>
          <li className="mb-2">Communicate with you about updates</li>
          <li className="mb-2">Monitor and analyze usage patterns</li>
          <li className="mb-2">Prevent fraud and enhance security</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
        <p className="mb-4">We do not sell your personal information. We may share data with:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Service providers (payment processors, hosting)</li>
          <li className="mb-2">When required by law or legal process</li>
          <li className="mb-2">To protect our rights or prevent harm</li>
          <li className="mb-2">With your consent</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
        <p className="mb-4">
          We implement security measures including encryption, access controls, and regular security assessments. However, no method of transmission over the Internet is 100% secure.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
        <p className="mb-4">Depending on your location, you may have rights to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Access, correct, or delete your data</li>
          <li className="mb-2">Opt-out of marketing communications</li>
          <li className="mb-2">Request data portability</li>
          <li className="mb-2">Withdraw consent</li>
        </ul>
        <p>Contact us at support@promoterlink.com to exercise these rights.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Third-Party Links</h2>
        <p className="mb-4">
          Our service involves promoting third-party links. We are not responsible for the privacy practices of these external sites.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
        <p className="mb-4">
          Our services are not directed to children under 13. We do not knowingly collect data from children.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this policy. We'll notify you of significant changes via email or website notice.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
        <p className="mb-4">
          For privacy-related questions, contact us at:<br />
          <strong>Email:</strong> support@promoterlink.com<br />
          
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;