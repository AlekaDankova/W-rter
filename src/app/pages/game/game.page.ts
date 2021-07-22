import { Component, OnInit } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { AlertController } from '@ionic/angular';
import { LanguagesService } from 'src/app/services/languages.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  public gameName = window.localStorage.getItem('gameName');
  public words = JSON.parse(window.localStorage.getItem(this.gameName));
  private languagesAlert = JSON.parse(JSON.stringify(this.languages.languagesArray));
  private last_letter = "";

  constructor(
    public speechRecognition: SpeechRecognition,
    public alertController: AlertController,
    public languages: LanguagesService
  ) { }

  ngOnInit() { }

  addWord(){
    if(this.words.length == 0) this.nextWord(this.languagesAlert.GAME.ALERT.START, "");
    else {
      this.last_letter = this.words[this.words.length - 1][this.words[this.words.length - 1].length - 1];
      this.nextWord(this.languagesAlert.GAME.ALERT.NEXT, this.last_letter);
    }
  }

  speechWord() {
    this.speechRecognition.startListening().subscribe((speeches) => {
      let array = speeches.toString().split(",");
      this.saveWord(array);
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  async saveWord(wordsArray) {
    let inputs = [];
    let letter = "";
    let word = [];
    for (let i = 0; i < wordsArray.length; i++) {
      let item = {
        name: wordsArray[i].toLowerCase(),
        type: 'radio',
        label: wordsArray[i].toLowerCase(),
        value: wordsArray[i].toLowerCase(),
        handler: () => {
          word = wordsArray[i].toLowerCase();
          letter = word[word.length - 1];
        },
        checked: false
      };
      inputs.push(item);
    }
    const alert = await this.alertController.create({
      header: this.languagesAlert.GAME.ALERT.LIST,
      inputs: inputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'Ok',
          handler: () => {
            let t = this.words.includes(word);
            if (!t) {
              if(this.words.length != 0){
                if(word[0] == this.last_letter){
                  this.words.push(word);
                  this.last_letter = word[word.length - 1];
                  localStorage.setItem(this.gameName, JSON.stringify(this.words));
                  this.nextWord(this.languagesAlert.GAME.ALERT.NEXT, letter);
                } else this.nextWord(this.languagesAlert.GAME.ALERT.ERROR_BUKVA, this.last_letter);
              } else {
                this.words.push(word);
                this.last_letter = word[word.length - 1];
                localStorage.setItem(this.gameName, JSON.stringify(this.words));
                this.nextWord(this.languagesAlert.GAME.ALERT.NEXT, letter);
              }
            } else this.nextWord(this.languagesAlert.GAME.ALERT.ERROR, this.words[this.words.length - 1][this.words[this.words.length - 1].length - 1]);
          }
        }
      ]
    });
    await alert.present();
  }

  async nextWord(text, letter) {
    const alert = await this.alertController.create({
      header: text + letter,
      buttons: [ //Добавить логику изменения последней буквы: например, если она Ы или Ь
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
