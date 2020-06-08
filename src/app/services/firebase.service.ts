/* The Pencil project

   Copyright (c) 2020 Bruce Ziming He<bruce.he.62@gmail.com>
   See LICENSE.txt for more information
*/

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import Base64 from './bas64';
// load firebase secrets
import config from './firebase.config';
/* // firebase.config contains the configurations (refer to firebase for more info)
export default {
    apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    databaseURL: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    projectId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    storageBucket: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    messagingSenderId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    appId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
*/

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private provider;
  private auth;
  private firestore;
  private _user;

  constructor(private router: Router) { 
    firebase.initializeApp(config);

    this.provider = new firebase.auth.GoogleAuthProvider();
    this.auth = firebase.auth();
    this.auth.onAuthStateChanged(async userAuth => {
      this._user = userAuth;
      if(this.isLoggedin()) {
        console.log(`successfully logged in`);
        this.createUser();
        this.router.navigateByUrl('/edit');
      } else {
        this.router.navigateByUrl('/login')
      }
    });

    this.firestore = firebase.firestore();
  }

  public getUser() {
    return this._user || {};
  }

  private getUid() {
    const user = this._user || {};
    return user.uid;
  }

  public isLoggedin() {
    return this._user;
  }

  public login () {
    console.log('firebase: sign in with popup')
    this.auth.signInWithPopup(this.provider);
    /*
    this._user  ={
      displayName: 'Bruce He'
    }
    this.router.navigateByUrl('/edit');
    */
  }

  public logout() {
    console.log('firebase: sign out');
    this.auth.signOut();
    this._user = undefined;
    // navigate to login page after logged out
    this.router.navigateByUrl('/login');
  }

  public async saveUserDocument (data: string) {
    const uid = this.getUid();
    if (!uid) {
      console.error("Error saving user document - no user");
      return;
    }
    const userRef = this.firestore.doc(`users/${uid}`);
    data = Base64.encode(data);
    try {
      await userRef.set({ data  });
      console.log(`firebase: saved user document`);
    } catch (error) {
      console.error("Error saving user document", error);
    }
  }

  public async getUserDocument () {
    const uid = this.getUid();
    if (!uid) {
      console.error("Error fetching user document - no user");
      return '';
    }
    try {
        const userDocument = await this.firestore.doc(`users/${uid}`).get();
        let doc = userDocument.data();
        console.log(`firebase: fetched user document: ${JSON.stringify(doc)}`);
        let data = doc.data;
        if(data) {
          data = Base64.decode(data);
        } else {
          data = '';
        }
        return data;
    } catch (error) {
        console.error("Error fetching user document", error);
        return '';
    }
  }

  public async createUser () {
    const uid = this.getUid();
    if (!uid) {
      console.error("Error creating user document - no user");
      return;
    }
    const userRef = this.firestore.doc(`users/${uid}`);
    const snapshot = await userRef.get();
    if (!snapshot.exists) {
      console.log(`firebase: snapshot does not exist!`)
      try {
        await userRef.set({ data: '' });
      } catch (error) {
        console.error("Error creating user document", error);
      }
    } else {
      console.log(`firebase: snapshot exists!`)
    }
    return this.getUserDocument();
  }
}