import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelSeis8PageRoutingModule } from './nivel-seis.8-routing.module';

import { NivelSeis8Page } from './nivel-seis.8.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelSeis8PageRoutingModule
  ],
  declarations: [NivelSeis8Page]
})
export class NivelSeis8PageModule {}
