"use client";

import { Card } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <div className="prose dark:prose-invert">
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            1. Information We Collect
          </h2>
          <p className="mb-4">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Account information (email, name)</li>
            <li>Translation data and preferences</li>
            <li>Payment information when purchasing subscriptions</li>
            <li>Usage data and interaction with our services</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide and improve our translation services</li>
            <li>Process your transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Communicate with you about products, services, and updates</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal
            information. However, no method of transmission over the Internet is
            100% secure.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            4. Data Retention
          </h2>
          <p className="mb-4">
            We retain your information for as long as your account is active or
            as needed to provide you services. You can request deletion of your
            data at any time.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
