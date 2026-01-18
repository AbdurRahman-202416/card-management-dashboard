import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroService } from '../../services/hero.service';
import { Hero } from '../../models/hero.model';

import { MatPaginatorModule } from '@angular/material/paginator';
@Component({
  selector: 'app-heroes-page',
  imports: [RouterLink, MatPaginatorModule],
  templateUrl: './heroes-page.html',
  styleUrl: './heroes-page.scss',
})
export class HeroesPage implements OnInit {
  heroes: Hero[] = [];
  total = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 100];

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService
      .getHeroesWithPagination(this.pageIndex + 1, this.pageSize)
      .subscribe((res) => {
        this.heroes = res.body || [];
        this.total = Number(res.headers.get('X-Total-Count'));
      });
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getHeroes();
  }
}
