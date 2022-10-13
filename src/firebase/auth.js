import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail
} from "firebase/auth";

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
  createUserWithEmailAndPassword(getAuth(), email, password);

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  signInWithEmailAndPassword(getAuth(), email, password);

// Sign out
export const doSignOut = () =>
  signOut(getAuth());

// Password Reset
export const doPasswordReset = (email) =>
  sendPasswordResetEmail(email);

// Password Change
// export const doPasswordUpdate = (password) =>
//   auth.currentUser.updatePassword(password);

export const whenAuthStateChanged = (user) => {

  onAuthStateChanged(getAuth(), user)
}