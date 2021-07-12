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
  public lastWord = this.woerter[this.woerter.length - 1];

  constructor(
    public speechRecognition: SpeechRecognition,
    public alertController: AlertController
  ) { }

  ngOnInit() { }

  addWord(){
    if(this.woerter.length == 0) this.alertPromt("Выберите любое слово", "");
    else this.alertPromt("Следующее слово на букву: ", this.woerter[this.woerter.length - 1][this.woerter[this.woerter.length - 1].length - 1]);
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
          console.log(words[i] + ' selected');
          // alert(words[i]);
          word = words[i];
          bukva = words[i].toString()[words[i].toString().length - 1];
        },
        checked: false
      };
      inputs.push(item);
    }
    const alert = await this.alertController.create({
      header: 'Следующие слова были распознаны',
      inputs: inputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            let t = this.woerter.includes(word);
            if (!t) {
              this.lastWord = word;
              this.woerter.push(word);
              localStorage.setItem(this.gameName, JSON.stringify(this.woerter));
              this.alertPromt("Следующее слово на букву: ", bukva);
            } else this.alertPromt("Такое слово уже есть. Новое слово на букву: ", this.woerter[this.woerter.length - 1][this.woerter[this.woerter.length - 1].length - 1]);
          }
        }
      ]
    });
    await alert.present();
  }

  async alertPromt(text, bukva) {
    const alert = await this.alertController.create({
      header: text + bukva,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
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
