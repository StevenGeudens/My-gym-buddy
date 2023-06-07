import { Timestamp } from 'firebase/firestore';

export interface Weight {
    kg: number;
    date: Timestamp;
}
