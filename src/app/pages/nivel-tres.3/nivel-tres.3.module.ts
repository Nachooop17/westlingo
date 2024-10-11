import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelTres3PageRoutingModule } from './nivel-tres.3-routing.module';

import { NivelTres3Page } from './nivel-tres.3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelTres3PageRoutingModule
  ],
  declarations: [NivelTres3Page]
})
export class NivelTres3PageModule {}
