import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelNueve5PageRoutingModule } from './nivel-nueve.5-routing.module';

import { NivelNueve5Page } from './nivel-nueve.5.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelNueve5PageRoutingModule
  ],
  declarations: [NivelNueve5Page]
})
export class NivelNueve5PageModule {}
