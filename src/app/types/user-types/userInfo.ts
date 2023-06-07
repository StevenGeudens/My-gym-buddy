import { Weight } from './weight';

export interface UserInfo {
    id?: string;
    user: string;
    weightHistory: Weight[];
    height: number;
    calorieTarget: number;
}
