import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelUno7PageRoutingModule } from './nivel-uno.7-routing.module';

import { NivelUno7Page } from './nivel-uno.7.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelUno7PageRoutingModule
  ],
  declarations: [NivelUno7Page]
})
export class NivelUno7PageModule {}
