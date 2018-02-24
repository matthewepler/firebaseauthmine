export const ADMIN_CODE_COACH = '*COACH';
export const ADMIN_CODE_ADMIN = '*ADMIN';

import firebase from 'firebase'
const config = {
  apiKey: 'AIzaSyDxpaT-08es-T_hNo6Ukxx-efKFbpJgqzk',
  authDomain: 'bedstuy-mvp.firebaseapp.com',
  databaseURL: 'https://bedstuy-mvp.firebaseio.com',
  projectId: 'bedstuy-mvp',
  storageBucket: 'bedstuy-mvp.appspot.com',
  messagingSenderId: '862611408915',
}
firebase.initializeApp(config)
export const ref = firebase.database().ref()
export const database = firebase.database();
export const firebaseAuth = firebase.auth

export const colors = {
  darkGrey: '#333333',
  lightGrey: '#e5e5e5',
  teal: '#009f99',
  yellow: '#f4cf38',
};
