import { Component, OnInit} from '@angular/core';
import { Task } from '../../task.model';
import { TaskService } from '../../../core/services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskStatus } from '../../task.model';


@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit{
  tasks: Task[] = [];
  displayedColumns = ['name', 'priority', 'status', 'actions'];

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 100;

  constructor(private taskService: TaskService,
              private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    const params = {
      page: this.currentPage,
      perPage: this.itemsPerPage
    };

    this.taskService.getTasks(params).subscribe(response => {
      this.tasks = response.data;
      this.totalItems = response.total
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.loadTasks();
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.loadTasks();
    });
  }

  updateTask(task: Task): void {
    if(!task.id) return;

    if (task.status === TaskStatus.Done && !task.completed_at) {
      task.completed_at = new Date().toISOString();
    } else if (task.status === TaskStatus.Todo || task.status === TaskStatus.InProgress) {
      task.completed_at = null;
    }

    this.taskService.updateTask(task.id, task).subscribe({
      next: () => {
        this.snackBar.open('Úkol byl úspěšně aktualizován', 'Zavřít', {
          duration: 3000,
          panelClass: ['bg-green-500', 'text-white']
        })
      },
      error: (err) => {
        console.error('Chyba při aktualizaci úkolu: ', err);
        this.snackBar.open('Nepodařilo se uložit změny', 'Zavřít', {
          duration: 3000,
          panelClass: ['bg-red-500', 'text-white']
        });
      }
    });
  }

  getPriorityText(priority: number): string {
    return ['Neznámá', 'Nízká', 'Střední', 'Vysoká'][priority] || '';
  }

  getStatusText(status: number): string {
    return ['Neznámý', 'ToDo', 'Probíhá', 'Hotovo'][status] || '';
  }
}
