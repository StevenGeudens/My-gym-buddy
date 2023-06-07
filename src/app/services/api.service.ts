import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Quote } from '../types/quote';
import { catchError, Observable, of, retry } from 'rxjs';
import { Exercise } from '../types/workout-types/exercise';
import { FoodItem } from '../types/nutrition-types/foodItem';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly #apiNinjasApiKey = environment.apiNinjasApiKey;
  readonly #apiNinjasBaseURL = 'https://api.api-ninjas.com/v1';

  constructor(private http: HttpClient) { }

  // Api documentation: https://api-ninjas.com/api/quotes
    getQuote(): Observable<Quote[]> {
        return this.http
        .get<Quote[]>(
          `${this.#apiNinjasBaseURL}/quotes?category=fitness`,
          { headers: new HttpHeaders({ 'X-Api-Key': this.#apiNinjasApiKey}), observe: 'body', responseType: 'json'}
        ).pipe(
          catchError(err => {
            console.log(err);
            return of(undefined);
          }),
          retry(3)
        );
    }

    // Api documentation: https://api-ninjas.com/api/exercises
    getExercises(
      offset: number,
      name: string = '',
      muscle: string = '',
      type: string = '',
      difficulty: string = ''
    ): Observable<Exercise[]> {
      return this.http.get<Exercise[]>(`${this.#apiNinjasBaseURL}/exercises`,
      { headers: new HttpHeaders({ 'X-Api-Key': this.#apiNinjasApiKey}),
      observe: 'body',
      responseType: 'json',
      params: { offset, name, muscle, type, difficulty }})
      .pipe(
        catchError(err => {
          console.log(err);
          return of(undefined);
        }),
        retry(3)
      );
    }

    // Api documentation: https://api-ninjas.com/api/nutrition
    getFoodItems(query: string): Observable<FoodItem[]> {
      return this.http
      .get<FoodItem[]>(
        `${this.#apiNinjasBaseURL}/nutrition?query=${query}`,
        { headers: new HttpHeaders({ 'X-Api-Key': this.#apiNinjasApiKey}), observe: 'body', responseType: 'json'}
      ).pipe(
        catchError(err => {
          console.log(err);
          return of(undefined);
        }),
        retry(3)
      );
    }
}
