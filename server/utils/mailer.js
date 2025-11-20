import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
   host: "smtp.gmail.com",
  port: 465,         
  secure: true, 
  auth: {
    user: process.env.GMAIL_USER, 
    pass: process.env.GMAIL_PASS, 
  },
});

export async function sendVerificationCode(email, code) {
  return transporter.sendMail({
    from: `"BudgetBuddy" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your BudgetBuddy verification code",
    html: `<h2>Your verification code is: <b>${code}</b></h2>`,
  });
}

export const sendExpenseEmail = async (to, { name, description, amount, category, date }) => {
  await transporter.sendMail({
    from: 'BudgetBuddy <your@email>',
    to: to,
    subject: 'Expense Added – BudgetBuddy',
    html: `
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
    `
  });
};