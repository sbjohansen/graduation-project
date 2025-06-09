import { PageTitle } from '@/components/PageTitle';

const TermsOfService = () => {
  return (
    <div className="min-h-screen py-16">
      <PageTitle title="Terms of Service" />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground mb-6">
                <strong>Last updated:</strong> June 9, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="mb-4">
                  By accessing and using SecureShield Solutions' cybersecurity training platform, 
                  you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                <p className="mb-4">
                  SecureShield Solutions provides an AI-powered cybersecurity incident response 
                  training platform that offers immersive roleplay simulations and educational content.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                <p className="mb-4">
                  To access certain features of our service, you must create an account. You are 
                  responsible for:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Providing accurate and complete information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
                <p className="mb-4">You agree not to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Use the service for any unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the service</li>
                  <li>Share your account credentials with others</li>
                  <li>Upload malicious content or code</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
                <p className="mb-4">
                  The service and its original content, features, and functionality are owned by 
                  SecureShield Solutions and are protected by international copyright, trademark, 
                  patent, trade secret, and other intellectual property laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
                <p className="mb-4">
                  Paid services are billed in advance on a monthly or annual basis. All fees are 
                  non-refundable except as required by law. We reserve the right to change our 
                  pricing with 30 days' notice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
                <p className="mb-4">
                  In no event shall SecureShield Solutions be liable for any indirect, incidental, 
                  special, consequential, or punitive damages, including loss of profits, data, or 
                  other intangible losses.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
                <p className="mb-4">
                  We may terminate or suspend your account immediately if you breach these Terms. 
                  You may terminate your account at any time by contacting us.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
                <p className="mb-4">
                  We reserve the right to modify these terms at any time. We will notify users of 
                  any material changes via email or through our platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
                <p className="mb-4">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p>SecureShield Solutions</p>
                  <p>Email: legal@secureshield.com</p>
                  <p>Phone: +1 (555) 123-4567</p>
                  <p>Address: 123 Security Boulevard, San Francisco, CA 94102</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
