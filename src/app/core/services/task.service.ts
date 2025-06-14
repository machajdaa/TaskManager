import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../../features/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = 'http://10.0.0.24:5282/api/task';

  constructor(private http: HttpClient) { }

  getTasks(paramsObj?:any):Observable<{data: Task[], totalCount: number}>{
    let params = new HttpParams();
    if(paramsObj) {
      Object.keys(paramsObj).forEach(key => {
        if(paramsObj[key] !== null && paramsObj[key] !== undefined) {
          params = params.set(key, paramsObj[key]);
        }
      });
    }
    return this.http.get<{data: Task[],totalCount: number} >('/assets/mock-tasks.json', { params });
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<Task> {
    return this.http.delete<Task>(`${this.apiUrl}/${id}`);
  }
}
