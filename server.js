const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const SparkPost = require('sparkpost');
const Twilio = require('twilio');
// var generatePassword = require('password-generator');

const isProd = process.env.NODE_ENV === 'production';
if (!isProd) require('dotenv').config();

const app = express();
const sparkpost = new SparkPost(process.env.SPARKPOST_APIKEY);
const twilio = Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// Serve static files from the React app in production
// in dev, React is using a proxy as described in client/package.json
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());

app.post('/api/text', (req, res) => {
  twilio.messages.create({
    to: `+1${req.body.phone}`,
    from: process.env.TWILIO_NUM,
    body: `
      Welcome to ${req.body.org}, ${req.body.name}!\n
      Here's a link to your personal action list: ${req.body.link} ✅;\n
      You got this. 💵 💪`,
  }).then((message) => {
    res.json({ status: 'ok' });
  }).catch((err) => {
    console.log(err);
    res.json({ status: 'err' });
  });
});

app.post('/api/email', (req, res) => {
  console.log(req.body);
  sparkpost.transmissions.send({
    content: {
      from: 'no-reply@dev.ideo.org',
      subject: 'Welcome to Bedstuy Restoration',
      html: renderEmail(req.body),
    },
    recipients: [
      { address: req.body.email },
    ],
  }).then((data) => {
    res.json({ status: 'ok' });
  }).catch((err) => {
    console.log(err);
    res.json({ status: 'err' });
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server listening on ${port}`);

function renderEmail(emailData) {
  return `
    <html>
      <body style="background: white">
        <div style="background: #009f99;box-sizing: border-box;">
          <header style="display: flex;">
            
            <img src="http://restorationplaza.org/wp-content/uploads/Restoration_Logo_White.png" style="padding:25px;width: 100px; height: 110px"/>
            <span><h1 style="color: white; margin-top: 60px">Welcome, ${emailData.name}!</h1></span>
          
            </header>
        </div>
        <div style="font-size: 16px; margin: 25px">
          <p>Your journey to improving your financial health starts today!</p>
          <p>Here's a link to your <a href="">${emailData.link}</a> personal action list &#x2705;.</p>
          <p>You got this. &#x1F4B5; &#x1F4AA;</p>

          <p>If you need to reach your coach, ${emailData.coach}, you can reach them through the text bot. Just 
          text HELP and it will...help!</p>
        </div>
      </body>
    </html>
  `;
}
