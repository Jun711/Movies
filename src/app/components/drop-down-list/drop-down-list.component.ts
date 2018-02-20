import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ListItem } from '../../models/list-item.model';
import { Key } from '../../models/key.enum';
import { ToggleAction } from '../../models/toggle-action.model';

@Component({
  selector: 'drop-down-list',
  templateUrl: './drop-down-list.component.html',
  styleUrls: ['./drop-down-list.component.scss'],
})
export class DropDownListComponent implements OnInit {
  @Input() public items: Observable<ListItem[]>;
  @Input() public title: string;
  @Output() public selectEvent = new EventEmitter();
  @Output() public clearEvent = new EventEmitter();
  public listTitle: string;
  public listItems: ListItem[] = [];
  public listOpenState: boolean;
  public selectedItem: ListItem;
  public activeIndex: number;
  public countDownToScroll: number;
  public keyHoldCount: number;
  public titleClasses: object = {
    'title': true,
    'open': false,
    'no-outline': false,
  };
  public listClasses: object = {
    'list': true,
    'open': false,
  };
  public clearClasses: object = {
    'clear': true,
    'show': false,
    'open': false,
  };

  constructor() {}

  ngOnInit() {
    this.listTitle = this.title ? this.title : 'DropDownList';
    this.listOpenState = false;
    this.activeIndex = 0;
    this.countDownToScroll = 7;
    this.keyHoldCount = 0;
    this.selectedItem = null;
    this.items.subscribe(itemChunk => {
      this.listItems = [...this.listItems, ...itemChunk];
    });
  }

  handleKeyEvents(key: string) {
    if (this.listOpenState && key === Key.up) {
      if (this.activeIndex > 0)
        this.activeIndex--;
    } else if (this.listOpenState && key === Key.down) {
      if (this.activeIndex < this.listItems.length - 1)
        this.activeIndex++;
    } else if (key === Key.enter) {
      if (this.listOpenState) {
        this.selectItem(this.listItems[this.activeIndex]);
      } else {
        this.toggleDropDownList({ state: true });
      }
    } else if (key === Key.escape) {
      if (this.listOpenState) {
        this.toggleDropDownList({ state: false });
      }
    }
  }

  handleKeyUpEvent(event) {
    this.keyHoldCount = 0;
    if (event instanceof KeyboardEvent && event.isTrusted) {
      this.handleKeyEvents(event.key);
    }
  }

  handleKeyDownEvent(event) {
    if (event instanceof KeyboardEvent && event.isTrusted && (event.key === Key.up || event.key === Key.down)) {
      if (this.keyHoldCount < this.countDownToScroll) {
        this.keyHoldCount++;
      } else {
        this.handleKeyEvents(event.key);
      }
    }
  }

  listActivated() {
    this.titleClasses = { ...this.titleClasses, 'no-outline': true };
  }

  listBlur() {
    this.keyHoldCount = 0;
    this.titleClasses = { ...this.titleClasses, 'no-outline': false };
    this.toggleDropDownList({ state: false });
  }

  deselectItem() {
    if (this.selectedItem) {
      this.title = this.listTitle;
      this.selectedItem = null;
      this.clearEvent.emit();
      this.clearClasses = { ...this.clearClasses, 'show': false };
    }
  }

  selectItem(item: ListItem) {
    this.selectEvent.emit(item);
    this.title = `${this.listTitle}: ${item.data}`;
    this.selectedItem = item;
    this.clearClasses = { ...this.clearClasses, 'show': true };
    this.toggleDropDownList({ state: false });
  }

  toggleDropDownList(action?: ToggleAction) {
    this.listOpenState = action ? action.state : !this.listOpenState;
    this.titleClasses = { ...this.titleClasses, 'open': this.listOpenState };
    this.listClasses = { ...this.listClasses, 'open': this.listOpenState };
    this.clearClasses = { ...this.clearClasses, 'open': this.listOpenState };
    if (!this.listOpenState) {
      this.keyHoldCount = 0;
    }
  }
}
