import { OTP_EXPIRY_MINUTES } from '../app/modules/EmailOtp/emailOtp.constant';

export const otpEmailTemplate = (otp: string, userName?: string) => `
  <div style="
    font-family: Arial, sans-serif; 
    padding: 20px; 
    border: 1px solid #ddd; 
    border-radius: 8px; 
    max-width: 500px; 
    margin: auto;
    background-color: #f9f9f9;
  ">
    <h2 style="color: #1890ff; text-align: center;">🔒 Your OTP Code</h2>
    <p>Hi ${userName ? `<strong>${userName}</strong>` : 'there'},</p>
    <p>Use the following One-Time Password (OTP) to verify your email address:</p>
    <div style="
      text-align: center;
      margin: 20px 0;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 4px;
      color: #ff4d4f;
    ">
      ${otp}
    </div>
    <p>This OTP is valid for <strong>${OTP_EXPIRY_MINUTES} minutes</strong>. Please do not share it with anyone.</p>
    <p style="margin-top: 20px; color: #888; text-align: center;">- Timely Class Team</p>
  </div>
`;
