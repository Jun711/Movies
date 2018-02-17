
import { Component, OnInit } from '@angular/core';
import { movies } from '../../mockData/movies';

@Component({
  selector: 'drop-down-list',
  templateUrl: './drop-down-list.component.html',
  styleUrls: ['./drop-down-list.component.scss']
})
export class DropDownListComponent implements OnInit {

  movies: Movie[];

  constructor() { }

  ngOnInit() {
    this.movies = movies;
  }

  clearSelected(evt) {
    console.log(`clearSelected ${evt}`);
    return false;
  }

}

interface Movie {
  title: string
}
