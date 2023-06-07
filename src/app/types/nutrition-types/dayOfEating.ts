import { Timestamp } from 'firebase/firestore';
import { FoodItem } from './foodItem';

export interface DayOfEating {
    id?: string;
    user: string;
    date: Timestamp;

    breakfast: FoodItem[];
    lunch: FoodItem[];
    dinner: FoodItem[];
    snacks: FoodItem[];
}
