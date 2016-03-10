Meteor.startup( function() {
  process.env.MAIL_URL = "smtp://postmaster%40sandbox7b39f3de4c3c43fa89698300c47a5dbf.mailgun.org:a5585097c88cfab4d4c3f8410e141fae" + "@smtp.mailgun.com:465";
});