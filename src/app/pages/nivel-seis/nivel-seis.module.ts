import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelSeisPageRoutingModule } from './nivel-seis-routing.module';

import { NivelSeisPage } from './nivel-seis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelSeisPageRoutingModule
  ],
  declarations: [NivelSeisPage]
})
export class NivelSeisPageModule {}
