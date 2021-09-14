import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import Message from './Message';
import { PaperPlaneOutline } from 'react-ionicons'

const Channel = ({ user = null, db = null }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const { uid, displayName, email, photoURL } = user;

  useEffect(() => {

    if(db) {
      const unsubscribe = db
        .collection('messages')
        .orderBy('createdAt')
        .limit(100)
        .onSnapshot(querySnapshot => {

          //Get all document from collection - with IDs
          const data = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));

          //Update state
          setMessages(data);
        });

      //Detach listener
      return unsubscribe;
    }
      
  }, [db]);

  const handleOnChange = e => {
    setNewMessage(e.target.value);
  };

  const handleOnSubmit = e => {
    e.preventDefault();

    if(db) {
      db.collection('messages').add({
        text: newMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        displayName,
        email,
        photoURL
      })
    }
    setNewMessage('');

  }

  return (
    <>
      <div className="containerMessage">
        {messages.map(message => (
          <Message {...message} db={db} key={message.id} gEmail={email}/>
        ))}
      </div>
      <form onSubmit={handleOnSubmit}>
          <input 
            type="text"
            value={newMessage}
            onChange={handleOnChange}
            placeholder="Escribir mensaje"
          />
          <button className="btn btn-send" type="submit" disabled={!newMessage}>
            <PaperPlaneOutline
              color={'#101225'} 
              title='Enviar'
              height="25px"
              width="25px"
            />
          </button>
      </form>
    </>
  );
};

export default Channel;