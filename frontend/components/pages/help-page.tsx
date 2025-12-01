"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Book, FileQuestion, Headphones, MessageCircle, Search, Video } from "lucide-react"

const resources = [
  {
    icon: Book,
    title: "Documentation",
    description: "Explore our comprehensive guides and API references",
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Watch step-by-step tutorials to get started quickly",
  },
  {
    icon: MessageCircle,
    title: "Community Forum",
    description: "Connect with other users and share knowledge",
  },
  {
    icon: Headphones,
    title: "Contact Support",
    description: "Get help from our dedicated support team",
  },
]

const faqs = [
  {
    question: "How do I reset my password?",
    answer:
      "You can reset your password by going to Settings > Security > Change Password. If you're locked out, use the 'Forgot Password' link on the login page.",
  },
  {
    question: "How do I export my data?",
    answer:
      "Navigate to Analytics > Reports and click on 'Generate Report'. You can choose from various formats including CSV, PDF, and Excel.",
  },
  {
    question: "Can I add team members to my account?",
    answer:
      "Yes! Go to Settings > Team Management to invite new team members. You can assign different roles and permissions to each member.",
  },
  {
    question: "How does billing work?",
    answer:
      "We offer monthly and annual billing options. You can manage your subscription from Settings > Billing. Annual plans include a 20% discount.",
  },
  {
    question: "What integrations are available?",
    answer:
      "We integrate with popular tools including Slack, Zapier, Google Analytics, and more. Check out our Integrations page for the full list.",
  },
]

export function HelpPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto"
      >
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">How can we help you?</h1>
        <p className="text-muted-foreground mt-2">Search our knowledge base or browse common topics below.</p>
        <div className="relative mt-6 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search for help..." className="pl-10" />
        </div>
      </motion.div>

      {/* Resources Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {resources.map((resource, index) => {
          const Icon = resource.icon
          return (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="rounded-lg bg-muted p-3 mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* FAQs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Support CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <Headphones className="h-12 w-12 mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Still need help?</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              Our support team is available 24/7 to help you with any questions or issues you may have.
            </p>
            <Button className="mt-4">Contact Support</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
