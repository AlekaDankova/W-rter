import { Component } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // public matches = [];
  public name;
  public games = [];

  constructor(
    public speechRecognition: SpeechRecognition,
    private router: Router
  ) {
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        if (!hasPermission) {
          this.speechRecognition.requestPermission()
            .then(
              () => console.log('Granted'),
              () => console.log('Denied')
            )
        }
      });
      // console.log(window.localStorage);
      this.update();
  }

  update(){
    this.games = [];
    for(let i = 0; i < window.localStorage.length; i++){
      if(window.localStorage.key(i) != "gameName")
        this.games.push(window.localStorage.key(i));
    }
  }

  start() {
    if (this.name == undefined) {
      alert("invalid game name");
    } else {
      localStorage.setItem('gameName', this.name);
      localStorage.setItem(this.name, JSON.stringify([]));
      this.router.navigate(['/game']);
    }
  }

  startG(item){
    localStorage.setItem('gameName', item);
    this.router.navigate(['/game']);
  }

  deleteG(item){
    window.localStorage.removeItem(item);
    this.update();
  }

  // checkPermission() {
  //   this.speechRecognition.hasPermission().then((permission) => {
  //     if (permission) {
  //       alert("Already has permission for speech recognition")
  //     }
  //     else {
  //       alert("Not permission yet")
  //     }
  //   }, (err) => {
  //     alert(JSON.stringify(err))
  //   })
  // }

  // requestPermission() {
  //   this.speechRecognition.requestPermission().then((data) => {
  //     alert(JSON.stringify(data))
  //   }, (err) => {
  //     alert(JSON.stringify(err))
  //   })
  // }

  // startListening() {
  //   this.speechRecognition.startListening().subscribe((speeches) => {
  //     this.matches = speeches
  //   }, (err) => {
  //     alert(JSON.stringify(err))
  //   })
  // }

  // stopListening() {
  //   this.speechRecognition.stopListening();
  // }

}
