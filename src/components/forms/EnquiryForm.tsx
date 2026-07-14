"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./enquiry-form.module.css";

interface EnquiryFormProps {
  pieces: string[];
}

type Status = "idle" | "sending" | "sent" | "error";

export function EnquiryForm({ pieces }: EnquiryFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = (await response.json()) as { success: boolean; error: string | null };

      if (!response.ok || !payload.success) {
        setStatus("error");
        setError(payload.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("sent");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please check your connection and try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className={styles.sent} role="status">
        <p className={styles.sentHeading}>
          Received. <em>The drawing board is yours.</em>
        </p>
        <p className={`type-body ${styles.sentBody}`}>
          We read every enquiry ourselves and reply within a couple of days — usually with more
          questions. Good tables start with good conversations.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Honeypot: hidden from real users, tempting to bots */}
      <div className={styles.trap} aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={styles.field}>
        <label htmlFor="enquiry-name" className="type-eyebrow">
          Your name
        </label>
        <input id="enquiry-name" name="name" type="text" required maxLength={120} autoComplete="name" />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="enquiry-email" className="type-eyebrow">
            Email
          </label>
          <input id="enquiry-email" name="email" type="email" required maxLength={254} autoComplete="email" />
        </div>
        <div className={styles.field}>
          <label htmlFor="enquiry-location" className="type-eyebrow">
            Where in the world
          </label>
          <input id="enquiry-location" name="location" type="text" maxLength={160} placeholder="City, country" />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="enquiry-piece" className="type-eyebrow">
          Starting point
        </label>
        <select id="enquiry-piece" name="piece" defaultValue="Something entirely custom">
          <option>Something entirely custom</option>
          {pieces.map((piece) => (
            <option key={piece}>{piece}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="enquiry-message" className="type-eyebrow">
          What are you imagining?
        </label>
        <textarea
          id="enquiry-message"
          name="message"
          required
          maxLength={5000}
          rows={5}
          placeholder="Room, dimensions, timber, timeline — whatever you know so far."
        />
      </div>

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <div className={styles.actions}>
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send enquiry"}
        </Button>
        <p className={`type-small ${styles.note}`}>We reply to every enquiry, worldwide.</p>
      </div>
    </form>
  );
}
