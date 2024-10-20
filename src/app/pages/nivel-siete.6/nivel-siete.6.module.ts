import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelSiete6PageRoutingModule } from './nivel-siete.6-routing.module';

import { NivelSiete6Page } from './nivel-siete.6.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelSiete6PageRoutingModule
  ],
  declarations: [NivelSiete6Page]
})
export class NivelSiete6PageModule {}
