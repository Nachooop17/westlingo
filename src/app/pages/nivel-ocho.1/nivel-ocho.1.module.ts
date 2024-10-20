import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelOcho1PageRoutingModule } from './nivel-ocho.1-routing.module';

import { NivelOcho1Page } from './nivel-ocho.1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelOcho1PageRoutingModule
  ],
  declarations: [NivelOcho1Page]
})
export class NivelOcho1PageModule {}
