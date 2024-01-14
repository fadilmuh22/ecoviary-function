import * as functions from "firebase-functions";
import {onSchedule} from "firebase-functions/v2/scheduler";
import firebase from "firebase-admin";
import express, {Express, Request, Response} from "express";

const app: Express = express();

// type Automations = {
//   foods: number[];
//   water: number[];
//   disinfectant: number[];
//   date: number;
// };

const firebaseApp = firebase.initializeApp({
  credential: firebase.credential.cert({
    projectId: functions.config().project.id,
    clientEmail: functions.config().client.email,
    privateKey: functions.config().private.key.replace(/\\n/g, "\n"),
  }),
  databaseURL: functions.config().database.url,
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

exports.watchAutomations = onSchedule("* * * * * *", () => {
  const automationsRef = firebaseApp.database().ref("controls");

  automationsRef.on("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      functions.logger.info(childKey, childData);
    });
  });
});


exports.app = functions.https.onRequest(app);
