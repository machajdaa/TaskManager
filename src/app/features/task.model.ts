export interface Task {
    id?:number;
    name:string;
    priority:TaskPriority;
    status:TaskStatus;
    completed_at:string | null;
    created_at?:string;
    updated_at?:string;
}

export enum TaskPriority {
    Low = 1,
    Medium = 2,
    High = 3
}

export enum TaskStatus {
    Todo = 1,
    InProgress = 2,
    Done = 3
}