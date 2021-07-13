import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SprachenService {

  public spracheArray = [];
  public sprache = window.localStorage.getItem('sprache');

  constructor() { 
    if(this.sprache == null) this.sprache = "ru";
  }

  public getSprache(){
    fetch('./assets/sprachen/' + this.sprache + '.json').then(res => res.json())
    .then(json => {
      this.spracheArray = json;
      localStorage.setItem('sprache', this.sprache);
    });
  }
}
