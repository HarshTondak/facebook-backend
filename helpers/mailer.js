const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const { EMAIL, APP_PASS } = process.env;

// To send email verification mail for account activation
exports.sendVerificationEmail = async (email, name, url) => {
  try {
    // Setting the connection
    const stmp = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Use port 465 for SSL
      secure: true, // Set to true for SSL
      auth: {
        user: EMAIL,
        pass: APP_PASS,
      },
    });

    // Mail Content
    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Snapbook email verification",
      html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#a5f"><img src="https://res.cloudinary.com/djdgo0syl/image/upload/v1703758902/icon_sa1jcp.png" alt="" style="width:30px"><span>Action required: Activate your Snapbook account</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>Hello ${name}</span><div style="padding:20px 0"><span style="padding:1.5rem 0">You recently created an account on Snapbook. To complete your registration, please confirm your account.</span></div><a href=${url} style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600">Confirm your account</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">Snapbook allows you to stay in touch with all your friends, once registered on Snapbook, you can share photos, organize events and much more.</span></div></div>`,
    };

    // Sending mail
    const res = await stmp.sendMail(mailOptions);
    return res;
  } catch (error) {
    console.log(error);
  }
};

// To send email verification mail for password reset
exports.sendResetCode = async (email, name, code) => {
  try {
    // Setting the connection
    const stmp = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Use port 465 for SSL
      secure: true, // Set to true for SSL
      auth: {
        user: EMAIL,
        pass: APP_PASS,
      },
    });

    // Mail Content
    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Reset Snapbook password",
      html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#a5f"><img src="https://res.cloudinary.com/djdgo0syl/image/upload/v1703758902/icon_sa1jcp.png" alt="" style="width:30px"><span>Action required: Activate your Snapbook account</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>Hello ${name}</span><div style="padding:20px 0"><span style="padding:1.5rem 0">You recently created an account on Snapbook. To complete your registration, please confirm your account.</span></div><a  style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600">${code}</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">Snapbook allows you to stay in touch with all your friends, once registered on Snapbook, you can share photos, organize events and much more.</span></div></div>`,
    };

    // Sending mail
    const res = await stmp.sendMail(mailOptions);
    return res;
  } catch (error) {
    console.log(error);
  }
};
