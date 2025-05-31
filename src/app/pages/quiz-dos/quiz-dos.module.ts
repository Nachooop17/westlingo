import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuizDosPageRoutingModule } from './quiz-dos-routing.module';

import { QuizDosPage } from './quiz-dos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuizDosPageRoutingModule
  ],
  declarations: [QuizDosPage]
})
export class QuizDosPageModule {}
