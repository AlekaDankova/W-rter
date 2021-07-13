import { Component } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { Router } from '@angular/router';
import { SprachenService } from 'src/app/services/sprachen.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public name;
  public games = [];
  private sprachenAlert = JSON.parse(JSON.stringify(this.sprachen.spracheArray));

  constructor(
    public speechRecognition: SpeechRecognition,
    private router: Router,
    public sprachen: SprachenService
  ) {
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        if (!hasPermission) {
          this.speechRecognition.requestPermission()
            .then(
              () => alert(this.sprachenAlert.HOME.ALERT.SPEECHPERMISSION_OK),
              () => alert(this.sprachenAlert.HOME.ALERT.SPEECHPERMISSION_ERR)
            )
        }
      });
  }

  ionViewWillEnter(){
    this.update();
   }

  update(){
    this.games = [];
    for(let i = 0; i < window.localStorage.length; i++){
      if(window.localStorage.key(i) != "gameName" && window.localStorage.key(i) != "sprache")
        this.games.push(window.localStorage.key(i));
    }
  }

  start() {
    if (this.name == undefined) {
      alert(this.sprachenAlert.HOME.ALERT.NAME_ERR);
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

}
