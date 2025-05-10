require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");

const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./utils")
const upload = require("./multer")
const fs = require("fs")
const path = require("path") 

const app = express();
app.use(express.json());

app.use(cors());

const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model")

mongoose.connect(config.connectionString);

app.get("/hell", async (req, res) =>  {

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
  const { title, story, visitedLocation, imageUrl, visitedDate} = req.body;
  const {userId} = req.user;

  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    res.status(400).json({ error: true, message: "All fields are mandatory" });
  }

  const parsedVisitedDate = new Date(parseInt(visitedDate));

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

app.post("/edit-story/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    res.status(400).json({ error: true, message: "All fields are mandatory" });
  }

  const parsedVisitedDate = new Date(parseInt(visitedDate));

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
    if (!travelStory) {
      res.status(404).json({ error: true, message: "Travel Story not found" });
    }

    const placeholderImageurl = "http://localhost:8000/assets/placeholder.png";

    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocation = visitedLocation;
    travelStory.imageUrl = imageUrl || placeholderImageurl;
    travelStory.visitedDate = parsedVisitedDate;

    await travelStory.save();
    res
      .status(200)
      .json({ story: travelStory, message: "updated successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
    if (!travelStory) {
      res.status(404).json({ error: true, message: "Travel Story not found" });
    }

    await travelStory.deleteOne({ _id: id, userId: userId });
    
    const imageUrl = travelStory.imageUrl;
    const filename = path.basename(imageUrl);

    const filePath = path.join(__dirname, "uploads", filename)

    fs.unlink(filePath, (err) => {
      if(err){
        console.log("failed to delete the image",err)
      }
    })

    res.status(200).json({message: "travel story deleted successfully"})
    
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
 
  }

  
});

app.put("/update-is-favourite/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { isFavourite } = req.body;
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
    if (!travelStory) {
      res.status(404).json({ error: true, message: "Travel Story not found" });
    }
    travelStory.isFavourite = isFavourite;
    await travelStory.save();

    res
      .status(200)
      .json({ story: travelStory, message: "updated successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: "No image uploaded" });
  }
});

app.get("/search", authenticateToken, async (req, res) => {
  const { query } = req.query;
  const { userId } = req.user;

  if (!query) {
    res.status(404).json({ error: true, message: "query not found" });
  }

  try {
    const searchResults = await TravelStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavourite: -1 });

    res.status(200).json({ stories: searchResults });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});


app.get("/travel-stories/filter", authenticateToken, async (req, res) => {
const {startDate, endDate} = req.query
const {userId} = req.user;


try {
  const start = new Date(parseInt(startDate));
  const end = new Date(parseInt(endDate));

  const filteredStories = await TravelStory.find({
    userId : userId,
    visitedDate : {$gte: start, $lte: end},
  }).sort({isFavourite:-1});

  res.status(200).json({stories: filteredStories})
} catch (error) {
  
}
})


app.post("/image-upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: true, message: "No image uploaded" });
    }
    const imageURL = `http://localhost:8000/uploads/${req.file.filename}`;
    res.status(201).json({ imageURL });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use("/assets", express.static(path.join(__dirname, "assets")))



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

app.delete("/delete-image", async (req, res) => {
  const { imageURL } = req.query;
  if (!imageURL) {
    res
      .status(400)
      .json({ error: true, message: "imageURL parameter is required" });
  }

  try {
    const filename = path.basename(imageURL);
    const filePath = path.join(__dirname, "uploads", filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "successfully deleted the image" });
    } else {
      res.status(400).json({ error: true, message: "No image Found" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});



app.listen(8000, () => {
  console.log("✨ Magic happens on port 8000 ✨");
});
module.exports = app;
