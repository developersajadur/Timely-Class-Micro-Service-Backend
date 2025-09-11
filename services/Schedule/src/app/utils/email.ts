import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: config.email.email_host,
    port: Number(config.email.email_port),
    secure: false,
    auth: {
      user: config.email.email_user,
      pass: config.email.email_pass,
    },
  });

  await transporter.sendMail({
    from: config.email.email_from,
    to,
    subject,
    html,
  });
};
