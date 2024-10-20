import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelSeis7PageRoutingModule } from './nivel-seis.7-routing.module';

import { NivelSeis7Page } from './nivel-seis.7.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelSeis7PageRoutingModule
  ],
  declarations: [NivelSeis7Page]
})
export class NivelSeis7PageModule {}
