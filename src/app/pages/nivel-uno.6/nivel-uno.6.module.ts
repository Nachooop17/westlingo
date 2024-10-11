import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelUno6PageRoutingModule } from './nivel-uno.6-routing.module';

import { NivelUno6Page } from './nivel-uno.6.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelUno6PageRoutingModule
  ],
  declarations: [NivelUno6Page]
})
export class NivelUno6PageModule {}
