import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelSeis3PageRoutingModule } from './nivel-seis.3-routing.module';

import { NivelSeis3Page } from './nivel-seis.3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelSeis3PageRoutingModule
  ],
  declarations: [NivelSeis3Page]
})
export class NivelSeis3PageModule {}
