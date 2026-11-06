import { NextRequest } from "next/server";
import { validateEmail, validateName } from "@/server/validations";
import { sendContactFormEmails } from "@/server/lib/email";

const VALID_SUBJECTS = ["booking", "service", "pricing", "feedback", "other"];

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, phone, subject, message } = await req.json() as Record<string, string>;

    const errors: string[] = [];
    const firstNameErr = validateName(firstName ?? "");
    if (firstNameErr) errors.push(firstNameErr);
    const lastNameErr = validateName(lastName ?? "");
    if (lastNameErr) errors.push(lastNameErr.replace("Name", "Last name"));
    const emailErr = validateEmail(email ?? "");
    if (emailErr) errors.push(emailErr);
    if (!subject || !VALID_SUBJECTS.includes(subject)) errors.push("Please select a valid subject");
    if (!message?.trim()) errors.push("Message is required");
    else if (message.trim().length < 10) errors.push("Message must be at least 10 characters");
    else if (message.trim().length > 2000) errors.push("Message must be under 2000 characters");

    if (errors.length > 0) {
      return Response.json({ success: false, error: errors[0], errors }, { status: 400 });
    }

    sendContactFormEmails({
      firstName: firstName.trim(), lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      subject, message: message.trim(),
    });

    return Response.json({ success: true, message: "Your message has been sent. We'll get back to you soon!" });
  } catch (err) {
    console.error("[POST /api/contact]", err);
    return Response.json({ success: false, error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
