import { Exercise } from './exercise';

export interface Workout {
    id?: string;
    user: string;
    title: string;
    exercises: Exercise[];
    complete: boolean;
}
