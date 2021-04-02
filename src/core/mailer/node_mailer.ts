import nodemailer from 'nodemailer';
import { config } from '../../config';
import { SendEmailPayload } from '../interfaces/send_email_payload';

export const sendEmail = async (mailService: string, data: SendEmailPayload): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serviceConfig = (config.mailer as any)[mailService];
  if (!serviceConfig) {
    throw new Error(`Mail service ${mailService} not found`);
  }

  const transporter = nodemailer.createTransport({
    host: serviceConfig.host,
    port: serviceConfig.port,
    secure: serviceConfig.secure,
    auth: {
      user: serviceConfig.account,
      pass: serviceConfig.password,
    },
  });

  const mailOptions = {
    from: serviceConfig.account,
    ...data,
  };
  await transporter.sendMail(mailOptions);
};
