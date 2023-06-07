import { Set } from './set';

export interface Exercise {
    name: string;
    type: string;
    muscle: string;
    equipment: string;
    difficulty: string;
    instructions: string;
    sets: Set[];
}
