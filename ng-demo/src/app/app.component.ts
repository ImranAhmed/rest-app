import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private unsubscribe: Subject<void> = new Subject();
  users: any[];
  isLoading = true;
  newUser = {};

  constructor(private service: DataService) {

  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    const fetch = () => {
      this.service.getUsers()
        .pipe(
          takeUntil(this.unsubscribe)
        )
        .subscribe((res: any) => {
          this.users = res.data;
          this.isLoading = false;
        });
    };
    setTimeout(fetch, 1000);
  }

  handleChange(value) {
    this.newUser = {
      id: Math.max.apply(Math, this.users.map((u) => u.id + 1)),
      email: `${value}@reqres.in`,
      first_name: value,
      last_name: 'Surname',
      avatar: 'https://source.unsplash.com/random'
    };
  }

  handleSubmit(e) {
    this.users.push(this.newUser);
    e.preventDefault();
  }

  clearData() {
    this.users = [];
  }

  deleteUser(id: number) {
    this.users = this.users.filter(u => u.id !== id);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
