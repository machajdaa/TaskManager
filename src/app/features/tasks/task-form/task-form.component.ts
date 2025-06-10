import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, TaskPriority, TaskStatus } from '../../task.model';
import { TaskService } from '../../../core/services/task.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit{
  form!: FormGroup;
  taskId?: number;

  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
      this.form = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        priority: [TaskPriority.Medium, Validators.required],
        status: [TaskStatus.Todo, Validators.required]
      });

      const idParam = this.route.snapshot.paramMap.get('id');
      if(idParam) {
        this.taskId = +idParam;
        this.taskService.getTask(this.taskId).subscribe( task => {
          this.form.patchValue(task);
        })
      }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const newTask: Task = {
      ...this.form.value,
      completed_at: this.form.value.status === TaskStatus.Done ? new Date().toISOString() : null
    };

    const action = this.taskId
      ? this.taskService.updateTask(this.taskId, newTask)
      : this.taskService.createTask(newTask);

    action.subscribe({
      next: () => {
        this.snackBar.open(this.taskId ? this.translate.instant('TASK.UPDATED') : this.translate.instant('TASK.CREATED'), this.translate.instant('GENERAL.CLOSE'), { duration: 3000 });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.snackBar.open(this.translate.instant('TASK.NOT_SAVED'), this.translate.instant('GENERAL.CLOSE'), { duration: 3000 });
      }
    });
  }
}
