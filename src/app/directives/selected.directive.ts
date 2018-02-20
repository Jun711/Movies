import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[selected]',
})
export class SelectedDirective {

  @Input()
  set selected(value: boolean) {
    if (value) {
      this.elementRef.nativeElement.scrollIntoViewIfNeeded(false);
      // { behavior: 'smooth', block: 'start', inline: 'nearest' }
    }
  }

  constructor(public elementRef: ElementRef) {
  }
}


