import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COURSES } from "@/lib/colleges-data";
import { toast } from "sonner";

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+?91[-\s]?)?[6-9]\d{9}$/, "Enter a valid Indian mobile (+91)"),
  course: z.enum(COURSES),
  message: z.string().trim().max(1000).optional(),
});

type FormValues = z.infer<typeof schema>;

export function EnquiryDialog({
  collegeName,
  children,
}: {
  collegeName: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { course: "B.Tech" },
  });

  const course = watch("course");

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Enquiry sent!", {
      description: `${collegeName}'s admissions office will contact you shortly.`,
    });
    reset();
    setOpen(false);
    console.log("[enquiry]", { college: collegeName, ...values });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enquire — {collegeName}</DialogTitle>
          <DialogDescription>
            Fill in your details. Sign in with Google to auto-fill.
          </DialogDescription>
        </DialogHeader>

        <Button type="button" variant="outline" className="w-full">
          Sign in with Google to auto-fill
        </Button>

        <div className="relative my-1 text-center text-xs uppercase text-muted-foreground">
          <span className="bg-background px-2">or fill manually</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" placeholder="Aarav Sharma" {...register("fullName")} />
            {errors.fullName && (
              <p className="text-xs text-destructive">{errors.fullName.message}</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="phone">Phone (+91)</Label>
            <Input id="phone" placeholder="9876543210" {...register("phone")} />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label>Course interested</Label>
            <Select
              value={course}
              onValueChange={(v) => setValue("course", v as FormValues["course"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COURSES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              placeholder="Any specific questions?"
              rows={3}
              {...register("message")}
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="mt-1 w-full">
            {isSubmitting ? "Sending…" : "Send enquiry"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}