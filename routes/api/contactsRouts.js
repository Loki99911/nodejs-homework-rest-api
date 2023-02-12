const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contactsContr");
const { validateBody, isValidId } = require("../../middlewars");
const { schemaJoi, updateFavoriteSchemaJoi } = require("../../models/contact");

router.get("/", ctrl.listContacts);

router.get("/:contactId", isValidId, ctrl.getContactById);

router.post("/", validateBody(schemaJoi), ctrl.addContact);

router.delete("/:contactId", isValidId, ctrl.removeContact);

router.put(
  "/:contactId",
  isValidId,
  validateBody(schemaJoi),
  ctrl.updateContact
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(updateFavoriteSchemaJoi),
  ctrl.updateStatusContact
);

module.exports = router;
