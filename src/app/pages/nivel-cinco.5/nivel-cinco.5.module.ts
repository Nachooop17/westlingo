import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelCinco5PageRoutingModule } from './nivel-cinco.5-routing.module';

import { NivelCinco5Page } from './nivel-cinco.5.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelCinco5PageRoutingModule
  ],
  declarations: [NivelCinco5Page]
})
export class NivelCinco5PageModule {}
