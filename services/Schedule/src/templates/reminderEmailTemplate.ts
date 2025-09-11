export const reminderEmailTemplate = (schedule: {
  userName: string;
  subject: string;
  instructor: string;
  startTime: string;
  day: string;
}) => `
  <div style="
    font-family: Arial, sans-serif;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    max-width: 600px;
    margin: auto;
    background-color: #f0f8ff;
  ">
    <h2 style="color: #1890ff; text-align: center;">📚 Class Reminder</h2>
    <p>Hi <strong>${schedule.userName}</strong>,</p>
    <p>This is a friendly reminder for your upcoming class:</p>
    <div style="
      background-color: #e6f7ff; 
      border: 1px solid #91d5ff; 
      padding: 15px; 
      border-radius: 6px;
      margin: 15px 0;
    ">
      <p><strong>Subject:</strong> ${schedule.subject}</p>
      <p><strong>Instructor:</strong> ${schedule.instructor}</p>
      <p><strong>Start Time:</strong> ${schedule.startTime}</p>
      <p><strong>Day:</strong> ${schedule.day || 'Regular'}</p>
    </div>
    <p style="color: #ff4d4f; font-weight: bold;">Don't be late!</p>
    <p style="margin-top: 20px; color: #888; text-align: center;">- Your App Team</p>
  </div>
`;
