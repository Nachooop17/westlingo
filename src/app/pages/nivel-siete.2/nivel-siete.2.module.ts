import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelSiete2PageRoutingModule } from './nivel-siete.2-routing.module';

import { NivelSiete2Page } from './nivel-siete.2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelSiete2PageRoutingModule
  ],
  declarations: [NivelSiete2Page]
})
export class NivelSiete2PageModule {}
