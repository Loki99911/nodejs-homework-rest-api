const { HttpError, ctrlWrapper,} = require("../helpers");
const { Contact } = require("../models/contact");

const listContacts = async (req, res) => {
  const answer = await Contact.find();
  res.json(answer);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const answer = await Contact.findById(contactId);
  if (!answer) {
    throw HttpError(404);
  }
  res.json(answer);
};

const addContact = async (req, res) => {
  const answer = await Contact.create(req.body);
  res.status(201).json(answer);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const answer = await Contact.findByIdAndRemove(contactId);
  if (!answer) {
    throw HttpError(404);
  }
  res.json({ message: "contact deleted" });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const answer = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!answer) {
    throw HttpError(404);
  }
  res.json(answer);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const answer = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!answer) {
    throw HttpError(404);
  }
  res.json(answer);
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  removeContact: ctrlWrapper(removeContact),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
