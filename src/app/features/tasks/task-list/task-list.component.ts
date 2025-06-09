import { Component, OnInit} from '@angular/core';
import { Task } from '../../task.model';
import { TaskService } from '../../../core/services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskStatus, TaskPriority } from '../../task.model';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';


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
              private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    const params = {
      page: this.currentPage,
      perPage: this.itemsPerPage,
      search: this.searchTerm,
      status: this.selectedStatus,
      priority: this.selectedPriority,
      sort: this.sortColumn,
      direction: this.sortDirection
    };

    if(this.searchTerm) params.search = this.searchTerm;
    if(this.selectedStatus !== null) params.status = this.selectedStatus;
    if(this.selectedPriority !== null) params.priority = this.selectedPriority;



    this.taskService.getTasks(params).subscribe(response => {
      this.tasks = response.data;
      this.totalItems = response.total
    });
  }

  deleteTask(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Opravdu chceš smazat tento úkol?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.taskService.deleteTask(id).subscribe(() => {
          this.loadTasks();
          this.snackBar.open('Úkol byl smazán', 'Zavřít', {duration: 3000});
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
      [TaskPriority.Low]: 'Nízká',
      [TaskPriority.Medium]: 'Střední',
      [TaskPriority.High]: 'Vysoká'
    }[priority] ?? 'Neznámá';
  }

  getStatusText(status: number): string {
    return {
      [TaskStatus.Todo]: 'Todo',
      [TaskStatus.InProgress]: 'Probíhá',
      [TaskStatus.Done]: 'Hotovo'
    }[status] ?? 'Neznámý';
  }
}
