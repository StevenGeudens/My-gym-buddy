import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FilterOption } from 'src/app/types/filterOption';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {
  muscleOptions: FilterOption[] = [
    {name: 'all', isActive: false},
    {name: 'abdominals', isActive: false},
    {name: 'abductors', isActive: false},
    {name: 'adductors', isActive: false},
    {name: 'biceps', isActive: false},
    {name: 'calves', isActive: false},
    {name: 'chest', isActive: false},
    {name: 'forearms', isActive: false},
    {name: 'glutes', isActive: false},
    {name: 'hamstrings', isActive: false},
    {name: 'lats', isActive: false},
    {name: 'lower_back', isActive: false},
    {name: 'middle_back', isActive: false},
    {name: 'neck', isActive: false},
    {name: 'quadriceps', isActive: false},
    {name: 'traps', isActive: false},
    {name: 'triceps', isActive: false}
  ];
  typeOptions: FilterOption[] = [
    {name: 'all', isActive: false},
    {name: 'cardio', isActive: false},
    {name: 'olympic_weightlifting', isActive: false},
    {name: 'plyometrics', isActive: false},
    {name: 'powerlifting', isActive: false},
    {name: 'strength', isActive: false},
    {name: 'stretching', isActive: false},
    {name: 'strongman', isActive: false}
  ];
  difficultyOptions: FilterOption[] = [
    {name: 'all', isActive: false},
    {name: 'beginner', isActive: false},
    {name: 'intermediate', isActive: false},
    {name: 'expert', isActive: false}
  ];

  selectedMuscleOption: string;
  selectedTypeOption: string;
  selectedDifficultyOption: string;


  constructor(public modalController: ModalController) {}

  ngOnInit() {
    this.muscleOptions.forEach(o => {
      if (this.selectedMuscleOption !== '') {
        if (o.name === this.selectedMuscleOption){
          o.isActive = true;
        }
      } else {
        if (o.name === 'all') {
          o.isActive = true;
        }
      }
    });
    this.typeOptions.forEach(o => {
      if (this.selectedTypeOption !== '') {
        if (o.name === this.selectedTypeOption){
          o.isActive = true;
        }
      } else {
        if (o.name === 'all') {
          o.isActive = true;
        }
      }
    });
    this.difficultyOptions.forEach(o => {
      if (this.selectedDifficultyOption !== '') {
        if (o.name === this.selectedDifficultyOption){
          o.isActive = true;
        }
      } else {
        if (o.name === 'all') {
          o.isActive = true;
        }
      }
    });
  }

  selectMuscleOption(selectedOption: FilterOption): void {
    this.muscleOptions.forEach(o => {
      if (o.name === selectedOption.name){
        o.isActive = true;
        if (o.name === 'all'){
          this.selectedMuscleOption = '';
        } else {
          this.selectedMuscleOption = o.name;
        }
      } else {
        o.isActive = false;
      }
    });
  }

  selectTypeOption(selectedOption: FilterOption): void {
    this.typeOptions.forEach(o => {
      if (o.name === selectedOption.name){
        o.isActive = true;
        if (o.name === 'all'){
          this.selectedTypeOption = '';
        } else {
          this.selectedTypeOption = o.name;
        }
      } else {
        o.isActive = false;
      }
    });
  }

  selectDifficultyOption(selectedOption: FilterOption): void {
    this.difficultyOptions.forEach(o => {
      if (o.name === selectedOption.name){
        o.isActive = true;
        if (o.name === 'all'){
          this.selectedDifficultyOption = '';
        } else {
          this.selectedDifficultyOption = o.name;
        }
      } else {
        o.isActive = false;
      }
    });
  }

  async dismiss() {
    await this.modalController.dismiss({
      selectedMuscleOption: this.selectedMuscleOption,
      selectedTypeOption: this.selectedTypeOption,
      selectedDifficultyOption: this.selectedDifficultyOption
    });
  }

  clearFilters() {
    const option = {name: 'all', isActive: false};
    this.selectMuscleOption(option);
    this.selectTypeOption(option);
    this.selectDifficultyOption(option);
  }

}
