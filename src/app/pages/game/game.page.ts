import { Component, OnInit } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { AlertController } from '@ionic/angular';
import { SprachenService } from 'src/app/services/sprachen.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  public gameName = window.localStorage.getItem('gameName');
  public woerter = JSON.parse(window.localStorage.getItem(this.gameName));
  private sprachenAlert = JSON.parse(JSON.stringify(this.sprachen.spracheArray));

  constructor(
    public speechRecognition: SpeechRecognition,
    public alertController: AlertController,
    public sprachen: SprachenService
  ) { }

  ngOnInit() { }

  addWord(){
    if(this.woerter.length == 0) this.nextWord(this.sprachenAlert.GAME.ALERT.START, "");
    else this.nextWord(this.sprachenAlert.GAME.ALERT.NEXT, this.woerter[this.woerter.length - 1][this.woerter[this.woerter.length - 1].length - 1]);
  }

  speechWord() {
    this.speechRecognition.startListening().subscribe((speeches) => {
      let a = speeches.toString().split(",");
      this.saveWord(a);
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  async saveWord(words) {
    let inputs = [];
    let bukva = "";
    let word = [];
    for (let i = 0; i < words.length; i++) {
      let item = {
        name: words[i],
        type: 'radio',
        label: words[i],
        value: words[i],
        handler: () => {
          word = words[i];
          bukva = words[i].toString()[words[i].toString().length - 1];
        },
        checked: false
      };
      inputs.push(item);
    }
    const alert = await this.alertController.create({
      header: this.sprachenAlert.GAME.ALERT.LIST,
      inputs: inputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'Ok',
          handler: () => {
            let t = this.woerter.includes(word);
            if (!t) {
              this.woerter.push(word);
              localStorage.setItem(this.gameName, JSON.stringify(this.woerter));
              this.nextWord(this.sprachenAlert.GAME.ALERT.NEXT, bukva);
            } else this.nextWord(this.sprachenAlert.GAME.ALERT.ERROR, this.woerter[this.woerter.length - 1][this.woerter[this.woerter.length - 1].length - 1]);
          }
        }
      ]
    });
    await alert.present();
  }

  async nextWord(text, bukva) {
    const alert = await this.alertController.create({
      header: text + bukva,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'Ok',
          handler: () => {
            this.speechWord();
          }
        }
      ]
    });
    await alert.present();
  }

}
