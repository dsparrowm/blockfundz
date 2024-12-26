import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const FAQSection = () => {
  const faqs = [
    {
      question: "How do I get started?",
      answer: "Getting started is easy! Simply sign up for an account, and our onboarding process will guide you through the essential features and setup steps. We've designed it to be intuitive and user-friendly."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our encrypted payment system."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Yes, you can cancel your subscription at any time without any penalties. Your service will continue until the end of your current billing period, and you won't be charged again."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card is required to start your trial, and you can upgrade to a paid plan at any time."
    },
    {
      question: "How can I contact customer support?",
      answer: "Our customer support team is available 24/7 through multiple channels. You can reach us via email at support@example.com, through our live chat system, or by phone at 1-800-EXAMPLE."
    }
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto bg-red-500">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-white">Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-semibold text-white">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default FAQSection;