import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { movies } from '../../mockData/movies';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { SelectedDirective } from '../../directives/selected.directive';

import { DropDownListComponent } from './drop-down-list.component';
import { Key } from '../../models/key.enum';

const listItems = movies;
const popularMovieTitle = 'Popular Movies';
const defaultTitle = 'DropDownList';
const firstListItem = { id: '1', data: 'Avengers' };
const secondListItem = { id: '2', data: 'Avengers2' };
const arrowDownKeyUpEvent = new KeyboardEvent('keyup', { key: 'ArrowDown' });
const arrowUpKeyUpEvent = new KeyboardEvent('keyup', { key: 'ArrowUp' });
const arrowDownKeyDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
const arrowUpKeyDownEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
const enterEvent = new KeyboardEvent('keyup', { key: 'Enter' });
const escapeEvent = new KeyboardEvent('keyup', { key: 'Escape' });

fdescribe('DropDownListComponent Expected Behaviors', () => {
  let dropDownList: DropDownListComponent;
  let fixture: ComponentFixture<DropDownListComponent>;
  let dropDownListElement: HTMLElement;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropDownListComponent, SelectedDirective],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropDownListComponent);
    dropDownList = fixture.componentInstance;
    dropDownListElement = fixture.nativeElement;
    de = fixture.debugElement.query(By.css('div'));
    el = de.nativeElement;

    dropDownList.title = popularMovieTitle;
    dropDownList.items = Observable.of(listItems);
    fixture.detectChanges();
  });

  it('should create dropDownList', () => {
    expect(dropDownList).toBeTruthy();
  });

  it('should display title \'Popular Movies\'', () => {
    const titleSpan = fixture.debugElement.nativeElement.querySelector('span');
    expect(titleSpan.textContent).toContain(popularMovieTitle);
  });

  it('should display default title \'DropDownList\' when no title', () => {
    const localFixture = TestBed.createComponent(DropDownListComponent);
    const localComponent = localFixture.componentInstance;
    localComponent.title = undefined;
    localComponent.items = Observable.of(listItems);
    localFixture.detectChanges();
    const titleSpan = localFixture.nativeElement.querySelector('span');
    expect(titleSpan.textContent).toContain(defaultTitle);
  });

  it('should get ListItems from input', () => {
    expect(dropDownList.listItems.length).toEqual(listItems.length);
    expect(dropDownList.listItems).toEqual(listItems);
  });

  it('should emit select item item when clicked', async(() => {
    const li = dropDownListElement.querySelector('li');

    dropDownList.selectEvent.subscribe(item => {
      expect(item).toEqual(firstListItem);
    });

    li.click();
  }));

  it('should emit select item item when clicked (fakeAsync/tick) ', fakeAsync(() => {
    const li = dropDownListElement.querySelectorAll('li')[1];

    dropDownList.selectEvent.subscribe(item => {
      expect(item).toEqual(secondListItem);
    });

    li.click();
    //execute all pending asynchronous calls
    tick();
  }));

  it('click on title should open dropDownList when it is closed', () => {
    const title = dropDownListElement.querySelector('span');
    title.click();
    expect(dropDownList.listItems).toEqual(movies);
    expect(dropDownList.listOpenState).toBe(true);
    expect(dropDownList.activeIndex).toBe(0);
    expect(dropDownList.selectedItem).toEqual(null);
  });

  it('click on title should close dropDownList when it is opened', () => {
    dropDownList.listOpenState = true;
    fixture.detectChanges();
    const title = dropDownListElement.querySelector('span');
    title.click();
    expect(dropDownList.listOpenState).toBe(false);
    expect(dropDownList.activeIndex).toBe(0);
    expect(dropDownList.selectedItem).toEqual(null);
  });

  it('clear button doesn\`t appear when there is no selectedItem', () => {
    const clear = dropDownListElement.querySelectorAll('span')[1];
    expect(dropDownList.selectedItem).toEqual(null);
    expect(clear.classList).toContain('clear');
    expect(clear.classList).not.toContain('show');
  });

  it('clear button appears when there is a selectedItem', () => {
    dropDownList.selectItem(firstListItem);
    fixture.detectChanges();
    const clear = dropDownListElement.querySelectorAll('span')[1];
    expect(dropDownList.selectedItem).toEqual(firstListItem);
    expect(clear.classList).toContain('clear');
    expect(clear.classList).toContain('show');
  });

  it('click on clear should clear selected when an item is selected', () => {
    dropDownList.selectedItem = firstListItem;
    fixture.detectChanges();
    expect(dropDownList.selectedItem).toEqual(firstListItem);
    const clear = dropDownListElement.querySelectorAll('span')[1];
    clear.click();
    expect(dropDownList.selectedItem).toEqual(null);
    expect(dropDownList.title).toEqual(popularMovieTitle);
  });
});

fdescribe('DropDownListComponent component functions and properties', () => {
  let dropDownList: DropDownListComponent;
  let fixture: ComponentFixture<DropDownListComponent>;
  let dropDownListElement: HTMLElement;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropDownListComponent, SelectedDirective],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropDownListComponent);
    dropDownList = fixture.componentInstance;
    dropDownListElement = fixture.nativeElement;
    de = fixture.debugElement.query(By.css('div'));
    el = de.nativeElement;

    dropDownList.title = popularMovieTitle;
    dropDownList.items = Observable.of(listItems);

    fixture.detectChanges();
  });

  it('should contains listItems', () => {
    expect(dropDownList.listItems).toEqual(movies);
  });

  it('should contains these initial values', () => {
    expect(dropDownList.listItems).toEqual(movies);
    expect(dropDownList.listOpenState).toBeFalsy();
    expect(dropDownList.activeIndex).toBe(0);
    expect(dropDownList.keyHoldCount).toBe(0);
    expect(dropDownList.countDownToScroll).toBe(7);
    expect(dropDownList.selectedItem).toBe(null);
  });

  it('fn listActivated should add no-outline to titleClasses', () => {
    dropDownList.listActivated();
    fixture.detectChanges();

    const titleSpan = fixture.nativeElement.querySelector('span');

    expect(titleSpan.classList).toContain('no-outline');
    expect(dropDownList.keyHoldCount).toBe(0);
  });

  it('fn listBlur should 1) reset keyHoldCount, 2) remove no-outline to titleClasses', () => {
    dropDownList.listBlur();
    fixture.detectChanges();

    const titleSpan = fixture.nativeElement.querySelector('span');

    expect(titleSpan.classList).not.toContain('no-outline');
    expect(dropDownList.keyHoldCount).toBe(0);
  });

  it('fn deselectItem should 1) reset title, 2) clear selectedItem, 3) remove show css class', () => {
    dropDownList.selectedItem = firstListItem;
    expect(dropDownList.selectedItem).toEqual(firstListItem);
    dropDownList.deselectItem();
    fixture.detectChanges();

    const titleSpan = fixture.nativeElement.querySelector('span');
    const clear = dropDownListElement.querySelectorAll('span')[1];

    expect(titleSpan.textContent).toBe(popularMovieTitle);
    expect(dropDownList.title).toEqual(popularMovieTitle);
    expect(dropDownList.selectedItem).toEqual(null);
    expect(clear.classList).not.toContain('show');
  });

  it('fn selectItem should 1)select item, 2)update title, 3)display clear and 4)close list', () => {
    dropDownList.selectItem(secondListItem);
    fixture.detectChanges();

    const titleSpan = fixture.nativeElement.querySelector('span');
    const clear = dropDownListElement.querySelectorAll('span')[1];

    expect(titleSpan.textContent).toBe(`${popularMovieTitle}: ${secondListItem.data}`);
    expect(dropDownList.selectedItem).toEqual(secondListItem);
    expect(clear.classList).toContain('show');
    expect(dropDownList.listOpenState).toBe(false);
  });

  it('fn selectItem should display default title \'DropDownList\' with selected item', () => {
    const localFixture = TestBed.createComponent(DropDownListComponent);
    const localComponent = localFixture.componentInstance;
    const localElement = localFixture.nativeElement;
    localComponent.title = undefined;
    localComponent.items = Observable.of(listItems);
    localFixture.detectChanges();
    const localTitleSpan = localElement.querySelector('span');
    expect(localTitleSpan.textContent).toContain(defaultTitle);

    localComponent.selectItem(secondListItem);
    localFixture.detectChanges();

    const localClear = localElement.querySelectorAll('span')[1];

    expect(localTitleSpan.textContent).toBe(`${defaultTitle}: ${secondListItem.data}`);
    expect(localComponent.selectedItem).toEqual(secondListItem);
    expect(localClear.classList).toContain('show');
    expect(localComponent.listOpenState).toBe(false);
  });

  it('fn toggleDropDownList handle ToggleAction {state: true}', () => {
    expect(dropDownList.listOpenState).toBe(false);
    dropDownList.toggleDropDownList({ state: true });
    fixture.detectChanges();

    const titleSpan = fixture.nativeElement.querySelector('span');
    const ul = fixture.nativeElement.querySelector('ul');
    const clear = dropDownListElement.querySelectorAll('span')[1];

    expect(dropDownList.listOpenState).toBe(true);
    expect(titleSpan.classList).toContain('open');
    expect(clear.classList).toContain('open');
    expect(ul.classList).toContain('open');
  });

  it('fn toggleDropDownList handle ToggleAction {state: false}', () => {
    expect(dropDownList.listOpenState).toBe(false);
    dropDownList.listOpenState = true;
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(true);
    dropDownList.toggleDropDownList({ state: false });
    fixture.detectChanges();

    const titleSpan = fixture.nativeElement.querySelector('span');
    const ul = fixture.nativeElement.querySelector('ul');
    const clear = dropDownListElement.querySelectorAll('span')[1];

    expect(dropDownList.listOpenState).toBe(false);
    expect(dropDownList.keyHoldCount).toBe(0);
    expect(titleSpan.classList).not.toContain('open');
    expect(clear.classList).not.toContain('open');
    expect(ul.classList).not.toContain('open');
  });

  it('fn toggleDropDownList should 1)open list, 2)update title css classes, ' +
    '3)update list css classes and 4)update clear css classes', () => {
    expect(dropDownList.listOpenState).toBe(false);
    dropDownList.toggleDropDownList();
    fixture.detectChanges();

    const titleSpan = fixture.nativeElement.querySelector('span');
    const ul = fixture.nativeElement.querySelector('ul');
    const clear = dropDownListElement.querySelectorAll('span')[1];

    expect(dropDownList.listOpenState).toBe(true);
    expect(titleSpan.classList).toContain('open');
    expect(clear.classList).toContain('open');
    expect(ul.classList).toContain('open');
  });

  it('fn toggleDropDownList should 1)close list, 2)update title css classes, ' +
    '3)update list css classes and 4)update clear css classes and 5) reset keyHoldCount', () => {
    dropDownList.listOpenState = true;
    expect(dropDownList.listOpenState).toBe(true);
    dropDownList.toggleDropDownList();
    fixture.detectChanges();

    const titleSpan = fixture.nativeElement.querySelector('span');
    const ul = fixture.nativeElement.querySelector('ul');
    const clear = dropDownListElement.querySelectorAll('span')[1];

    expect(dropDownList.listOpenState).toBe(false);
    expect(dropDownList.keyHoldCount).toBe(0);
    expect(titleSpan.classList).not.toContain('open');
    expect(clear.classList).not.toContain('open');
    expect(ul.classList).not.toContain('open');
  });
});

fdescribe('DropDownListComponent component keyboard events', () => {
  let dropDownList: DropDownListComponent;
  let fixture: ComponentFixture<DropDownListComponent>;
  let dropDownListElement: HTMLElement;
  let de: DebugElement;
  let el: HTMLElement;

  function mockhandleKeyUpEvent(event) {
    this.keyHoldCount = 0;
    if (event.isTrusted) {
      this.handleKeyEvents(event.key);
    }
  }

  function mockhandleKeyDownEvent(event) {
    if (event.isTrusted && (event.key === Key.up || event.key === Key.down)) {
      if (this.keyHoldCount < this.countDownToScroll) {
        this.keyHoldCount++;
      } else {
        this.handleKeyEvents(event.key);
      }
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropDownListComponent, SelectedDirective],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropDownListComponent);
    dropDownList = fixture.componentInstance;
    dropDownListElement = fixture.nativeElement;
    de = fixture.debugElement.query(By.css('div'));
    el = de.nativeElement;

    dropDownList.title = popularMovieTitle;
    dropDownList.items = Observable.of(listItems);
    dropDownList.handleKeyUpEvent = mockhandleKeyUpEvent;
    dropDownList.handleKeyDownEvent = mockhandleKeyDownEvent;

    fixture.detectChanges();
  });

  it('fn handleKeyEvents ArrowDown shouldn\'t increase activeIndex if list close', () => {
    expect(dropDownList.activeIndex).toBe(0);
    expect(dropDownList.listOpenState).toBe(false);
    dropDownList.handleKeyEvents(arrowDownKeyUpEvent.key);
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(false);
    expect(dropDownList.activeIndex).toBe(0);
  });

  it('fn handleKeyEvents ArrowUp shouldn\'t decrease activeIndex if list close', () => {
    expect(dropDownList.listOpenState).toBe(false);
    expect(dropDownList.activeIndex).toBe(0);
    dropDownList.activeIndex = 3;
    fixture.detectChanges();

    expect(dropDownList.activeIndex).toBe(3);
    dropDownList.handleKeyEvents(arrowUpKeyUpEvent.key);
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(false);
    expect(dropDownList.activeIndex).toBe(3);
  });

  it('fn handleKeyEvents ArrowDownKeyUp should increase activeIndex if list open', () => {
    expect(dropDownList.activeIndex).toBe(0);
    dropDownList.listOpenState = true;
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(true);
    dropDownList.handleKeyEvents(arrowDownKeyUpEvent.key);
    fixture.detectChanges();

    expect(dropDownList.activeIndex).toBe(1);
    expect(dropDownList.listOpenState).toBe(true);
  });

  it('fn handleKeyEvents ArrowDownKeyDown should increase activeIndex if list open', () => {
    expect(dropDownList.activeIndex).toBe(0);
    dropDownList.listOpenState = true;
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(true);
    dropDownList.handleKeyEvents(arrowDownKeyDownEvent.key);
    fixture.detectChanges();

    expect(dropDownList.activeIndex).toBe(1);
    expect(dropDownList.listOpenState).toBe(true);
  });

  it('fn handleKeyEvents ArrowDown shouldn\'t increase activeIndex beyond listItems size - 1', () => {
    dropDownList.activeIndex = listItems.length - 1;
    dropDownList.listOpenState = true;
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(true);
    expect(dropDownList.activeIndex).toBe(listItems.length - 1);
    dropDownList.handleKeyEvents(arrowDownKeyUpEvent.key);
    fixture.detectChanges();

    expect(dropDownList.activeIndex).toBe(listItems.length - 1);
    expect(dropDownList.listOpenState).toBe(true);

    dropDownList.handleKeyEvents(arrowUpKeyUpEvent.key);
    fixture.detectChanges();

    expect(dropDownList.activeIndex).toBe(listItems.length - 2);
  });

  it('fn handleKeyEvents ArrowUpKeyUp should decrease activeIndex if list open', () => {
    dropDownList.toggleDropDownList({ state: true });
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(true);
    dropDownList.activeIndex = 3;
    dropDownList.handleKeyEvents(arrowUpKeyUpEvent.key);
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(true);
    expect(dropDownList.activeIndex).toBe(2);
  });

  it('fn handleKeyEvents ArrowUpKeyDown should decrease activeIndex if list open', () => {
    dropDownList.toggleDropDownList({ state: true });
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(true);
    dropDownList.activeIndex = 4;
    dropDownList.handleKeyEvents(arrowUpKeyDownEvent.key);
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(true);
    expect(dropDownList.activeIndex).toBe(3);
  });

  it('fn handleKeyEvents ArrowUp shouldn\'t decrease activeIndex below zero', () => {
    dropDownList.toggleDropDownList({ state: true });
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(true);
    expect(dropDownList.activeIndex).toBe(0);
    dropDownList.handleKeyEvents(arrowUpKeyUpEvent.key);
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(true);
    expect(dropDownList.activeIndex).toBe(0);
  });

  it('fn handleKeyEvents Enter should open list if it is close', () => {
    expect(dropDownList.activeIndex).toBe(0);
    expect(dropDownList.listOpenState).toBe(false);
    dropDownList.handleKeyEvents(enterEvent.key);
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(true);
    dropDownList.handleKeyEvents(arrowDownKeyUpEvent.key);
    fixture.detectChanges();

    expect(dropDownList.activeIndex).toBe(1);
    expect(dropDownList.listOpenState).toBe(true);
  });

  it('fn handleKeyEvents Enter should selectItem if it is open and should close it after', () => {
    expect(dropDownList.activeIndex).toBe(0);
    expect(dropDownList.listOpenState).toBe(false);
    expect(dropDownList.selectedItem).toBe(null);
    dropDownList.listOpenState = true;
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(true);
    expect(dropDownList.listItems).toEqual(listItems);
    dropDownList.handleKeyEvents(enterEvent.key);
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(false);
    expect(dropDownList.selectedItem).toEqual(firstListItem);
  });

  it('fn handleKeyEvents Esc should close the list if it is open', () => {
    expect(dropDownList.listOpenState).toBe(false);
    expect(dropDownList.selectedItem).toBe(null);
    dropDownList.listOpenState = true;
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(true);
    dropDownList.handleKeyEvents(escapeEvent.key);
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(false);
    expect(dropDownList.selectedItem).toEqual(null);
  });

  it('fn handleKeyEvents Esc should deselect the list if it is close', () => {
    expect(dropDownList.listOpenState).toBe(false);
    expect(dropDownList.selectedItem).toBe(null);
    dropDownList.selectedItem = firstListItem;
    fixture.detectChanges();

    expect(dropDownList.selectedItem).toEqual(firstListItem);
    expect(dropDownList.listOpenState).toBe(false);
    dropDownList.handleKeyEvents(escapeEvent.key);
    fixture.detectChanges();

    const titleSpan = fixture.nativeElement.querySelector('span');
    const clear = dropDownListElement.querySelectorAll('span')[1];

    expect(titleSpan.textContent).toBe(popularMovieTitle);
    expect(dropDownList.title).toEqual(popularMovieTitle);
    expect(dropDownList.selectedItem).toEqual(null);
    expect(clear.classList).not.toContain('show');
    expect(dropDownList.listOpenState).toBe(false);
  });

  it('fn handleKeyUpEvent should reset keyHoldCount', () => {
    expect(dropDownList.keyHoldCount).toBe(0);
    dropDownList.keyHoldCount = 6;
    fixture.detectChanges();

    expect(dropDownList.keyHoldCount).toBe(6);
    dropDownList.handleKeyUpEvent(arrowDownKeyUpEvent);
    fixture.detectChanges();

    expect(dropDownList.keyHoldCount).toBe(0);
  });

  it('fn handleKeyDownEvent ArrowDownKeyDown should update activeIndex until KeyUp or listItem\'s length', () => {
    const mockArrowDownKeyDownEvent = { key: 'ArrowDown', isTrusted: true };

    expect(dropDownList.listOpenState).toBe(false);
    expect(dropDownList.activeIndex).toBe(0);
    dropDownList.listOpenState = true;
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(true);
    const keyDownHoldCount = dropDownList.countDownToScroll + 3;
    // able to scroll by holding down arrowDown
    for (let i = 0; i < keyDownHoldCount; i++) {
      dropDownList.handleKeyDownEvent(mockArrowDownKeyDownEvent);
    }
    fixture.detectChanges();

    expect(dropDownList.activeIndex).toBe(3);

    const keyDownLongHold = dropDownList.countDownToScroll + 100;
    for (let i = 0; i < keyDownLongHold; i++) {
      dropDownList.handleKeyDownEvent(mockArrowDownKeyDownEvent);
    }
    fixture.detectChanges();

    expect(dropDownList.activeIndex).toBe(dropDownList.listItems.length - 1);
  });

  it('fn handleKeyDownEvent ArrowUpKeyDown should update activeIndex until KeyUp or 0', () => {
    const mockArrowUpKeyDownEvent = { key: 'ArrowUp', isTrusted: true };

    expect(dropDownList.listOpenState).toBe(false);
    expect(dropDownList.activeIndex).toBe(0);
    dropDownList.activeIndex = dropDownList.listItems.length - 1;
    dropDownList.listOpenState = true;
    fixture.detectChanges();

    expect(dropDownList.listOpenState).toBe(true);
    expect(dropDownList.activeIndex).toBe(dropDownList.listItems.length - 1);
    const keyDownHoldCount = dropDownList.countDownToScroll + 3;
    // able to scroll by holding down arrowDown
    for (let i = 0; i < keyDownHoldCount; i++) {
      dropDownList.handleKeyDownEvent(mockArrowUpKeyDownEvent);
    }
    fixture.detectChanges();

    expect(dropDownList.activeIndex).toBe(dropDownList.listItems.length - 4);

    const keyDownLongHold = dropDownList.countDownToScroll + 100;
    for (let i = 0; i < keyDownLongHold; i++) {
      dropDownList.handleKeyDownEvent(mockArrowUpKeyDownEvent);
    }
    fixture.detectChanges();

    expect(dropDownList.activeIndex).toBe(0);
  });
});
