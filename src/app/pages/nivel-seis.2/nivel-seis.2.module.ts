import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelSeis2PageRoutingModule } from './nivel-seis.2-routing.module';

import { NivelSeis2Page } from './nivel-seis.2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelSeis2PageRoutingModule
  ],
  declarations: [NivelSeis2Page]
})
export class NivelSeis2PageModule {}
