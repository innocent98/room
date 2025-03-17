import Footer from "@/components/footer";
import Header from "@/components/header";

export default function TermsPage() {
    return (
      <div>
        <Header />
        <div className="container mx-auto py-16 px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
  
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-6">
            These Terms and Conditions ("Terms") govern your access to and use of ROOM's website, services, and
            applications (the "Service"). Please read these Terms carefully before using the Service.
          </p>
  
          <p className="mb-6">
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the
            Terms, you may not access the Service.
          </p>
  
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Accounts</h2>
          <p className="mb-4">
            When you create an account with us, you must provide information that is accurate, complete, and current at
            all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of
            your account on our Service.
          </p>
          <p className="mb-4">
            You are responsible for safeguarding the password that you use to access the Service and for any activities or
            actions under your password, whether your password is with our Service or a third-party service.
          </p>
          <p className="mb-4">
            You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware
            of any breach of security or unauthorized use of your account.
          </p>
  
          <h2 className="text-2xl font-bold mt-8 mb-4">2. Intellectual Property</h2>
          <p className="mb-4">
            The Service and its original content, features, and functionality are and will remain the exclusive property
            of ROOM and its licensors. The Service is protected by copyright, trademark, and other laws of both the United
            States and foreign countries.
          </p>
          <p className="mb-4">
            Our trademarks and trade dress may not be used in connection with any product or service without the prior
            written consent of ROOM.
          </p>
  
          <h2 className="text-2xl font-bold mt-8 mb-4">3. User Content</h2>
          <p className="mb-4">
            You retain all of your ownership rights in your content. By uploading content to our Service, you grant us a
            worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and
            distribute your content across our existing and future platforms.
          </p>
          <p className="mb-4">
            You represent and warrant that: (i) your content is yours (you own it) or you have the right to use it and
            grant us the rights and license as provided in these Terms, and (ii) the posting of your content on or through
            the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other
            rights of any person.
          </p>
  
          <h2 className="text-2xl font-bold mt-8 mb-4">4. Subscription and Billing</h2>
          <p className="mb-4">
            Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and
            periodic basis, depending on the type of subscription plan you select.
          </p>
          <p className="mb-4">
            At the end of each period, your subscription will automatically renew under the exact same conditions unless
            you cancel it or ROOM cancels it.
          </p>
          <p className="mb-4">
            You may cancel your subscription at any time through your account settings page. The cancellation will take
            effect at the end of the current paid term.
          </p>
          <p className="mb-4">
            If you are unsatisfied with our Service, please email us at support@room.com or call our customer service
            line.
          </p>
  
          <h2 className="text-2xl font-bold mt-8 mb-4">5. Limitation of Liability</h2>
          <p className="mb-4">
            In no event shall ROOM, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable
            for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss
            of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or
            inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii)
            any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions
            or content, whether based on warranty, contract, tort (including negligence) or any other legal theory,
            whether or not we have been informed of the possibility of such damage.
          </p>
  
          <h2 className="text-2xl font-bold mt-8 mb-4">6. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed and construed in accordance with the laws of the United States, without regard
            to its conflict of law provisions.
          </p>
          <p className="mb-4">
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of
            these Terms will remain in effect.
          </p>
  
          <h2 className="text-2xl font-bold mt-8 mb-4">7. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
            material we will try to provide at least 30 days notice prior to any new terms taking effect.
          </p>
          <p className="mb-4">
            By continuing to access or use our Service after those revisions become effective, you agree to be bound by
            the revised terms. If you do not agree to the new terms, please stop using the Service.
          </p>
  
          <h2 className="text-2xl font-bold mt-8 mb-4">8. Contact Us</h2>
          <p className="mb-4">If you have any questions about these Terms, please contact us at legal@room.com.</p>
  
          <p className="mt-12 text-muted-foreground text-sm">Last updated: March 10, 2023</p>
        </div>
      </div>
        <Footer />
      </div>
    )
  }
  
  