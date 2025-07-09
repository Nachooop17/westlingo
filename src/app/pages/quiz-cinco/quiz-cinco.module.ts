import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuizCincoPageRoutingModule } from './quiz-cinco-routing.module';

import { QuizCincoPage } from './quiz-cinco.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuizCincoPageRoutingModule
  ],
  declarations: [QuizCincoPage]
})
export class QuizCincoPageModule {}
