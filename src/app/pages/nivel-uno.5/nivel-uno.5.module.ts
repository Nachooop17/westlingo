import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelUno5PageRoutingModule } from './nivel-uno.5-routing.module';

import { NivelUno5Page } from './nivel-uno.5.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelUno5PageRoutingModule
  ],
  declarations: [NivelUno5Page]
})
export class NivelUno5PageModule {}
