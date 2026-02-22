import { asynchandler } from "../utils/asynchandler.js";
import { apierror } from "../utils/apierror.js";
import { User } from "../models/user.model.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";
import { apires } from "../utils/apires.js";
const generateAccessAndRefereshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refereshToken = user.generateRefereshToken()
    user.refereshToken = refereshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refereshToken }
  } catch (error) {
    throw new apierror(500, "Something went wrong while generating referesh and access token")
  }
}
const registerUser = asynchandler(async (req, res) => {
  // debug
  // console.log("BODY:", req.body);
  // console.log("FILES:", req.files);

  const { username, email, fullname, password } = req.body;

  // ✅ Validation
  if (!fullname?.trim()) throw new apierror(400, "Full name is required");
  if (!username?.trim()) throw new apierror(400, "Username is required");
  if (!email?.trim()) throw new apierror(400, "Email is required");
  if (!password?.trim()) throw new apierror(400, "Password is required");

  // ✅ Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser)
    throw new apierror(409, "User with email or username already exists");

  // ✅ Get file paths from multer
  const avatarLocalPath = req.files?.avatar?.[0]?.path; // ?-> mehtod chaining
  const coverimageLocalPath = req.files?.coverimage?.[0]?.path;

  if (!avatarLocalPath) throw new apierror(400, "Avatar file is required");

  console.log("avatarLocalPath:", avatarLocalPath);
  console.log("coverimageLocalPath:", coverimageLocalPath);

  // ✅ Upload to Cloudinary
  const avatar = await uploadFileOnCloudinary(avatarLocalPath);
  const coverimage = coverimageLocalPath
    ? await uploadFileOnCloudinary(coverimageLocalPath)
    : null;

  if (!avatar?.url) throw new apierror(400, "Avatar upload failed");

  // ✅ Create user in DB
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // ✅ Fetch user without password & refresh token
  const createdUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  if (!createdUser) throw new apierror(500, "Something went wrong with the user");

  return res
    .status(201)
    .json(new apires(200, createdUser, "User registered successfully"));
});
const loginUser = asynchandler(async (req, res) => {
  //req body ->data
  //username or email
  //find the user
  //password check
  //access and refresh token
  //send cookies
  const { email, username, password } = req.body
  if (!username || !email) {
    throw new apierror(400, "username or password is required")
  }
  const user = await User.findOne({
    $or: [{ username }, { email }]
  })
  if (!user) {
    throw new apierror(404, "user doesn't exist")
  }
  const validPassword = await user.isPasswordCorrect(password)
  if (!validPassword) {
    throw new apierror(401, "Invalid user credential")
  }
 const {accessToken,refereshToken}=await generateAccessAndRefereshToken(user._id)
 const loggedInUser=await User.findById(user._id).select("-password -refereshToken")
 const options={
httpOnly:true,
secure:true
 }
 return res.status(200).cookie("accessToken",accessToken,options).cookie("refereshToken",refereshToken,options).json(
  new apires(
    200,
    {
      user:loggedInUser,accessToken,refereshToken
    },
    "user logged in successfully"
  )
 )
}
)
export { registerUser, loginUser };