const React = require("../models/React");
const User = require("../models/User");
const mongoose = require("mongoose");

// Registering the reaction for a post
exports.reactPost = async (req, res) => {
  try {
    const { postId, react } = req.body;
    // Check if user has already reacted or not
    const check = await React.findOne({
      postRef: postId,
      reactBy: new mongoose.Types.ObjectId(req.user.id),
    });
    if (check == null) {
      // If Not reacted
      const newReact = new React({
        react: react,
        postRef: postId,
        reactBy: req.user.id,
      });
      await newReact.save();
    } else {
      // If reacted already
      if (check.react == react) {
        // If the previous reaction is same as the current one, then remove the reaction altogether
        await React.findByIdAndRemove(check._id);
      } else {
        // If the previous reaction is different then current one, then update the reaction to current one
        await React.findByIdAndUpdate(check._id, {
          react: react,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Fetch the types and number of reactions on a post
exports.getReacts = async (req, res) => {
  try {
    const reactsArray = await React.find({ postRef: req.params.id });

    // "reduce()"is used to transform an array(reactsArray) into a new object(newReacts).
    const newReacts = reactsArray.reduce((group, react) => {
      // Key will be the type of reaction
      let key = react["react"];
      // Checks if there is already an array for the given reaction type in the newReacts object
      // If there isn't, it initializes an empty array for that reaction type
      group[key] = group[key] || [];
      // It then pushes the current reaction(react) into the appropriate array in the newReacts object.
      group[key].push(react);

      // Final result is an object where the keys are reaction types (e.g., "like," "love," etc.),
      // and the values are arrays of reactions of that type.
      return group;
    }, {});

    // In this part of the code, the reacts array is constructed based on the newReacts object.
    // Each element of the reacts array represents a specific type of reaction (e.g., "like," "love," "haha," etc.),
    // and it includes the count of reactions of that type.
    const reacts = [
      {
        react: "like",
        count: newReacts.like ? newReacts.like.length : 0,
      },
      {
        react: "love",
        count: newReacts.love ? newReacts.love.length : 0,
      },
      {
        react: "haha",
        count: newReacts.haha ? newReacts.haha.length : 0,
      },
      {
        react: "sad",
        count: newReacts.sad ? newReacts.sad.length : 0,
      },
      {
        react: "wow",
        count: newReacts.wow ? newReacts.wow.length : 0,
      },
      {
        react: "angry",
        count: newReacts.angry ? newReacts.angry.length : 0,
      },
    ];

    // Checking if the user has reaction on the given post
    // Method 1....................
    // const check1 = reacts.find(
    //   (x) => x.reactBy.toString() == req.user.id
    // )?.react;
    //  Method 2...................
    const check = await React.findOne({
      postRef: req.params.id,
      reactBy: req.user.id,
    });

    const user = await User.findById(req.user.id);
    // Checking if user has saved this post
    const checkSaved = user?.savedPosts.find(
      (x) => x.post.toString() === req.params.id
    );
    res.json({
      reacts,
      check: check?.react,
      total: reactsArray.length,
      checkSaved: checkSaved ? true : false,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
