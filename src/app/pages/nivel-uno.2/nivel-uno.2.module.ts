import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelUno2PageRoutingModule } from './nivel-uno.2-routing.module';

import { NivelUno2Page } from './nivel-uno.2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelUno2PageRoutingModule
  ],
  declarations: [NivelUno2Page]
})
export class NivelUno2PageModule {}
