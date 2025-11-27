import * as Brevo from '@getbrevo/brevo';

// Configure the API Client
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// Helper function to send email via Brevo API
const sendEmail = async (sendSmtpEmail) => {
  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully via Brevo API. Message ID:', data.messageId);
    return data;
  } catch (error) {
    console.error('Error sending email via Brevo:', error);
    // Throw error so controller handles it
    throw error;
  }
};

export async function sendVerificationCode(email, code) {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = "Your BudgetBuddy verification code";
  sendSmtpEmail.htmlContent = `<h2>Your verification code is: <b>${code}</b></h2>`;
  sendSmtpEmail.sender = { "name": "BudgetBuddy", "email": process.env.SENDER_EMAIL };
  sendSmtpEmail.to = [{ "email": email }];

  return sendEmail(sendSmtpEmail);
}

export const sendExpenseEmail = async (to, { name, description, amount, category, date }) => {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = "Expense Added – BudgetBuddy";
  sendSmtpEmail.sender = { "name": "BudgetBuddy", "email": process.env.SENDER_EMAIL };
  sendSmtpEmail.to = [{ "email": to }];
  
  sendSmtpEmail.htmlContent = `
      <div style="max-width:430px;margin:24px auto;border-radius:12px;box-shadow:0 2px 20px #eee;padding:28px;font-family:sans-serif;background:#f8fafc;">
        <h2 style="color:#5b21b6;margin-top:0;">💸 Expense Added</h2>
        <p>Hi <b>${name}</b>,</p>
        <p>You just added a new expense to <b>BudgetBuddy</b>:</p>
        <table style="width:100%;margin:16px 0;font-size:1.05em;">
          <tr><td><b>Description:</b></td><td>${description}</td></tr>
          <tr><td><b>Amount:</b></td><td style="color:#e11d48;">₹${amount}</td></tr>
          <tr><td><b>Category:</b></td><td>${category}</td></tr>
          <tr><td><b>Date:</b></td><td>${date}</td></tr>
        </table>
        <div style="margin-top:18px;">
          <a href="https://budget-buddyy-v90d.onrender.com/dashboard/expenses" style="background:#5b21b6;color:#fff;text-decoration:none;padding:9px 18px;border-radius:6px;font-weight:500;">
            View All Expenses
          </a>
        </div>
        <div style="margin-top:30px;color:#789;font-size:0.93em;padding-top:12px;border-top:1px solid #eee;">
          Thanks for using <b>BudgetBuddy</b>!<br />
          This is an automated notification—no reply needed.
        </div>
      </div>
    `;

  return sendEmail(sendSmtpEmail);
};