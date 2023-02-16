const { HttpError, ctrlWrapper } = require("../helpers");
const { Contact } = require("../models/contact");

const listContacts = async (req, res) => {
  const { _id: owner } = req.user;
  // --- pagination&filtration ---
  const { page = 1, limit = 20, favorite } = req.params;
  const skip = (page - 1) * limit;

  const answer = await Contact.find(
    favorite ? { owner, favorite } : { owner },
    "-__v",
    { skip, limit }
  );
  res.json(answer);
};

const getContactById = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const answer = await Contact.findOne({ _id: contactId, owner });
  if (!answer) {
    throw HttpError(404);
  }
  res.json(answer);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const answer = await Contact.create({ ...req.body, owner });
  res.status(201).json(answer);
};

const removeContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const answer = await Contact.findOneAndRemove({ _id: contactId, owner });
  if (!answer) {
    throw HttpError(404);
  }
  res.json({ message: "contact deleted" });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const answer = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    req.body,
    {
      new: true,
    }
  );
  if (!answer) {
    throw HttpError(404);
  }
  res.json(answer);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const answer = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    req.body,
    {
      new: true,
    }
  );
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
