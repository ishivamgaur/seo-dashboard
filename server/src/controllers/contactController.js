import nodemailer from "nodemailer";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ContactInfo from "../models/ContactInfo.js";

export const getContact = catchAsync(async (req, res) => {
  const contact = await ContactInfo.findOne();
  return res.json(new ApiResponse(200, "Contact info fetched successfully", contact));
});

const buildTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
};

export const sendInquiry = catchAsync(async (req, res) => {
  const { name, phone, vehicle, message } = req.body || {};

  if (!name?.trim() || !phone?.trim()) {
    throw ApiError.badRequest("Name and phone number are required.");
  }

  const transporter = buildTransporter();
  if (!transporter) {
    throw new ApiError(503, "Email service is not configured yet.");
  }

  const contact = await ContactInfo.findOne();
  const to = contact?.email || process.env.CONTACT_TO;
  if (!to) {
    throw new ApiError(503, "No recipient address configured.");
  }

  const clean = {
    name: name.trim(),
    phone: phone.trim(),
    vehicle: vehicle?.trim() || "-",
    message: (message || "").trim() || "(no message)",
    at: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  };

  const row = (label, value, shade) => `
    <tr>
      <td style="padding:10px 14px;font-size:12px;font-weight:700;color:#52525b;text-transform:uppercase;letter-spacing:0.08em;width:130px;background:${shade};">${label}</td>
      <td style="padding:10px 14px;font-size:14px;color:#18181b;background:#ffffff;">${value}</td>
    </tr>`;

  const rows = [
    row("Name", clean.name, "#f6f8fa"),
    row("Phone", clean.phone, "#ffffff"),
    row("Vehicle", clean.vehicle, "#f6f8fa"),
    row("Message", clean.message.replace(/\n/g, "<br>"), "#ffffff"),
    row("Received", `${clean.at} IST`, "#f6f8fa"),
  ].join("");

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `New booking inquiry from ${clean.name}`,
    text: `Name: ${clean.name}\nPhone: ${clean.phone}\nVehicle: ${clean.vehicle}\nReceived: ${clean.at} IST\n\n${clean.message}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">
        <div style="background:#0d9488;color:#ffffff;padding:16px 20px;border-radius:12px 12px 0 0;">
          <div style="font-size:16px;font-weight:bold;">New booking inquiry</div>
          <div style="font-size:12px;opacity:0.9;">Urban Cruise website form</div>
        </div>
        <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid #e4e4e7;border-top:0;">
          <tbody>${rows}</tbody>
        </table>
        <div style="font-size:11px;color:#a1a1aa;padding:10px 4px;">
          Reply directly to this email or call the customer back.
        </div>
      </div>`,
  });

  return res.json(new ApiResponse(200, "Inquiry sent successfully", null));
});

export const updateContact = catchAsync(async (req, res) => {
  let contact = await ContactInfo.findOne();
  const updateData = { ...req.body };

  if (contact) {
    Object.assign(contact, updateData);
    await contact.save();
  } else {
    contact = await ContactInfo.create(updateData);
  }

  return res.json(new ApiResponse(200, "Contact info updated successfully", contact));
});
