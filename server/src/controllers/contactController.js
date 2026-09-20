import catchAsync from "../utils/catchAsync.js";
import ApiResponse from "../utils/ApiResponse.js";
import ContactInfo from "../models/ContactInfo.js";

export const getContact = catchAsync(async (req, res) => {
  const contact = await ContactInfo.findOne();
  return res.json(new ApiResponse(200, "Contact info fetched successfully", contact));
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
