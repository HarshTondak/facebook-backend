const User = require("../models/User");

// Email Validation (using Regular Expressions)
// "+" means we can have string on any size
//  "?" means optional part
exports.validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
};

// Validation text lengths
exports.validateLength = (text, min, max) => {
  if (text.length > max || text.length < min) {
    return false;
  }
  return true;
};

// Validating usernames (checking them against the usernames stored in the database)
exports.validateUsername = async (username) => {
  let a = false;

  // Runs until we get a unique username
  do {
    let check = await User.findOne({ username });
    if (check) {
      // update username
      username += (+new Date() * Math.random()).toString().substring(0, 1);
      a = true;
    } else {
      a = false;
    }
  } while (a);
  return username;
};
