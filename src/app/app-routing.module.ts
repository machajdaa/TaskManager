import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './features/tasks/task-list/task-list.component';
import { TaskFormComponent } from './features/tasks/task-form/task-form.component';
import { TaskDetailComponent } from './features/tasks/task-detail/task-detail.component';

const routes: Routes = [
  {path: '', component: TaskListComponent},
  {path: 'new', component: TaskFormComponent},
  {path: 'edit/:id', component: TaskFormComponent},
  {path: 'detail/:id', component: TaskDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
