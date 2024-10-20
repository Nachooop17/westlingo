import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelOcho3PageRoutingModule } from './nivel-ocho.3-routing.module';

import { NivelOcho3Page } from './nivel-ocho.3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelOcho3PageRoutingModule
  ],
  declarations: [NivelOcho3Page]
})
export class NivelOcho3PageModule {}
