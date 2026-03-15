require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

module.exports = transporter;

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend-Bank" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail,name) {

  const subject="Welcome to backend series"
  const text=`hello ${name} thankyou for registration `
  const html=`<p>Hello ${name} thankyou for registration at backend </p>`

  await sendEmail(userEmail,subject,text,html);
  
}
module.exports={
  sendRegistrationEmail
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Notification";
  const text = `Hello ${name}, your transaction of $${amount} to account ${toAccount} has been processed.`;
  const html = `<p>Hello ${name},</p><p>Your transaction of <strong>$${amount}</strong> to account <strong>${toAccount}</strong> has been processed.</p>`;

  await sendEmail(userEmail, subject, text, html);
}
async function sendFailedTransactionEmail(userEmail, name, amount, toAccount, reason) {
  const subject = "Transaction Failed Notification";
  const text = `Hello ${name}, your transaction of $${amount} to account ${toAccount} has failed. Reason: ${reason}.`;
  const html = `<p>Hello ${name},</p><p>Your transaction of <strong>$${amount}</strong> to account <strong>${toAccount}</strong> has failed.</p><p>Reason: <em>${reason}</em></p>`;

  await sendEmail(userEmail, subject, text, html);
}


module.exports = {
  transporter,
  sendEmail,
  sendRegistrationEmail,
  sendTransactionEmail,
  sendFailedTransactionEmail
  
}

