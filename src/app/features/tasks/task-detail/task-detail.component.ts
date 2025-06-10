import { Component, OnInit } from '@angular/core';
import { Task, TaskPriority, TaskStatus } from '../../task.model';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-task-detail',
  standalone: false,
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent implements OnInit{
  task?: Task;
  notFound = false;

  constructor (
    private route: ActivatedRoute,
    private taskService: TaskService,
    private location:Location
  ) {}

  ngOnInit(): void {
      const idParam = this.route.snapshot.paramMap.get('id');
      if(idParam){
        const taskId = +idParam;
        this.taskService.getTask(taskId).subscribe({
          next: (task) => {
            this.task = task;
            this.notFound = !task;
          },
          error: (err) => {
            this.notFound = true;
          }
        });
      } else {
        this.notFound = true;
      }
  }

  goBack(): void {
    this.location.back();
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
