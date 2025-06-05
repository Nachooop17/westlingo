import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuizTresPageRoutingModule } from './quiz-tres-routing.module';

import { QuizTresPage } from './quiz-tres.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuizTresPageRoutingModule
  ],
  declarations: [QuizTresPage]
})
export class QuizTresPageModule {}
