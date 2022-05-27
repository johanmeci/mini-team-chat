import React, { useState, useEffect } from 'react';

//Components
import Button from './components/Button';
import Channel from './components/Channel';
import { LogOutOutline } from 'react-ionicons';
import { LogInOutline } from 'react-ionicons';

//Firebase deps
import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';

//Styles
import './scss/App.scss';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "mini-team-chat.firebaseapp.com",
  projectId: "mini-team-chat",
  storageBucket: "mini-team-chat.appspot.com",
  messagingSenderId: process.env.REACT_APP_MSG_ID,
  appId: process.env.REACT_APP_FIREBASE_API_ID
});

const auth = firebase.auth();
const db = firebase.firestore();

function App() {

  const [user, setUser] = useState(() => auth.currentUser);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }

      if(initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;

  }, []);
  
  const signInWithGoogle = async () => {

    //Objeto provider
    const provider = new firebase.auth.GoogleAuthProvider();
    
    //Se toma el lenguaje del navegador actual
    auth.useDeviceLanguage();

    //Login
    try {
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut(); 
    } catch (error) {
      console.log(error.message);
    }
  };

  if(initializing) return "Loading...";

  return (
    
    <div className="containerPrincipal">
    {user ? (
      <>
        <header>
          <span className="spanWelcome">
            Bienvenido <span className="spanUserName">{user.displayName}</span>
          </span>
          <Button onClick={signOut}>
          <LogOutOutline
            color={'#7e2020'} 
            title='Logout'
            height="20px"
            width="20px"
          />
          </Button>
        </header>
        <div className="containerBody">
          <div className="sectionLeft">
            <span className="sectionTitle">Usuarios</span>
          </div>
          <div className="sectionRight">
            <Channel user={user} db={db} />
          </div>
        </div>
      </>
    ) : (
      <div className="containerLogin">
        <h3 className="loginTitle">Login Team Chat</h3>
        <Button classBtn="btn-login" onClick={signInWithGoogle}>
          <span className="spanBtn">Google LogIn</span>
          <LogInOutline
            color={'#00000'} 
            title='Login'
            height="20px"
            width="20px"
          />
        </Button>
      </div>
    )}
    </div>
  );
}

export default App;
