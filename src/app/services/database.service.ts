import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  collectionData,
  docData
 } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Workout } from '../types/workout-types/workout';
import { Exercise } from '../types/workout-types/exercise';
import { addDoc, deleteDoc, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { DayOfEating } from '../types/nutrition-types/dayOfEating';
import { FoodItem } from '../types/nutrition-types/foodItem';
import { Weight } from '../types/user-types/weight';
import { UserInfo } from '../types/user-types/userInfo';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private authService: AuthService, private fireStore: Firestore) { }

  // Workout functions
  async saveWorkout<Workout>(title: string, exercises: Exercise[], complete: boolean): Promise<void> {
    const workout = {
      user: this.authService.getUserUID(),
      title,
      exercises,
      complete
    };
    await addDoc<Workout>(this.getCollectionRef<Workout>('Workouts'), workout as Workout);
  }

  async updateWorkout(id: string, title: string, exercises: Exercise[], complete: boolean): Promise<void> {
    const workout = {
      user: this.authService.getUserUID(),
      title,
      exercises,
      complete
    };
    await updateDoc(this.getDocumentRef('Workouts', id), workout);
  }

  async deleteWorkout(id: string): Promise<void> {
    await deleteDoc(this.getDocumentRef('Workouts', id));
  }

  retrieveWorkouts(): Observable<Workout[]> {
    return collectionData<Workout>(
      query<Workout>(
        this.getCollectionRef('Workouts'),
        where('user', '==', this.authService.getUserUID())),
      {idField: 'id'}
    );
  }

  retrieveWorkoutViaId(id: string): Observable<Workout> {
    return docData<Workout>(
      this.getDocumentRef('Workouts', id),
      {idField: 'id'}
    );
  }

  // Nutrition functions
  retrieveDaysOfEating(): Observable<DayOfEating[]> {
    return collectionData<DayOfEating>(
      query<DayOfEating>(
      this.getCollectionRef('DaysOfEating'),
      where('user', '==', this.authService.getUserUID())),
      {idField: 'id'}
    );
  }

  retrieveDayOfEatingViaId(id: string): Observable<DayOfEating> {
    return docData<DayOfEating>(
      this.getDocumentRef('DaysOfEating', id),
      {idField: 'id'}
    );
  }

  async saveDayOfEating<DayOfEating>(
    date: Date,
    breakfast: FoodItem[],
    lunch: FoodItem[],
    dinner: FoodItem[],
    snacks: FoodItem[]
  ): Promise<void> {
    const dayOfEating = {
      user: this.authService.getUserUID(),
      date: Timestamp.fromDate(date),
      breakfast,
      lunch,
      dinner,
      snacks
    };
    await addDoc<DayOfEating>(this.getCollectionRef<DayOfEating>('DaysOfEating'), dayOfEating as DayOfEating);
  }

  async updateDayOfEating(id: string, breakfast: FoodItem[], lunch: FoodItem[], dinner: FoodItem[], snacks: FoodItem[]): Promise<void> {
    const dayOfEating = {
      breakfast,
      lunch,
      dinner,
      snacks
    };
    await updateDoc(this.getDocumentRef('DaysOfEating', id), dayOfEating);
  }

  // UserInfo functions
  async saveUserInfo(weight: number, height: number, calorieTarget: number): Promise<void> {
    const userInfo = {
      user: this.authService.getUserUID(),
      weightHistory: [{kg: weight, date: Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0)))}],
      height,
      calorieTarget
    };
    await addDoc<UserInfo>(this.getCollectionRef<UserInfo>('UsersInfo'), userInfo as UserInfo);
  }

  async updateUserInfo(id: string, weightHistory: Weight[], height: number, calorieTarget: number): Promise<void> {
    const userInfo = {
      weightHistory,
      height,
      calorieTarget
    };
    await updateDoc(this.getDocumentRef('UsersInfo', id), userInfo);
  }

  retrieveUserInfo(): Observable<UserInfo[]> {
    return collectionData<UserInfo>(
      query<UserInfo>(
      this.getCollectionRef('UsersInfo'),
      where('user', '==', this.authService.getUserUID())),
      {idField: 'id'}
    );
  }

  private getCollectionRef<T>(collectionName: string): CollectionReference<T> {
    return collection(this.fireStore, collectionName) as CollectionReference<T>;
  }

  private getDocumentRef<T>(collectionName: string, id: string): DocumentReference<T> {
    return doc(this.fireStore, `${collectionName}/${id}`) as DocumentReference<T>;
  }

}
