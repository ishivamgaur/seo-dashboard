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

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `New booking inquiry from ${name.trim()}`,
    text: [
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Vehicle: ${vehicle?.trim() || "-"}`,
      "",
      (message || "").trim() || "(no message)",
    ].join("\n"),
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
