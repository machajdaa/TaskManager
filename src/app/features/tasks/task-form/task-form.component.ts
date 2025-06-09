import { Component, OnInit, Sanitizer } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, TaskPriority, TaskStatus } from '../../task.model';
import { TaskService } from '../../../core/services/task.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit{
  form!: FormGroup;
  taskId?: number;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
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
        this.snackBar.open(this.taskId ? 'Úkol byl aktualizován' : 'Úkol byl úspěšně vytvořen', 'Zavřít', { duration: 3000 });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.snackBar.open('Nastala chyba při úkládání úkolu', 'Zavřít', { duration: 3000 });
      }
    });
  }
}
