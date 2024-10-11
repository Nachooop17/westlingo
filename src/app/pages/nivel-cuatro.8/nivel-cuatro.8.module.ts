import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelCuatro8PageRoutingModule } from './nivel-cuatro.8-routing.module';

import { NivelCuatro8Page } from './nivel-cuatro.8.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelCuatro8PageRoutingModule
  ],
  declarations: [NivelCuatro8Page]
})
export class NivelCuatro8PageModule {}
