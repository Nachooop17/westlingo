import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelCuatro7PageRoutingModule } from './nivel-cuatro.7-routing.module';

import { NivelCuatro7Page } from './nivel-cuatro.7.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelCuatro7PageRoutingModule
  ],
  declarations: [NivelCuatro7Page]
})
export class NivelCuatro7PageModule {}
