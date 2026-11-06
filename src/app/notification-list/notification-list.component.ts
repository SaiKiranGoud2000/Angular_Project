import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../notification.service';
import { AppNotification } from '../notification';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit, OnDestroy {
  all: AppNotification[] = [];
  filtered: AppNotification[] = [];
  loading = false;
  error = '';
  search = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(private service: NotificationService) { }

  ngOnInit(): void {
    this.loadData();
    this.search.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(term => this.applyFilter(term));
  }
  loadData(): void {
    this.loading = true;
    this.error = '';
    this.service.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: data => {
        this.all = data;
        this.applyFilter(this.search.value);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load notifications. Is the API running?';
        this.loading = false;
      }
    });
  }

  applyFilter(term: string | null): void {
    const t = (term || '').toLowerCase().trim();
    this.filtered = this.all.filter(n => n.customerName.toLowerCase().includes(t) || n.phone.includes(t) || n.productName.toLowerCase().includes(t));

  }

  markContacted(n: AppNotification): void{
    this.service.markContacted(n.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: updated => { n.status = updated.status; },
      error: () => alert('Could not update status')
    });
  }
trackById(index: number, item: AppNotification): number {
  return item.id;
}
ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
}