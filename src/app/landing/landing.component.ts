import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
    @Output() startQuiz = new EventEmitter();

    start() {
        this.startQuiz.emit();
    }
}
