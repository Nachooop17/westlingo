import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelCuatro6PageRoutingModule } from './nivel-cuatro.6-routing.module';

import { NivelCuatro6Page } from './nivel-cuatro.6.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelCuatro6PageRoutingModule
  ],
  declarations: [NivelCuatro6Page]
})
export class NivelCuatro6PageModule {}
