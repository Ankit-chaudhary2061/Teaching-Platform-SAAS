import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface IMailInformation {
  to: string;
  subject: string;
  text: string;
}

const sendMail = async (mailInformation: IMailInformation) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", //Gmail SMTP server.
      port: 587,//587 for TLS (secure email connection).
      secure: false,//secure: false: Means the connection starts as non-secure and upgrades to TLS (STARTTLS).
      auth: {
        user: process.env.NODEMAILER_GMAIL!,//your Gmail address (from .env)
        pass: process.env.NODEMAILER_GMAIL_APP_PASSWORD!,//your Gmail app password (not your normal password — must be an App Password)
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_GMAIL!,
      to: mailInformation.to,
      subject: mailInformation.subject,
      text: mailInformation.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error(" Error sending email:", error);
    throw error; // Controller handles response
  }
};

export default sendMail;
