"use client";

import { Card } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <div className="prose dark:prose-invert">
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4">
            By accessing and using Lingo Translate, you agree to be bound by
            these Terms of Service and all applicable laws and regulations. If
            you do not agree with any of these terms, you are prohibited from
            using or accessing this site.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily access the materials
            (information or software) on Lingo Translate for personal,
            non-commercial transitory viewing only.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            3. Translation Accuracy
          </h2>
          <p className="mb-4">
            While we strive for accuracy in our translations, we cannot
            guarantee perfect results. Users should verify important
            translations through additional means.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Accounts</h2>
          <p className="mb-4">
            You are responsible for maintaining the confidentiality of your
            account and password. You agree to accept responsibility for all
            activities that occur under your account.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            5. Service Modifications
          </h2>
          <p className="mb-4">
            We reserve the right to modify or discontinue, temporarily or
            permanently, the service with or without notice.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Limitations</h2>
          <p className="mb-4">
            Lingo Translate shall not be liable for any damages arising out of
            the use or inability to use the materials on our website.
          </p>
        </div>
      </Card>
    </div>
  );
}
