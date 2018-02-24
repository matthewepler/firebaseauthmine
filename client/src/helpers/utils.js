import { NotificationManager } from 'react-notifications';

export const createNotification = (type, text) => {
  switch (type) {
    case 'info':
      NotificationManager.info(text, null, 3000);
      break;
    case 'success':
      NotificationManager.success(text, null, 3000);
      break;
    case 'warning':
      NotificationManager.warning(text, null, 6000);
      break;
    case 'error':
      NotificationManager.error(text, null, 6000);
      break;
    default:
  }
};

export const snapshotToArray = (snapshot) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};

export function setErrorMsg(error) {
  return {
    errorMsg: error
  }
}

const getCleanPhoneNumber = (num) => {
  let digits = num.replace(/[^+\d]/g, '');
  if (digits.length > 10) {
    return digits.slice(-10);
  }
  return digits;
}

export function sendText(userDbObj) {
  return new Promise((resolve, reject) => {
    let cleanDigits = getCleanPhoneNumber(userDbObj.phone);
    fetch('/api/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: userDbObj.name,
        phone: cleanDigits,
        org: userDbObj.org,
        coach: userDbObj.coach,
        link: userDbObj.link,
      })
    })
    .then(res => res.json())
    .then((data) => {
      console.log('response from /api/text:', data);
      if (data.status === 'ok') {
        createNotification('success', 'Text sent!');
        resolve(true);
      } else {
        createNotification('error', 'Error sending text. Please check the number and try again.');
        resolve(false);
      }
    }).catch((err) => {
      createNotification('error', 'Error communicating with server while sending text. Please try again or contact support.');
      resolve(false);
    });
  })
}

export function sendEmail(userDbObj) {
  return new Promise((resolve, reject) => {
    fetch(`/api/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: userDbObj.name,
        email: userDbObj.email,
        org: userDbObj.org,
        coach: userDbObj.coach,
        link: userDbObj.link,
      })
    })
    .then(res => res.json())
    .then((data) => {
      console.log('response from /api/email:', data);
      if (data.status === 'ok') {
        createNotification('success', 'Email sent!');
        resolve(true);
      } else {
        createNotification('error', 'Error sending email. Please check the address and try again.');
        resolve(false);
      }
    }).catch((err) => {
      createNotification('error', 'Error communicating with server while sending email. Please try again or contact support.');
      resolve(false);
    });
  })
}
