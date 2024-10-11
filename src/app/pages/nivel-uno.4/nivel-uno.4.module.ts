import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelUno4PageRoutingModule } from './nivel-uno.4-routing.module';

import { NivelUno4Page } from './nivel-uno.4.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelUno4PageRoutingModule
  ],
  declarations: [NivelUno4Page]
})
export class NivelUno4PageModule {}
