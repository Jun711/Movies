import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Observable } from 'rxjs/Rx';
import { ListItem } from '../../models/list-item.model';

@Component({
  selector: 'movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {
  public listItems: Observable<ListItem[]>;
  public popularMovies: Observable<ListItem[]>;
  public selectedItem: ListItem = null;
  public moviePosterPath: string;
  public defaultPosterPath: string;
  public movies: ListItem[];
  public dropDownListTitle: string;
  public popularMovieTitle: string;

  constructor(private movieService: MovieService) {
  }

  ngOnInit() {
    this.defaultPosterPath = '/q0R4crx2SehcEEQEkYObktdeFy.jpg';
    this.moviePosterPath = this.defaultPosterPath;
    this.dropDownListTitle = 'DropDownList';
    this.popularMovieTitle = 'Popular Movies from The Movie Database sorted by vote average';
    this.listItems = this.movieService.getPopularMovieTitles();
    this.popularMovies = this.movieService.getPopularMovies(10)
      .map(movies => {
        return movies.map(movie => {
          return {
            id: String(movie.id),
            data: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
          };
        }).sort((prevMovie, nextMovie) => {
          return prevMovie.vote_average > nextMovie.vote_average ? -1 : 1;
        });
      });
  }

  updateImage(event) {
    this.moviePosterPath = event.poster_path;
  }
}
