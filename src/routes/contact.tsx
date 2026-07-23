import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — EduSphere India" },
      {
        name: "description",
        content: "Get in touch with the EduSphere India admissions team for college guidance.",
      },
      { property: "og:title", content: "Contact Us — EduSphere India" },
      {
        property: "og:description",
        content: "Get in touch for personalised college guidance across India.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Contact Us</h1>
        <p className="mt-2 text-muted-foreground">
          Have a question about admissions, fees, or campus life? Our team is here to help.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <ContactCard icon={Mail} title="Email" value="hello@edusphere.in" />
          <ContactCard icon={Phone} title="Call" value="+91 80 4567 8900" />
          <ContactCard icon={MessageCircle} title="WhatsApp" value="+91 98765 43210" />
        </div>

        <div className="mt-8 rounded-2xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Send us a message</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell us your goals and we'll match you with the right colleges.
          </p>
          <EnquiryDialog collegeName="EduSphere Admissions Desk">
            <Button className="mt-4">Open enquiry form</Button>
          </EnquiryDialog>
        </div>
      </div>
    </AppShell>
  );
}

function ContactCard({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 text-xs uppercase text-muted-foreground">{title}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}