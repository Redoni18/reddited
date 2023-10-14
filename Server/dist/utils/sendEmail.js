"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const constants_1 = require("../constants");
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: constants_1.HOST_EMAIL,
        pass: constants_1.GOOGLE_APP_PASSWORD,
    },
});
async function sendEmail(to, text) {
    const info = await transporter.sendMail({
        from: "Reddited - Reddit Clone",
        to: to,
        subject: "Password Reset",
        text: text,
    });
    console.log("Message sent: %s", info.messageId);
}
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map