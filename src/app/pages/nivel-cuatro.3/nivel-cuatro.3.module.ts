import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelCuatro3PageRoutingModule } from './nivel-cuatro.3-routing.module';

import { NivelCuatro3Page } from './nivel-cuatro.3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelCuatro3PageRoutingModule
  ],
  declarations: [NivelCuatro3Page]
})
export class NivelCuatro3PageModule {}
