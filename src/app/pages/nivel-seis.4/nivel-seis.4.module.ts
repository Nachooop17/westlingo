import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelSeis4PageRoutingModule } from './nivel-seis.4-routing.module';

import { NivelSeis4Page } from './nivel-seis.4.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelSeis4PageRoutingModule
  ],
  declarations: [NivelSeis4Page]
})
export class NivelSeis4PageModule {}
