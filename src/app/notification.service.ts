import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppNotification } from './notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
 private baseUrl = 'http://localhost:3000/notifications';

  constructor(private http: HttpClient) { }

  getAll(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(this.baseUrl);
  }

  markContacted(id: number): Observable<AppNotification>{
    return this.http.patch<AppNotification>(`${this.baseUrl}/${id}`, { status: 'contacted' });
  }
}
