import { Component, OnInit } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  public gameName = window.localStorage.getItem('gameName');
  public woerter = JSON.parse(window.localStorage.getItem(this.gameName));

  constructor(
    public speechRecognition: SpeechRecognition,
    public alertController: AlertController
  ) { }

  ngOnInit() { }

  addWord(){
    if(this.woerter.length == 0) this.nextWord("Wählen Sie ein beliebiges Wort...", "");
    else this.nextWord("Das nächste Wort mit dem Buchstaben: ", this.woerter[this.woerter.length - 1][this.woerter[this.woerter.length - 1].length - 1]);
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
      header: 'Folgende Wörter wurden erkannt:',
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
              this.nextWord("Das nächste Wort mit dem Buchstaben: ", bukva);
            } else this.nextWord("Ein solches Wort existiert bereits. Ein neues Wort mit dem Buchstaben: ", this.woerter[this.woerter.length - 1][this.woerter[this.woerter.length - 1].length - 1]);
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
