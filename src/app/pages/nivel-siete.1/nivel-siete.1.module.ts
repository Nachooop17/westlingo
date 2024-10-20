import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelSiete1PageRoutingModule } from './nivel-siete.1-routing.module';

import { NivelSiete1Page } from './nivel-siete.1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelSiete1PageRoutingModule
  ],
  declarations: [NivelSiete1Page]
})
export class NivelSiete1PageModule {}
