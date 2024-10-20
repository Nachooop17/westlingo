import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelSeis5PageRoutingModule } from './nivel-seis.5-routing.module';

import { NivelSeis5Page } from './nivel-seis.5.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelSeis5PageRoutingModule
  ],
  declarations: [NivelSeis5Page]
})
export class NivelSeis5PageModule {}
