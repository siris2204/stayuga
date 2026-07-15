"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageCircle } from "lucide-react";
import { apiFetch, ApiRequestError } from "@/lib/api";
import { Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  checkIn: z.string().min(1, "Select a check-in date"),
  checkOut: z.string().min(1, "Select a check-out date"),
  guests: z.coerce.number().int().min(1, "At least 1 guest"),
  message: z.string().optional(),
});

type FormValues = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

export function BookingInquiryForm({
  propertyId,
  propertyTitle,
  maxGuests,
}: {
  propertyId: string;
  propertyTitle: string;
  maxGuests: number;
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues, unknown, FormOutput>({ resolver: zodResolver(schema) });

  const values = watch();
  const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/[^\d]/g, "");
  const whatsappText = encodeURIComponent(
    `Hi Stayuga, I'd like to enquire about ${propertyTitle}${
      values.checkIn && values.checkOut ? ` from ${values.checkIn} to ${values.checkOut}` : ""
    } for ${values.guests ?? "?"} guests.`
  );
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappText}`
    : `https://wa.me/?text=${whatsappText}`;

  async function onSubmit(data: FormOutput) {
    setStatus("idle");
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({ ...data, property: propertyId }),
      });
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof ApiRequestError ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-forest/20 bg-forest/5 p-6 text-center">
        <p className="font-display text-lg text-forest">Enquiry sent</p>
        <p className="mt-2 text-sm text-ink-soft">
          Thank you — our team will get back to you shortly to confirm availability.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-forest underline underline-offset-4"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Full name" {...register("name")} error={errors.name?.message} />
        <Input label="Phone" type="tel" {...register("phone")} error={errors.phone?.message} />
      </div>
      <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Check-in"
          type="date"
          {...register("checkIn")}
          error={errors.checkIn?.message}
        />
        <Input
          label="Check-out"
          type="date"
          {...register("checkOut")}
          error={errors.checkOut?.message}
        />
        <Input
          label="Guests"
          type="number"
          min={1}
          max={maxGuests}
          {...register("guests")}
          error={errors.guests?.message}
        />
      </div>

      <Textarea
        label="Message (optional)"
        placeholder="Tell us about your stay — occasion, preferences, anything else."
        {...register("message")}
      />

      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send enquiry"}
        </Button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink hover:border-ink"
        >
          <MessageCircle size={16} /> Ask on WhatsApp
        </a>
      </div>
    </form>
  );
}
