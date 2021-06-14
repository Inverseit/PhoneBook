const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailCode = async (email, code) => {
  const msg = {
    to: email, // Change to your recipient
    from: "seitkalievulan@gmail.com", // Change to your verified sender
    subject: "Verification code",
    text: "Please, use this code",
    html: `<strong>${code}</strong>`,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
};

module.exports = {
  sendEmailCode,
};
