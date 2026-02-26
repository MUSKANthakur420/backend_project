import { asynchandler } from "../utils/asynchandler.js";
import { apierror } from "../utils/apierror.js";
import { User } from "../models/user.model.js";
import { uploadFileOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { apires } from "../utils/apires.js";
import jwt from "jsonwebtoken";

/* ================= GENERATE TOKENS ================= */
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch {
    throw new apierror(500, "Token generation failed");
  }
};

/* ================= REGISTER ================= */
const registerUser = asynchandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  if (!fullname?.trim()) throw new apierror(400, "Full name required");
  if (!username?.trim()) throw new apierror(400, "Username required");
  if (!email?.trim()) throw new apierror(400, "Email required");
  if (!password?.trim()) throw new apierror(400, "Password required");

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser)
    throw new apierror(409, "User already exists");

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverimageLocalPath = req.files?.coverimage?.[0]?.path;

  if (!avatarLocalPath) throw new apierror(400, "Avatar required");

  const avatar = await uploadFileOnCloudinary(avatarLocalPath);
  const coverimage = coverimageLocalPath
    ? await uploadFileOnCloudinary(coverimageLocalPath)
    : null;

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  return res.status(201)
    .json(new apires(200, createdUser, "User registered"));
});

/* ================= LOGIN ================= */
const loginUser = asynchandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email)
    throw new apierror(400, "Username or email required");

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) throw new apierror(404, "User not found");

  const validPassword = await user.isPasswordCorrect(password);
  if (!validPassword) throw new apierror(401, "Invalid credentials");

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new apires(200, { user: loggedInUser }, "Login success"));
});

/* ================= LOGOUT ================= */
const logoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: undefined },
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apires(200, {}, "Logout success"));
});

/* ================= REFRESH TOKEN ================= */
const refreshAccessToken = asynchandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken)
    throw new apierror(401, "Unauthorized");

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken?._id);
  if (!user) throw new apierror(401, "Invalid refresh token");

  if (incomingRefreshToken !== user.refreshToken)
    throw new apierror(401, "Expired refresh token");

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new apires(200, { accessToken, refreshToken }, "Token refreshed"));
});

/* ================= CHANGE PASSWORD ================= */
const changeCurrentPassword = asynchandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  const isValidPassword = await user.isPasswordCorrect(oldPassword);
  if (!isValidPassword)
    throw new apierror(400, "Invalid password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200)
    .json(new apires(200, {}, "Password changed"));
});

/* ================= CURRENT USER ================= */
const currentUser = asynchandler(async (req, res) => {
  return res.status(200)
    .json(new apires(200, req.user, "Current user"));
});

/* ================= UPDATE ACCOUNT ================= */
const updateAccountDetails = asynchandler(async (req, res) => {
  const { fullname, email } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { fullname, email } },
    { new: true }
  ).select("-password");

  return res.status(200)
    .json(new apires(200, user, "Account updated"));
});

/* ================= UPDATE AVATAR ================= */
const updateUserAvatar = asynchandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  const oldavatar = req.user.avatar;

  if (!avatarLocalPath)
    throw new apierror(400, "File missing");

  const avatar = await uploadFileOnCloudinary(avatarLocalPath);

  if (oldavatar) await deleteFromCloudinary(oldavatar);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select("-password");

  return res.status(200)
    .json(new apires(200, user, "Avatar updated"));
});

/* ================= UPDATE COVER ================= */
const updateUserCoverImage = asynchandler(async (req, res) => {
  const coverimageLocalPath = req.file?.path;
  const oldcoverImage = req.user.coverimage;

  if (!coverimageLocalPath)
    throw new apierror(400, "File missing");

  const coverImage = await uploadFileOnCloudinary(coverimageLocalPath);

  if (oldcoverImage) await deleteFromCloudinary(oldcoverImage);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { coverimage: coverImage.url } },
    { new: true }
  ).select("-password");

  return res.status(200)
    .json(new apires(200, user, "Cover updated"));
});

/* ================= CHANNEL PROFILE ================= */
const userChannelProfile = asynchandler(async (req, res) => {
  const { username } = req.params;

  const channel = await User.aggregate([
    { $match: { username: username.toLowerCase() } },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        channelsSubscribedToCount: { $size: "$subscribedTo" },
      },
    },
  ]);

  return res.status(200)
    .json(new apires(200, channel[0], "Channel profile"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  currentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  userChannelProfile,
};