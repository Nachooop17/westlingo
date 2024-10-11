import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelCuatroPageRoutingModule } from './nivel-cuatro-routing.module';

import { NivelCuatroPage } from './nivel-cuatro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelCuatroPageRoutingModule
  ],
  declarations: [NivelCuatroPage]
})
export class NivelCuatroPageModule {}
