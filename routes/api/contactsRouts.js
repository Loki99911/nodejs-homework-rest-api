const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contactsContr");
const { validateBody, isValidId, authenticate } = require("../../middlewars");
const { schemaJoi, updateFavoriteSchemaJoi } = require("../../models/contact");

router.get("/", authenticate, ctrl.listContacts);

router.get("/:contactId", authenticate, isValidId, ctrl.getContactById);

router.post("/", authenticate, validateBody(schemaJoi), ctrl.addContact);

router.delete("/:contactId", authenticate, isValidId, ctrl.removeContact);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schemaJoi),
  ctrl.updateContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(updateFavoriteSchemaJoi),
  ctrl.updateStatusContact
);

module.exports = router;
