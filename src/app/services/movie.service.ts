import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { catchError, map, mergeMap, retry } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { range } from 'rxjs/observable/range';
import { Movie } from '../models/movie.model';
import { Observable } from 'rxjs/Observable';
import { movieApiKey } from '../../assets/constants.private';
import { ListItem } from '../models/list-item.model';

interface MovieDbResponse {
  page: number;
  total_results: number;
  total_pages: number;
  results: Movie[];
}

@Injectable()
export class MovieService {

  private apiUrl: string = `https://api.themoviedb.org/3/movie/popular?api_key=${movieApiKey}&language=en-US`;

  constructor(private http: HttpClient) {}

  getPopularMovies(total: number = 5, region: string = 'CA'): Observable<Movie[]> {
    const url = `${this.apiUrl}&region=${region}`;

    return range(1, total).pipe(
      mergeMap(page => {
        return this.http.get<MovieDbResponse>(`${url}&page=${page}`)
          .pipe(
            map(res => res.results),
            retry(3), // retry a failed request up to 3 times
            catchError(this.handleError) // then handle the error
          );
      }),
    );
  }

  getPopularMovieTitles(total: number = 5, region: string = 'CA'): Observable<ListItem[]> {
    return this.getPopularMovies(total, region)
      .map(movies => {
        return movies.map(movie => {
          return { 'id': String(movie.id), 'data': movie.title };
        });
      });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  };
}
