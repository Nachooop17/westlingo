import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuizUnoPageRoutingModule } from './quiz-uno-routing.module';

import { QuizUnoPage } from './quiz-uno.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuizUnoPageRoutingModule
  ],
  declarations: [QuizUnoPage]
})
export class QuizUnoPageModule {}
