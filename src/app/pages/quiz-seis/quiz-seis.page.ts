import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-quiz-seis',
  templateUrl: './quiz-seis.page.html',
  styleUrls: ['./quiz-seis.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule]
})
export class QuizSeisPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}