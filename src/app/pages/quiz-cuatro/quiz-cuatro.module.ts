import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuizCuatroPageRoutingModule } from './quiz-cuatro-routing.module';

import { QuizCuatroPage } from './quiz-cuatro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuizCuatroPageRoutingModule
  ],
  declarations: [QuizCuatroPage]
})
export class QuizCuatroPageModule {}
