const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY, BASE_URL } = process.env;
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const avatarDir = path.join(__dirname, "../", "public", "avatars");
var Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");

const signup = async (req, res) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
 
  const avatarURL = gravatar.url(email);
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = uuidv4();

  const answer = await User.create({
    email,
    password: hashPassword,
    subscription,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blank" href='${BASE_URL}/api/users/verify/${verificationToken}'>Click to verify e-mail!!!</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: answer.email,
      subscription: answer.subscription,
      avatarURL: answer.avatarURL,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

  res.json({
    massage: "Verification successful",
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(400, "missing required field email");
  }

  if (user.verify) {
    throw HttpError(400,"Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blank" href='${BASE_URL}/api/users/verify/${user.verificationToken}'>Click to verify e-mail!!!</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    massage: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
    if (user.verify) {
      throw HttpError(401, "Email not verify");
    }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { token: "" });
  res.status(204).json({});
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const subscription = async (req, res) => {
  const { subscription, _id } = req.user;
  const answer = await User.findByIdAndUpdate(_id, req.body, { new: true });
  res.json({ subscription: answer.subscription });
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(401);
  }
  const { path: tempUpload, originalname } = req.file;
  const { _id } = req.user;
  const extention = originalname.split(".").pop(); //get extention of file
  const filename = `${_id}_avatar.${extention}`;
  const resultUpload = path.join(avatarDir, filename);

  await Jimp.read(tempUpload)
    .then((ava) => {
      return ava
        .resize(250, 250) // resize
        .write(tempUpload); // save
    })
    .catch((err) => {
      throw err;
    });

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  signup: ctrlWrapper(signup),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  subscription: ctrlWrapper(subscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
