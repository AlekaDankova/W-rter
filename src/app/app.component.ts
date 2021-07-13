import { Component } from '@angular/core';
import { SprachenService } from './services/sprachen.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private sprachen: SprachenService
  ) {
    this.sprachen.getSprache();
  }
}
