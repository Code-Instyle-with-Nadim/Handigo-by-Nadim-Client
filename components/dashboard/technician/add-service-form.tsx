"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import {
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Info,
  ListChecks,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
  Timer,
  UserRound,
  Wrench,
} from "lucide-react"
import { toast } from "sonner"

import ImageUpload from "@/components/shared/ImageUpload"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { createService } from "@/lib/actions/Service"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
] as const

const SERVICE_MODES = ["Home Visit", "Shop Drop-off"] as const

const CHECKLIST = [
  "A clear, specific service title",
  "A 16:9 banner image that shows the work",
  "A description of what is included",
  "A realistic starting price and duration",
  "The area you are able to cover",
]

const NEXT_STEPS = [
  {
    title: "Submit for review",
    description: "Your listing goes straight to the admin review queue.",
  },
  {
    title: "We check the details",
    description: "Most listings are reviewed within one working day.",
  },
  {
    title: "Go live",
    description: "Once approved, customers can find and book your service.",
  },
]

type AddServiceFormProps = {
  technicianName: string
  technicianEmail: string
}

export default function AddServiceForm({
  technicianName,
  technicianEmail,
}: AddServiceFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)

    // Convert FormData to a plain object so every field is easy to inspect.
    const data = Object.fromEntries(formData.entries());


    // These values are owned by the server, but keeping them here makes the
    // collected object a complete snapshot of the service being created.
    data.approvalStatus = "pending"
    data.isAvailable =
      formData.get("isAvailable") === "false" ? "false" : "true"
    data.createdAt = new Date().toISOString()

    console.log("New service data:", data)

    startTransition(async () => {
      try {
        const result = await createService(formData)

        if (!result.success) {
          toast.error(result.message)
          return
        }

        toast.success("Service submitted for approval", {
          description: "An admin will review it before it goes live.",
        })

        router.push("/dashboard/technician/my-services")
        router.refresh()
      } catch (error) {
        console.error("Unable to submit service", error)
        toast.error("Something went wrong. Please try again.")
      }
    })
  }

  return (
    <form
      onSubmit={onSubmit}
      aria-busy={isPending}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start"
    >
      <div className="space-y-6">
        <Card className="rounded-2xl bg-card/95 shadow-[0_24px_60px_-50px_rgba(7,26,51,0.65)]">
          <CardHeader>
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10">
                <Wrench className="size-4" />
              </span>
              <div>
                <CardTitle className="text-[15px]">Service details</CardTitle>
                <CardDescription className="mt-1 text-[11.5px] leading-relaxed">
                  Tell customers what you fix and exactly what the service
                  includes.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <Field className="gap-2">
              <FieldLabel
                htmlFor="title"
                className="text-[12.5px] font-semibold"
              >
                Service title <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="title"
                name="title"
                type="text"
                required
                minLength={5}
                maxLength={80}
                placeholder="e.g. iPhone screen replacement"
                className="h-11 rounded-xl"
              />
              <FieldDescription className="text-[11px]">
                Keep it short and specific — this is the first thing customers
                see.
              </FieldDescription>
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field className="gap-2">
                <FieldLabel
                  id="category-label"
                  className="text-[12.5px] font-semibold"
                >
                  Category <span className="text-destructive">*</span>
                </FieldLabel>
                <Select name="category" required>
                  <SelectTrigger
                    aria-labelledby="category-label"
                    className="h-11 w-full rounded-xl"
                  >
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription className="text-[11px]">
                  Pick the closest match so the right customers find you.
                </FieldDescription>
              </Field>

              <Field className="gap-2">
                <FieldLabel
                  htmlFor="estimatedDuration"
                  className="text-[12.5px] font-semibold"
                >
                  Estimated duration <span className="text-destructive">*</span>
                </FieldLabel>
                <div className="relative">
                  <Timer className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/70" />
                  <Input
                    id="estimatedDuration"
                    name="estimatedDuration"
                    type="text"
                    required
                    minLength={2}
                    maxLength={40}
                    placeholder="e.g. 2-3 hours"
                    className="h-11 rounded-xl pl-9"
                  />
                </div>
                <FieldDescription className="text-[11px]">
                  A rough time window helps customers plan their day.
                </FieldDescription>
              </Field>
            </div>

            <Field className="gap-2">
              <FieldLabel
                htmlFor="description"
                className="text-[12.5px] font-semibold"
              >
                Description <span className="text-destructive">*</span>
              </FieldLabel>
              <Textarea
                id="description"
                name="description"
                required
                minLength={20}
                maxLength={600}
                rows={5}
                placeholder="Describe the problem you solve, the parts included, and anything the customer should know before booking."
                className="min-h-28 rounded-xl"
              />
              <FieldDescription className="text-[11px]">
                Mention parts, warranty and any callout fees. 20–600 characters.
              </FieldDescription>
            </Field>

            <ImageUpload
              name="image"
              variant="banner"
              label="Service banner"
              title="Add a cover image for your service"
              hint="Upload a 16:9 banner to ImgBB. JPG, PNG or WebP, max 5MB."
              required
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-card/95 shadow-[0_24px_60px_-50px_rgba(7,26,51,0.65)]">
          <CardHeader>
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10">
                <CircleDollarSign className="size-4" />
              </span>
              <div>
                <CardTitle className="text-[15px]">
                  Pricing &amp; availability
                </CardTitle>
                <CardDescription className="mt-1 text-[11.5px] leading-relaxed">
                  Set a starting price and choose how customers can meet you.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field className="gap-2">
                <FieldLabel
                  htmlFor="basePrice"
                  className="text-[12.5px] font-semibold"
                >
                  Starting price <span className="text-destructive">*</span>
                </FieldLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[12px] font-semibold text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="basePrice"
                    name="basePrice"
                    type="number"
                    required
                    min={1}
                    step="0.01"
                    inputMode="decimal"
                    placeholder="49"
                    className="h-11 rounded-xl pl-7"
                  />
                </div>
                <FieldDescription className="text-[11px]">
                  Shown on your card. You can agree on extras after inspection.
                </FieldDescription>
              </Field>

              <Field className="gap-2">
                <FieldLabel
                  id="serviceMode-label"
                  className="text-[12.5px] font-semibold"
                >
                  Service mode <span className="text-destructive">*</span>
                </FieldLabel>
                <Select name="serviceMode" defaultValue="Home Visit" required>
                  <SelectTrigger
                    aria-labelledby="serviceMode-label"
                    className="h-11 w-full rounded-xl"
                  >
                    <SelectValue placeholder="Choose a service mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_MODES.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription className="text-[11px]">
                  Where the work happens — at the customer&apos;s place or your
                  shop.
                </FieldDescription>
              </Field>
            </div>

            <Field className="gap-2">
              <FieldLabel
                htmlFor="serviceArea"
                className="text-[12.5px] font-semibold"
              >
                Service area <span className="text-destructive">*</span>
              </FieldLabel>
              <div className="relative">
                <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  id="serviceArea"
                  name="serviceArea"
                  type="text"
                  required
                  minLength={3}
                  maxLength={100}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  className="h-11 rounded-xl pl-9"
                />
              </div>
              <FieldDescription className="text-[11px]">
                List the neighbourhoods or city you can realistically cover.
              </FieldDescription>
            </Field>

            <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-muted/25 p-4">
              <div className="min-w-0">
                <Label
                  htmlFor="isAvailable"
                  className="text-[12.5px] font-semibold"
                >
                  Available for bookings
                </Label>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  Keep this on so customers can book as soon as the service is
                  approved. You can pause it anytime.
                </p>
              </div>

              <Switch
                id="isAvailable"
                name="isAvailable"
                defaultChecked
                value="true"
                uncheckedValue="false"
                aria-label="Available for bookings"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-card/95 shadow-[0_24px_60px_-50px_rgba(7,26,51,0.65)]">
          <CardHeader>
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10">
                <UserRound className="size-4" />
              </span>
              <div>
                <CardTitle className="text-[15px]">Listed by you</CardTitle>
                <CardDescription className="mt-1 text-[11.5px] leading-relaxed">
                  These details are copied from your HandiGo! account.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-5 sm:grid-cols-2">
            <Field className="gap-2">
              <FieldLabel
                htmlFor="technicianName"
                className="text-[12.5px] font-semibold"
              >
                Technician name
              </FieldLabel>
              <div className="relative">
                <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  id="technicianName"
                  name="technicianName"
                  type="text"
                  value={technicianName}
                  readOnly
                  className="h-11 rounded-xl bg-muted/40 pl-9"
                />
              </div>
            </Field>

            <Field className="gap-2">
              <FieldLabel
                htmlFor="technicianEmail"
                className="text-[12.5px] font-semibold"
              >
                Technician email
              </FieldLabel>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  id="technicianEmail"
                  name="technicianEmail"
                  type="email"
                  value={technicianEmail}
                  readOnly
                  className="h-11 rounded-xl bg-muted/40 pl-9"
                />
              </div>
            </Field>
          </CardContent>

          <CardFooter className="text-[11px] leading-relaxed text-muted-foreground">
            <LockKeyhole className="size-3.5 shrink-0 text-primary" />
            Locked to your account. Update your details from Profile &amp;
            settings.
          </CardFooter>
        </Card>

        <input type="hidden" name="approvalStatus" value="pending" />

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/85 p-4 shadow-[0_18px_45px_-42px_rgba(7,26,51,0.6)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <p>
              Submitting sends this service to the admin review queue. You can
              edit or pause it later from My Services.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            <Link
              href="/dashboard/technician/my-services"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 rounded-xl px-4 text-[12px]"
              )}
            >
              Cancel
            </Link>

            <Button
              type="submit"
              disabled={isPending}
              className="h-10 rounded-xl bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] px-5 text-[12px] font-semibold text-white shadow-[0_14px_28px_-14px_rgba(37,99,235,0.9)] transition-all hover:brightness-110 focus-visible:ring-3 focus-visible:ring-primary/35 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              {isPending ? "Submitting…" : "Submit for approval"}
            </Button>
          </div>
        </div>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-24">
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ListChecks className="size-4 text-primary" />
              <CardTitle className="text-[15px]">Before you submit</CardTitle>
            </div>
            <CardDescription className="text-[11.5px]">
              A complete listing gets approved faster.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {CHECKLIST.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-[11.5px] leading-relaxed"
                >
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock3 className="size-4 text-primary" />
              <CardTitle className="text-[15px]">What happens next</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {NEXT_STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary ring-1 ring-primary/15">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold">{step.title}</p>
                    <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border-0 bg-brand-deep text-white ring-0">
          <CardHeader>
            <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-sky-300 ring-1 ring-white/10">
              <ShieldCheck className="size-4" />
            </span>
            <CardTitle className="text-[15px] text-white">
              Good to know
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[11.5px] leading-relaxed text-slate-300">
            <p>
              You can pause bookings anytime by switching availability off. The
              listing stays in your dashboard, ready to turn back on.
            </p>
            <Separator className="bg-white/10" />
            <p>
              If a listing is rejected, you can update the details and submit it
              again for review.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[10px] font-semibold tracking-[0.08em] text-sky-200/80 uppercase">
              <Sparkles className="size-3" />
              Quality listings get more bookings
            </div>
          </CardContent>
        </Card>
      </aside>
    </form>
  )
}
