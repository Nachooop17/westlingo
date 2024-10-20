import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelSiete4PageRoutingModule } from './nivel-siete.4-routing.module';

import { NivelSiete4Page } from './nivel-siete.4.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelSiete4PageRoutingModule
  ],
  declarations: [NivelSiete4Page]
})
export class NivelSiete4PageModule {}
