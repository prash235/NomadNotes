require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");

const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./utils")

const app = express();
app.use(express.json());

app.use(cors({ origin: "*" }));

const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model")

mongoose.connect(config.connectionString);

app.get("/hell", async (req, res) => {

    res.status(400).json({ error: true, message: "All fields are mandatory" });
  
})

app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!email || !password || !fullName) {
    res.status(400).json({ error: true, message: "All fields are mandatory" });
  }

  const isUser = await User.findOne({ email });

  if (isUser) {
    res.status(400).json({ error: true, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  await user.save();

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "72h",
    }
  );

  return res.status(201).json({
    error: false,
    user: { fullName: user.fullName, email: user.email },
    accessToken,
    message: "registration Successful",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ error: true, message: "emailid and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ error: true, message: "user not exists" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(400).json({ error: true, message: "invalid credentials" });
  }

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "72h",
    }
  );

  return res.json({
    error: false,
    message: "Login succesful ",
    user: { fullName: user.fullName, email: user.email },
    accessToken,
  });
});

app.get("/get-user",authenticateToken,async (req, res) => {
  const {userId} = req.user
  const isUser = await User.findOne({_id:userId})

  if(!isUser){
    return res.sendStatus(401);
  }

  console.log(isUser)

  return res.json({
    user: isUser,
    message: "",
  })
})

app.post("/add-travel-story",authenticateToken,async (req, res) => {
  const { title, story, visitedLocation, imageUrl, visiteDate} = req.body;
  const {userId} = req.user;

  if (!title || !story || !visitedLocation || !imageUrl || !visiteDate) {
    res.status(400).json({ error: true, message: "All fields are mandatory" });
  }

  const parsedVisitedDate = new Date(parseInt(visiteDate));

  try {
    
    const travelStory = new TravelStory({
      title,
      story,
      visitedLocation,
      userId,
      imageUrl,
      visitedDate: parsedVisitedDate
    })

    await travelStory.save();
    return res.status(201).json({
      story: travelStory,
      message: "Added Successfully",
    });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }

})

app.get("/get-all-stories",authenticateToken,async (req, res) => {
  const {userId} = req.user
  // const isUser = await User.findOne({_id:userId})

  try {
    const travelstories = await TravelStory.find({ userId: userId }).sort({
      isFavourite : -1
    })
    console.log(travelstories)
    return res.status(200).json({
      stories: travelstories
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
})


app.listen(8000, () => {
  console.log("✨ Magic happens on port 8000 ✨");
});
module.exports = app;
