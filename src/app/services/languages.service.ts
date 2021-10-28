import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {

  public languagesArray = [];
  public language = window.localStorage.getItem('language');

  constructor() { 
    if(this.language == null) this.language = "de";
  }

  public getLanguages(){
    fetch('./assets/languages/' + this.language + '.json').then(res => res.json())
    .then(json => {
      this.languagesArray = json;
      localStorage.setItem('language', this.language);
    });
  }
}
