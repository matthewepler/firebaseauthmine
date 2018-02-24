import { ref, firebaseAuth } from '../config/constants'
import { ADMIN_CODE_ADMIN, ADMIN_CODE_COACH } from '../config/constants';

export function auth (data) {
  return firebaseAuth().createUserWithEmailAndPassword(data.email, data.pw)
    .then((user) => saveUser(user, data))
}

export function logout () {
  return firebaseAuth().signOut()
}

export function login (email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw)
}

export function resetPassword (email) {
  return firebaseAuth().sendPasswordResetEmail(email)
}

export function saveUser (user, data) {
  const setUserType = (str) => {
    switch(str) {
      case ADMIN_CODE_COACH:
        return 'coach'
      case ADMIN_CODE_ADMIN:
        return 'admin'
      default:
        return 'client'
    }
  };

  const userType = setUserType(data.admin);
  const coachData = JSON.parse(data.coach);

  const childObject = {
    name: data.name,
    email: user.email,
    uid: user.uid, 
    phone: data.phone,
    coach: coachData.name,
    coachId: coachData.uid,
    org: 'Bedstuy Restoration',
    userType,
    linkPath: `${userType}/${user.uid}`,
  }

  return ref.child(`users/${user.uid}`)
    .set(childObject)
    .then(() => childObject);
}
