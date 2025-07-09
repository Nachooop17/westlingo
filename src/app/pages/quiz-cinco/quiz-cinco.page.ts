import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-quiz-cinco',
  templateUrl: './quiz-cinco.page.html',
  styleUrls: ['./quiz-cinco.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule]
})
export class QuizCincoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}