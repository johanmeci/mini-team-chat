import React from 'react';
import { formatRelative } from 'date-fns';
import { TrashOutline } from 'react-ionicons';

//Components
import Button from './Button';

const Message = ({
  id = null,
  createdAt = null,
  text = '',
  displayName = '',
  email = '',
  photoURL = '',
  gEmail = '',
  db = null
}) => {

  const deleteMessage = docID => {

    if(db) {
      db.collection('messages').doc(docID).delete().then(() => {
          console.log('Document deleted');
      }).catch((error) => {
          console.error("Error removing document: ", error);
      });
    } 
    
  }

  let classMessage = '';

  if(gEmail === email) {
    classMessage = 'myMessage';
  }

  return (
    <>
      
      <div className={"divMessage "+classMessage}>

        {photoURL ? (
          <img src={photoURL} alt="Avatar" width={45} height={45} />
        ) : null}

        <div className="divTxt">

          {displayName ? <span className="spanName">{displayName}</span> : null}
          <span className="spanMessage">{text}</span>

        </div>
        {createdAt?.seconds ? (
            <span className="spanTime">
              {formatRelative(new Date(createdAt.seconds * 1000), new Date())}
            </span>
        ) : null}
        {(gEmail === email) ? (
          <Button onClick={() => deleteMessage(id)}>
            <TrashOutline
              color={'#fff'}
              title='Eliminar'
              height="15px"
              width="15px"
            />
          </Button>
        ) : null}
      </div>
    </>
  )
};

export default Message;