import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelUno3PageRoutingModule } from './nivel-uno.3-routing.module';

import { NivelUno3Page } from './nivel-uno.3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelUno3PageRoutingModule
  ],
  declarations: [NivelUno3Page]
})
export class NivelUno3PageModule {}
