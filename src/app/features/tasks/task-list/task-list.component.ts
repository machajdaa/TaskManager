import { Component, OnInit} from '@angular/core';
import { Task } from '../../task.model';
import { TaskService } from '../../../core/services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskStatus, TaskPriority } from '../../task.model';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';


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

  searchTerm = '';

  selectedStatus: number | null = null;
  selectedPriority: number | null = null;

  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' | '' = '';

  constructor(private taskService: TaskService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
  const params: any = {
    page: this.currentPage,
    perPage: this.itemsPerPage
  };

  if (this.searchTerm?.trim()) {
    params.search = this.searchTerm.trim();
  }

  if (this.selectedStatus !== null) {
    params.status = this.selectedStatus;
  }

  if (this.selectedPriority !== null) {
    params.priority = this.selectedPriority;
  }

  if (this.sortColumn && this.sortDirection) {
    params.sortBy = this.sortColumn;
    params.direction = this.sortDirection;
  }

  console.log('Params odesílané do API:', params); // Pomocné ladění

  this.taskService.getTasks(params).subscribe(response => {
    this.tasks = response.data;
    this.totalItems = response.totalCount;
  });
}

  deleteTask(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.translate.instant('TASK.DELETE_CONFIRM')
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.taskService.deleteTask(id).subscribe(() => {
          this.loadTasks();
          this.snackBar.open(
            this.translate.instant('TASK.DELETED'),
            this.translate.instant('GENERAL.CLOSE'),
            {duration: 3000});
        });
      }
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
        this.snackBar.open(
        this.translate.instant('TASK.TASK_UPDATED'),
        this.translate.instant('GENERAL.CLOSE'),
        {
          duration: 3000,
          panelClass: ['bg-green-500', 'text-white']
        })
      },
      error: () => {
        this.snackBar.open(
        this.translate.instant('TASK.NOT_UPDATED'),
        this.translate.instant('GENERAL.CLOSE'),  
        {
          duration: 3000,
          panelClass: ['bg-red-500', 'text-white']
        });
      }
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.loadTasks();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement
    this.searchTerm = input.value;
    this.currentPage = 1;
    this.loadTasks();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadTasks();
  }

  onSortChange(event: Sort): void {
    this.sortColumn = event.active;
    this.sortDirection = event.direction;
    this.loadTasks();
  }

  //funkce pro překlady enumu
  getPriorityText(priority: number): string {
    return {
      [TaskPriority.Low]: 'PRIORITY.LOW',
      [TaskPriority.Medium]: 'PRIORITY.MEDIUM',
      [TaskPriority.High]: 'PRIORITY.HIGH'
    }[priority] ?? 'PRIORITY.UNKNOWN';
  }

  getStatusText(status: number): string {
    return {
      [TaskStatus.Todo]: 'STATUS.TODO',
      [TaskStatus.InProgress]: 'STATUS.IN_PROGRESS',
      [TaskStatus.Done]: 'STATUS.DONE'
    }[status] ?? 'STATUS.UNKNOWN';
  }
}
