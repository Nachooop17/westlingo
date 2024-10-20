import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelSeis1PageRoutingModule } from './nivel-seis.1-routing.module';

import { NivelSeis1Page } from './nivel-seis.1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelSeis1PageRoutingModule
  ],
  declarations: [NivelSeis1Page]
})
export class NivelSeis1PageModule {}
