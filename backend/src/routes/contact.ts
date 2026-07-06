import { Router, Request, Response } from "express";
import { validateEmail, validateName } from "../validations";
import { sendContactFormEmails } from "../lib/email";

const router = Router();

const VALID_SUBJECTS = ["booking", "service", "pricing", "feedback", "other"];

router.post("/", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body as Record<string, string>;

    const errors: string[] = [];

    const firstNameErr = validateName(firstName ?? "");
    if (firstNameErr) errors.push(firstNameErr);

    const lastNameErr = validateName(lastName ?? "");
    if (lastNameErr) errors.push(lastNameErr.replace("Name", "Last name"));

    const emailErr = validateEmail(email ?? "");
    if (emailErr) errors.push(emailErr);

    if (!subject || !VALID_SUBJECTS.includes(subject)) {
      errors.push("Please select a valid subject");
    }

    if (!message?.trim()) {
      errors.push("Message is required");
    } else if (message.trim().length < 10) {
      errors.push("Message must be at least 10 characters");
    } else if (message.trim().length > 2000) {
      errors.push("Message must be under 2000 characters");
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: errors[0], errors });
    }

    sendContactFormEmails({
      firstName: firstName.trim(),
      lastName:  lastName.trim(),
      email:     email.trim().toLowerCase(),
      phone:     phone?.trim() || undefined,
      subject,
      message:   message.trim(),
    });

    res.json({ success: true, message: "Your message has been sent. We'll get back to you soon!" });
  } catch (err) {
    console.error("[POST /contact]", err);
    res.status(500).json({ success: false, error: "Failed to send message. Please try again." });
  }
});

export default router;
