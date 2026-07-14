"use client";

import { useState, type FormEvent } from "react";
import styles from "./signup-form.module.css";

type Status = "idle" | "sending" | "done" | "error";

export function SignupForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());

    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/subscribe", {
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

      setStatus("done");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <p className={styles.done} role="status">
        Welcome aboard — <em>letters are rare, but worth opening.</em>
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="signup-email" className="type-eyebrow">
        Letters from the workshop
      </label>
      <div className={styles.row}>
        <input
          id="signup-email"
          name="email"
          type="email"
          required
          maxLength={254}
          placeholder="Your email"
          autoComplete="email"
        />
        {/* Honeypot: hidden from real users, tempting to bots */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className={styles.trap}
        />
        <button type="submit" disabled={status === "sending"} aria-label="Sign up">
          {status === "sending" ? "…" : "→"}
        </button>
      </div>
      <p className={`type-small ${styles.hint}`}>
        New pieces and workshop notes, a few times a year. No noise.
      </p>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </form>
  );
}
