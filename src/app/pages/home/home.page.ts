import { Component } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { Router } from '@angular/router';
import { LanguagesService } from 'src/app/services/languages.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public name;
  public games = [];
  private languagesAlert = JSON.parse(JSON.stringify(this.languages.languagesArray));

  constructor(
    public speechRecognition: SpeechRecognition,
    private router: Router,
    public languages: LanguagesService,
    public alertController: AlertController
  ) {
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        if (!hasPermission) {
          this.speechRecognition.requestPermission()
            .then(
              async () => {
                const alert = await this.alertController.create({
                  header: this.languagesAlert.HOME.ALERT.SPEECHPERMISSION_OK,
                  buttons: [
                    {
                      text: 'Ok',
                      role: 'cancel'
                    }
                  ]
                });
                await alert.present();
              },
              async () => {
                const alert = await this.alertController.create({
                  header: this.languagesAlert.HOME.ALERT.SPEECHPERMISSION_ERR,
                  buttons: [
                    {
                      text: 'Cancel',
                      role: 'cancel'
                    }
                  ]
                });
                await alert.present();
              }
            )
        }
      });
  }

  ionViewWillEnter() {
    this.update();
  }

  update() {
    this.games = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      if (window.localStorage.key(i) != "gameName" && window.localStorage.key(i) != "language")
        this.games.push(window.localStorage.key(i));
    }
  }

  async startNewG() {
    if (this.name == undefined) {
      const alert = await this.alertController.create({
        header: this.languagesAlert.HOME.ALERT.NAME_ERR,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      });
      await alert.present();
    } else {
      localStorage.setItem('gameName', this.name);
      localStorage.setItem(this.name, JSON.stringify([]));
      this.router.navigate(['/game']);
      this.name = "";
    }
  }

  startG(item) {
    localStorage.setItem('gameName', item);
    this.router.navigate(['/game']);
  }

  async deleteG(item) {
    const alert = await this.alertController.create({
      header: this.languagesAlert.HOME.ALERT.DELETE_GAME,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Ok',
          handler: () => {
            window.localStorage.removeItem(item);
            this.update();
          }
        }
      ]
    });
    await alert.present();
  }

  async getCountWord(gameName) {
    let words = JSON.parse(window.localStorage.getItem(gameName));
    const alert = await this.alertController.create({
      header: this.languagesAlert.HOME.ALERT.WORD_COUNT + words.length,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

}
