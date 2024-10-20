import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelSeis6PageRoutingModule } from './nivel-seis.6-routing.module';

import { NivelSeis6Page } from './nivel-seis.6.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelSeis6PageRoutingModule
  ],
  declarations: [NivelSeis6Page]
})
export class NivelSeis6PageModule {}
