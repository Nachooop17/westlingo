import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelSiete8PageRoutingModule } from './nivel-siete.8-routing.module';

import { NivelSiete8Page } from './nivel-siete.8.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelSiete8PageRoutingModule
  ],
  declarations: [NivelSiete8Page]
})
export class NivelSiete8PageModule {}
