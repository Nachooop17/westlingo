import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelUno8PageRoutingModule } from './nivel-uno.8-routing.module';

import { NivelUno8Page } from './nivel-uno.8.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelUno8PageRoutingModule
  ],
  declarations: [NivelUno8Page]
})
export class NivelUno8PageModule {}
