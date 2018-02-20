import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title: string = 'Popcorn';
  public instruction: string = 'Click Popcorn to lazy load drop-down-list';
  public showInstruction: boolean = true;

  hideInstruction() {
    this.showInstruction = false;
  }
}
