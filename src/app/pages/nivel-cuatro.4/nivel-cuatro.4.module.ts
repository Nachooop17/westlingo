import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelCuatro4PageRoutingModule } from './nivel-cuatro.4-routing.module';

import { NivelCuatro4Page } from './nivel-cuatro.4.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelCuatro4PageRoutingModule
  ],
  declarations: [NivelCuatro4Page]
})
export class NivelCuatro4PageModule {}
