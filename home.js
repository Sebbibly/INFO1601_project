import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import{getAuth , onAuthStateChanged , signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {getFirestore, getDoc , doc} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyANCgNSYbO7VWii8ttsMayIKcPymgZxzv4",
    authDomain: "d-and-d-wiki-login.firebaseapp.com",
    projectId: "d-and-d-wiki-login",
    storageBucket: "d-and-d-wiki-login.firebasestorage.app",
    messagingSenderId: "793824660029",
    appId: "1:793824660029:web:19579976bed64f3fef3854"
  };

  const app = initializeApp(firebaseConfig);

  const auth=getAuth();
  const db=getFirestore();

  onAuthStateChanged(auth, (user)=>{
    const loggedInUserId=localStorage.getItem('loggedInUserId');
    if(loggedInUserId){
        console.log(user);
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap)=>{
            if(docSnap.exists()){
                const userData=docSnap.data();
                document.getElementById('loggedUserFName').innerText=userData.firstName;
                document.getElementById('loggedUserEmail').innerText=userData.email;
                document.getElementById('loggedUserLName').innerText=userData.lastName;

            }
            else{
                console.log("no document found matching id")
            }
        })
        .catch((error)=>{
            console.log("Error getting document");
        })
    }
    else{
        console.log("User Id not Found in Local storage")
    }
  })

  const logoutButton=document.getElementById('logout');

  logoutButton.addEventListener('click',()=>{
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(()=>{
        window.location.href='index.html';
    })
    .catch((error)=>{
        console.error('Error Signing out:', error);
    })
  })