import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelUno1PageRoutingModule } from './nivel-uno.1-routing.module';

import { NivelUno1Page } from './nivel-uno.1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelUno1PageRoutingModule
  ],
  declarations: [NivelUno1Page]
})
export class NivelUno1PageModule {}
