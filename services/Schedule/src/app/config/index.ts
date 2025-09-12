import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  user_service_url: process.env.USER_SERVICE_URL,
  token_secret: process.env.TOKEN_SECRET,
  token_expires_in: process.env.TOKEN_EXPIRES_IN,
  password_salt_rounds: process.env.PASSWORD_SALT_ROUNDS,
  email: {
    email_host: process.env.EMAIL_HOST,
    email_port: process.env.EMAIL_PORT,
    email_user: process.env.EMAIL_USER,
    email_pass: process.env.EMAIL_PASS,
    email_from: process.env.EMAIL_FROM,
  },
};
