import { PageTitle } from '@/components/PageTitle';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-16">
      <PageTitle title="Privacy Policy" />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground mb-6">
                <strong>Last updated:</strong> June 9, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                <p className="mb-4">
                  We collect information you provide directly to us, such as when you create an account, 
                  use our training platform, or contact us for support.
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Personal information (name, email address, phone number)</li>
                  <li>Account credentials and profile information</li>
                  <li>Training progress and performance data</li>
                  <li>Communication preferences</li>
                  <li>Payment and billing information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide, maintain, and improve our training platform</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, and administrative messages</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Develop new features and services</li>
                  <li>Personalize your training experience</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
                <p className="mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  except as described in this policy:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>With your consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                  <li>With service providers who assist our operations</li>
                  <li>In connection with a business transfer</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                <p className="mb-4">
                  We implement appropriate technical and organizational measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
                <p className="mb-4">
                  We retain your personal information for as long as necessary to provide our services 
                  and fulfill the purposes outlined in this policy, unless a longer retention period 
                  is required by law.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your personal information</li>
                  <li>Object to processing of your information</li>
                  <li>Data portability</li>
                  <li>Withdraw consent</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking</h2>
                <p className="mb-4">
                  We use cookies and similar tracking technologies to collect information about your 
                  browsing activities. See our Cookie Policy for more details.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p>SecureShield Solutions</p>
                  <p>Email: privacy@secureshield.com</p>
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

export default PrivacyPolicy;
