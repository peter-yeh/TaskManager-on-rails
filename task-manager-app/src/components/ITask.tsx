export interface ITask {
    id: number;
    name: string;
    description: string;
    due: Date;
    priority: number;
    tag: string;
    done: boolean;  
}