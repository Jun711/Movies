import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownListComponent } from '../../components/drop-down-list/drop-down-list.component';

import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SelectedDirective } from '../../directives/selected.directive';

import { MovieService } from '../../services/movie.service';
import { MoviesComponent } from './movies.component';

const routes: Routes = [
  {
    path: '',
    component: MoviesComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule
  ],
  providers: [
    MovieService
  ],
  declarations: [
    DropDownListComponent,
    MoviesComponent,
    SelectedDirective
  ]
})

export class MoviesModule {}

