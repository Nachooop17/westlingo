import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelCuatro1PageRoutingModule } from './nivel-cuatro.1-routing.module';

import { NivelCuatro1Page } from './nivel-cuatro.1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelCuatro1PageRoutingModule
  ],
  declarations: [NivelCuatro1Page]
})
export class NivelCuatro1PageModule {}
