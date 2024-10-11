import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelCuatro2PageRoutingModule } from './nivel-cuatro.2-routing.module';

import { NivelCuatro2Page } from './nivel-cuatro.2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelCuatro2PageRoutingModule
  ],
  declarations: [NivelCuatro2Page]
})
export class NivelCuatro2PageModule {}
