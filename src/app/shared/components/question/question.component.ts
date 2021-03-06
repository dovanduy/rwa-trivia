import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { Question, Answer, User } from '../../../model';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState, appState, categoryDictionary } from '../../../store';
import { QuestionActions } from '../../../../app/core/store/actions';

@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnChanges {
  @Input() question: Question;
  @Input() userDict: { [key: string]: User };

  questionForm: FormGroup;
  @Output() answerClicked = new EventEmitter<number>();
  @Output() continueClicked = new EventEmitter();

  answeredText: string;
  correctAnswerText: string;

  constructor(private fb: FormBuilder, private store: Store<AppState>, private questionAction: QuestionActions) {
    this.answeredText = '';
    this.correctAnswerText = '';
    this.store.select(appState.coreState).pipe(select(s => s.questionOfTheDay)).subscribe(questionOfTheDay => {
    });
  }

  ngOnChanges() {
    if (this.question.questionText !== undefined) {
      this.question.answers.forEach((item, index) => {
        if (item.correct === true) {
          this.correctAnswerText = item.answerText;
        }
      });

    }
  }

  answerButtonClicked(answer: Answer) {
    if (this.answeredText !== '')
      return;
    this.answeredText = answer.answerText;
    const index = this.question.answers.findIndex(x => x.answerText === answer.answerText);
    this.answerClicked.emit(index);
  }

  getNextQuestion() {
    this.answeredText = '';
    this.correctAnswerText = '';
    this.store.dispatch(this.questionAction.getQuestionOfTheDay());

  }

}
