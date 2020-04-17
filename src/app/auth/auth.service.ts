import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private eventAuthError = new BehaviorSubject<String>("");
  eventAuthError$ = this.eventAuthError.asObservable();

  newUser: any ; 
 
 
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router ) { }

  getUserState() {
    return this.afAuth.authState;
  }

  login( email: string , password: string){
    this.afAuth.signInWithEmailAndPassword(email,password)
    .catch(error => {
      this.eventAuthError.next(error);
    })
    .then(userCredential => {
      if(userCredential) {
        this.router.navigate(['/home']);
      }
    })
  }

    createUser(user){
      //.auth
      this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then( userCredential => {
           this.newUser = user
           console.log(userCredential);
           userCredential.user.updateProfile({
             displayName: user.firestore + ' ' + user.lastName
           });
           
           this.insertUserData(userCredential)
          .then(() => {
            this.router.navigate(['/home']);
          });
          this.router.navigate(['/home']);
      })
      .catch( error => {
        console.log(error);
        this.eventAuthError.next(error);

      })
    }

 insertUserData( userCredential: firebase.auth.UserCredential){
  console.log("rrrrrrrrrrrr");
   return this.db.collection('users').doc(userCredential.user.uid).set({
     email: this.newUser.email,
     firstname: this.newUser.firstName,
     lastname: this.newUser.lastName,
     role: 'network user'
   })

 }

 logout() {
   return this.afAuth.signOut();
 }

}
