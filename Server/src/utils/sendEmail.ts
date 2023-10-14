import nodemailer from "nodemailer";
import { GOOGLE_APP_PASSWORD, HOST_EMAIL } from "../constants";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: HOST_EMAIL,
    pass: GOOGLE_APP_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, text: string) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "Reddited - Reddit Clone", // sender address
    to: to,
    subject: "Password Reset",
    text: text,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}