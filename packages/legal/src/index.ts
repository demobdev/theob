export type LegalSection = {
  title: string;
  paragraphs: string[];
};

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
};

export const LEGAL_CONTACT = {
  businessName: "The Owner's Box Bar & Grill",
  address: "1757 Woodruff Rd. STE A, Greenville, SC 29607",
  email: "privacy@theownersbox.com",
  phone: "(864) 732-6963",
} as const;

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  lastUpdated: "June 2, 2026",
  intro:
    "The Owner's Box Bar & Grill (\"The Owner's Box,\" \"we,\" \"us,\" or \"our\") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and protect information when you use our mobile application, website, loyalty program, and in-store pickup ordering features (collectively, the \"Services\").",
  sections: [
    {
      title: "1. Information we collect",
      paragraphs: [
        "Account information: When you create an account, we collect information such as your name, email address, and phone number through our authentication provider (Clerk).",
        "Order and pickup information: When you place an order, we collect items in your cart, fulfillment method (in-store or curbside pickup), scheduled pickup time, vehicle description for curbside orders, and order status.",
        "Loyalty information: If you participate in Box Score or related rewards programs, we collect points balances, redemption history, and activity needed to administer the program.",
        "Device and usage information: We collect technical data such as device type, operating system, app version, and how you interact with the Services. We use analytics tools (PostHog) to understand feature usage and improve the product.",
        "Diagnostics: We use error and performance monitoring (Sentry) to identify crashes and stability issues. These reports may include device identifiers, stack traces, and coarse usage context.",
        "Communications: If you contact us for support, we collect the information you choose to provide.",
      ],
    },
    {
      title: "2. How we use your information",
      paragraphs: [
        "Provide and operate the Services, including menu browsing, cart, checkout, order tracking, and loyalty features.",
        "Authenticate you and secure your account.",
        "Process and fulfill pickup orders at our Greenville location and communicate order status.",
        "Operate, analyze, and improve the Services, including debugging and product analytics.",
        "Send service-related messages (for example, order confirmations or account notices).",
        "Comply with law, prevent fraud, and enforce our Terms.",
      ],
    },
    {
      title: "3. How we share information",
      paragraphs: [
        "We do not sell your personal information.",
        "We share information with service providers that help us run the Services, including hosting and database (Convex), authentication (Clerk), analytics (PostHog), and error monitoring (Sentry). These providers process data on our instructions.",
        "When payment processing is enabled, we will share payment-related information with our payment processor to complete transactions. We do not store full payment card numbers on our servers.",
        "We may share information with restaurant operations staff to fulfill your orders.",
        "We may disclose information if required by law, legal process, or to protect the rights, safety, and security of our guests, staff, and business.",
        "If we are involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction, subject to continued protection consistent with this policy.",
      ],
    },
    {
      title: "4. Data retention",
      paragraphs: [
        "We retain personal information for as long as needed to provide the Services, comply with legal obligations, resolve disputes, and enforce our agreements.",
        "Order and loyalty records may be retained for accounting, tax, and operational purposes.",
        "Analytics and diagnostic data are retained according to the settings of our providers and our internal retention schedules.",
      ],
    },
    {
      title: "5. Security",
      paragraphs: [
        "We use reasonable administrative, technical, and organizational measures designed to protect your information. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
      ],
    },
    {
      title: "6. Your choices and rights",
      paragraphs: [
        "Account information: You may update certain profile information through the app or by contacting us.",
        "Marketing: If we send promotional messages, you may opt out using the unsubscribe method provided in those messages.",
        "Analytics: Some device settings may limit certain tracking. The app does not respond to \"Do Not Track\" signals in a uniform way.",
        "Depending on where you live, you may have rights to access, correct, delete, or obtain a copy of your personal information, or to object to or restrict certain processing. To exercise these rights, contact us at the email below. We may need to verify your identity before responding.",
      ],
    },
    {
      title: "7. Children's privacy",
      paragraphs: [
        "The Services are not directed to children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided us personal information, contact us and we will take appropriate steps to delete it.",
      ],
    },
    {
      title: "8. Third-party links",
      paragraphs: [
        "The Services may link to third-party websites or services (for example, social media or live sports content). Those third parties have their own privacy policies, and we are not responsible for their practices.",
      ],
    },
    {
      title: "9. Changes to this policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. We will post the updated policy with a new \"Last Updated\" date. Material changes may be communicated through the app or other reasonable means. Continued use of the Services after changes become effective means you accept the updated policy.",
      ],
    },
    {
      title: "10. Contact us",
      paragraphs: [
        `${LEGAL_CONTACT.businessName}`,
        LEGAL_CONTACT.address,
        `Email: ${LEGAL_CONTACT.email}`,
        `Phone: ${LEGAL_CONTACT.phone}`,
      ],
    },
  ],
};

export const termsOfService: LegalDocument = {
  title: "Terms & Conditions",
  lastUpdated: "June 2, 2026",
  intro:
    "These Terms & Conditions (\"Terms\") govern your use of the mobile application, website, loyalty program, and ordering features offered by The Owner's Box Bar & Grill (\"The Owner's Box,\" \"we,\" \"us,\" or \"our\"). By accessing or using the Services, you agree to these Terms.",
  sections: [
    {
      title: "1. The Services",
      paragraphs: [
        "The Services allow you to browse our menu, place pickup orders for our Greenville, South Carolina location, participate in loyalty programs, view sports-related content, and manage your account.",
        "Menu items, prices, availability, and promotions may change without notice. We may modify or discontinue any part of the Services at any time.",
      ],
    },
    {
      title: "2. Eligibility and accounts",
      paragraphs: [
        "You must be at least 13 years old to use the Services. If you are under 18, you may use the Services only with involvement of a parent or guardian.",
        "You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. Notify us promptly of any unauthorized use.",
        "You agree to provide accurate, current information when creating an account or placing an order.",
      ],
    },
    {
      title: "3. Orders, pickup, and payments",
      paragraphs: [
        "Orders submitted through the app are requests until accepted and confirmed by the restaurant. We may refuse or cancel orders (for example, due to item availability, kitchen capacity, or suspected fraud).",
        "Pickup is available at our Greenville location only unless we explicitly offer additional fulfillment methods. You are responsible for arriving during your selected pickup window and providing accurate curbside details when applicable.",
        "Prices, taxes, fees, and totals shown in the app are estimates until confirmed at checkout. You are responsible for all applicable charges associated with your order.",
        "Payment processing may be provided by third-party processors. By submitting payment information, you authorize us and our processors to charge your selected payment method for your order.",
      ],
    },
    {
      title: "4. Loyalty program",
      paragraphs: [
        "Points, rewards, and promotions offered through Box Score or related programs have no cash value unless we expressly state otherwise, are non-transferable, and may be subject to additional rules displayed in the app.",
        "We may change, suspend, or end loyalty benefits at any time. Abuse of the program (including fraud or misuse) may result in forfeiture of points and account termination.",
      ],
    },
    {
      title: "5. Acceptable use",
      paragraphs: [
        "You agree not to misuse the Services, including by attempting to gain unauthorized access, interfering with operation, scraping data, harassing staff or other users, or using the Services for unlawful purposes.",
      ],
    },
    {
      title: "6. Intellectual property",
      paragraphs: [
        "The Services, including logos, design, text, images, and software, are owned by The Owner's Box or our licensors and are protected by intellectual property laws. You receive a limited, non-exclusive, revocable license to use the Services for personal, non-commercial purposes.",
      ],
    },
    {
      title: "7. Disclaimers",
      paragraphs: [
        "THE SERVICES ARE PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.",
        "We do not guarantee uninterrupted or error-free operation, accurate sports scores or schedules, or that menu information will always be complete or current.",
      ],
    },
    {
      title: "8. Limitation of liability",
      paragraphs: [
        "TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE OWNER'S BOX AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICES.",
        "OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF THESE TERMS OR THE SERVICES WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US FOR THE ORDER GIVING RISE TO THE CLAIM IN THE 12 MONTHS BEFORE THE CLAIM OR (B) ONE HUNDRED U.S. DOLLARS ($100).",
        "Some jurisdictions do not allow certain limitations, so some of the above may not apply to you.",
      ],
    },
    {
      title: "9. Indemnification",
      paragraphs: [
        "You agree to indemnify and hold harmless The Owner's Box from claims arising out of your misuse of the Services or violation of these Terms.",
      ],
    },
    {
      title: "10. Governing law",
      paragraphs: [
        "These Terms are governed by the laws of the State of South Carolina, without regard to conflict-of-law rules. Exclusive venue for disputes arising from these Terms or the Services shall be in Greenville County, South Carolina, unless applicable law requires otherwise.",
      ],
    },
    {
      title: "11. Changes",
      paragraphs: [
        "We may update these Terms from time to time. The \"Last Updated\" date will change when we do. Continued use after changes become effective constitutes acceptance of the revised Terms.",
      ],
    },
    {
      title: "12. Contact",
      paragraphs: [
        `${LEGAL_CONTACT.businessName}`,
        LEGAL_CONTACT.address,
        `Email: ${LEGAL_CONTACT.email}`,
        `Phone: ${LEGAL_CONTACT.phone}`,
      ],
    },
  ],
};
