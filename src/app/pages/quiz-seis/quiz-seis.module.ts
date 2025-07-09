import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuizSeisPageRoutingModule } from './quiz-seis-routing.module';

import { QuizSeisPage } from './quiz-seis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuizSeisPageRoutingModule
  ],
  declarations: [QuizSeisPage]
})
export class QuizSeisPageModule {}
