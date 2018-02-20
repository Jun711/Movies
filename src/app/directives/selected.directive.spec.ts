import { Component } from '@angular/core';
import { SelectedDirective } from './selected.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';

@Component({
  selector: 'container',
  template: `
    <div [selected]='selected'></div>`,
})
class Container {
  selected: boolean;

  updateSelected(value) {
    this.selected = value;
  }
}

fdescribe('Directive: selected', () => {
  let fixture: ComponentFixture<Container>;
  let container: Container;
  let element: HTMLElement;
  let selectedDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Container, SelectedDirective],
    });

    fixture = TestBed.createComponent(Container);
    container = fixture.componentInstance; // to access properties and methods
    element = fixture.nativeElement;       // to access DOM element
    selectedDirective = new SelectedDirective(fixture);
  });

  it('should create an instance', () => {
    expect(selectedDirective).toBeTruthy();
  });

  it('should update Selected', () => {
    container.updateSelected(true);
    expect(selectedDirective).toBeTruthy();
  });
});
