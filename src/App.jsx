import { useState ,useRef} from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import {getAuth,GoogleAuthProvider,signInWithPopup} from 'firebase/auth'
import { initializeApp} from 'firebase/app'
import 'firebase/auth'
import {collection, getFirestore} from 'firebase/firestore'
import 'firebase/firestore';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBLoeRx0tRV5fGcZrp32DhAZV70y3mqV98",
  authDomain: "game-of-thrones-e7ece.firebaseapp.com",
  projectId: "game-of-thrones-e7ece",
  storageBucket: "game-of-thrones-e7ece.appspot.com",
  messagingSenderId: "726010057987",
  appId: "1:726010057987:web:2e49b989a1487e241b4536",
  measurementId: "G-YYH8KHBDY4"
};

const app = initializeApp(firebaseConfig);


const auth =  getAuth(app);
const firestore = getFirestore(app);



function App() {


  const [user] = useAuthState(auth);
  return (
    <div className="App">
     <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  )
}

 function SignIn() {

  const signInWithGoogle = async() => {
    
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth,provider);
    const user = res.user;
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )

}



function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}



function ChatRoom() {
  const dummy = useRef();
  const messagesRef = collection(firestore,'messages');
  
  const query = messagesRef('createdAt');

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}

export default App
