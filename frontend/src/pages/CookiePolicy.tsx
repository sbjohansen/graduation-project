import { PageTitle } from '@/components/PageTitle';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen py-16">
      <PageTitle title="Cookie Policy" />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Cookie Policy</h1>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground mb-6">
                <strong>Last updated:</strong> June 9, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
                <p className="mb-4">
                  Cookies are small text files that are placed on your computer or mobile device 
                  when you visit our website. They help us provide you with a better experience 
                  by remembering your preferences and improving our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
                <p className="mb-4">We use cookies for the following purposes:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Essential functionality (login, authentication, security)</li>
                  <li>User preferences (theme settings, language preferences)</li>
                  <li>Performance monitoring and analytics</li>
                  <li>Training progress tracking</li>
                  <li>Security and fraud prevention</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Essential Cookies</h3>
                  <p className="mb-4">
                    These cookies are necessary for the website to function and cannot be switched 
                    off. They are usually set in response to actions made by you such as logging in 
                    or setting privacy preferences.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Functional Cookies</h3>
                  <p className="mb-4">
                    These cookies enable enhanced functionality and personalization, such as 
                    remembering your training preferences and progress.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Analytics Cookies</h3>
                  <p className="mb-4">
                    These cookies help us understand how visitors interact with our website by 
                    collecting and reporting information anonymously.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Performance Cookies</h3>
                  <p className="mb-4">
                    These cookies allow us to monitor and improve the performance of our training 
                    platform and detect any issues.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
                <p className="mb-4">
                  We may use third-party services that set cookies on our behalf for analytics, 
                  performance monitoring, and security purposes. These include:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Google Analytics (for website analytics)</li>
                  <li>Security services (for fraud prevention)</li>
                  <li>Content delivery networks (for performance)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
                <p className="mb-4">
                  You can control and manage cookies in several ways:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Browser settings: Most browsers allow you to refuse or delete cookies</li>
                  <li>Opt-out tools: You can opt out of analytics cookies</li>
                  <li>Account settings: Manage functional cookies through your account preferences</li>
                </ul>
                <p className="mb-4">
                  Please note that disabling certain cookies may affect the functionality of our 
                  training platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Cookie Retention</h2>
                <p className="mb-4">
                  Different cookies have different retention periods:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Session cookies: Deleted when you close your browser</li>
                  <li>Persistent cookies: Remain for a specific period or until manually deleted</li>
                  <li>Functional cookies: Typically retained for 30 days to 1 year</li>
                  <li>Analytics cookies: Usually retained for up to 2 years</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Updates to This Policy</h2>
                <p className="mb-4">
                  We may update this Cookie Policy from time to time. Any changes will be posted 
                  on this page with an updated revision date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about our use of cookies, please contact us at:
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

export default CookiePolicy;
