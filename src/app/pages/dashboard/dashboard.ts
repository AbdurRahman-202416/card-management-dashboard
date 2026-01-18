import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { HeroService } from '../../services/hero.service';
import { Hero } from '../../models/hero.model';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink, 
    MatPaginatorModule, 
    MatAutocompleteModule, 
    MatInputModule,
    MatIconModule, 
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  heroes: Hero[] = [];
  
  // Search
  searchControl = new FormControl('');
  filteredHeroes: Observable<Hero[]> | undefined;

  total = 0;
  pageSize = 5;
  pageIndex = 0;
  itemPerPageCount: number[] = [];

  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.loadHeroes();
    
    this.filteredHeroes = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        if (!term || typeof term !== 'string') return [];
        return this.heroService.searchHeroes(term);
      })
    );
  }

  calculatePageArray() {
    // 1. Determine total number of pages (e.g., 60 / 5 = 12)
    const pageCount = Math.ceil(this.total / this.pageSize);

    // 2. Create an array of that length: [1, 2, 3, ..., 12]
    this.itemPerPageCount = Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  loadHeroes() {
    this.heroService.getHeroesWithPagination(this.pageIndex + 1, this.pageSize).subscribe((res) => {
      this.heroes = res.body || [];
      this.total = Number(res.headers.get('X-Total-Count'));
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadHeroes();
  }
}
