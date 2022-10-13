import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// var { config } = require('../temp/config')
// console.log(process.env.REACT_APP_SA)
var config = JSON.parse(process.env.REACT_APP_SA)

if (process.env.NODE_ENV !== 'production') {
  //testing and development
  console.log('loaded ' + process.env.NODE_ENV)
  console.log(config)

} else {
  //production
  console.log('loaded ' + process.env.NODE_ENV)
}

const app = initializeApp(config);
const db = getFirestore(app);
const auth = getAuth(app);
const storr = getStorage(app);
// const settings = {/* your settings... */ timestampsInSnapshots: true };
// db.settings(settings);

export {
  auth,
  db,
  storr,
  app,
};

