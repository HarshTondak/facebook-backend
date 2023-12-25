const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
const mongoose = require("mongoose");
const { readdirSync } = require("fs");
const { dotenv } = require("dotenv").config();

// NOTE
// Use this to secure the usage of your site from unwanted IPs
// let allowed = ["http://localhost:3000"];
// function options(req, res) {
//   let tmp;
//   let origin = req.header("Origin");
//   if (allowed.indexOf(origin) > -1) {
//     tmp = {
//       origin: true,
//       optionSuccessStatus: 200,
//     };
//   } else {
//     tmp = {
//       origin: false,
//     };
//   }
//   res(null, tmp);
// }
// app.use(cors(options));

app.use(express.json());

// Using this because we are working on the local host itself
app.use(cors());

// To upload images
app.use(
  fileUpload({
    // Store files in a temporary storage(tmp folder)
    useTempFiles: true,
  })
);
////////////////////////// ROUTES ///////////////////////////////
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

////////////////////////// DATABASE /////////////////////////////
mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.log("Error found", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
