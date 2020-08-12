import { Component, OnInit, OnDestroy } from '@angular/core';
import { Feature } from 'geojson';

import { MapService } from './map/map.service';
import { countryCodes } from '../assets/countryCodes';
import { Loading, Country } from './interfaces';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'Flag-Quiz';
    showLanding = true;
    showLoading = false;
    showQuestion = false;
    showResult = false;
    showSummery = false;
    randomCountries: Country[];
    currentCountry: string;
    index = 0;
    features: any;
    questionNum = 10;
    loadingData: Loading;
    selectedCountrySub: Subscription;
    selectedCounty: Country = null;
    currentResult: boolean = null;
    score = 0;

    constructor(
        private mapService: MapService,
    ) { }

    ngOnInit(): void {

        this.selectedCountrySub = this.mapService.selectedCountry.subscribe(res => {
            if (res) {
                this.selectedCounty = res;
            }
            // this.nextQuestion();
            // if (res.iso === this.currentCountry) {
            //     alert('CORRECT');
            // } else {
            //     alert('FALSE');
            // }
        });

        this.randomCountries = this.getRandomCountries(countryCodes, this.questionNum);
        this.currentCountry = this.randomCountries[this.index].iso;
    }

    ngOnDestroy(): void {
        this.selectedCountrySub.unsubscribe();
    }

    onClick() {
        if (this.index < this.questionNum) {
            this.answer();
        } else {
            this.handleSummery();
        }
    }

    startQuiz() {
        this.showLanding = false;
        this.showLoading = true;

        // remove loading after 2 sec
        setTimeout(() => {
            this.showLoading = false;
            this.showQuestion = true;
        }, 100);

        // // combine and shuffle
        // this.randomCountries = null;
    }

    answer() {

        console.log(this.selectedCounty.iso, this.currentCountry);

        this.showResult = true;
        if (this.selectedCounty.iso === this.currentCountry) {
            this.currentResult = true;
            this.score = ++this.score;
        } else {
            this.currentResult = false;
        }
        console.log(this.score);


        setTimeout(() => {
            this.showResult = false;

            if (this.index === this.questionNum - 1) {
                this.showQuestion = true;
                this.index = ++this.index;
                this.currentCountry = this.randomCountries[this.index].iso;
            }

            this.mapService.removeHighlight();
            this.nextQuestion();
        }, 500);




    }

    nextQuestion() {
        // Zoom to dk
        this.mapService.flyToDK();

        this.showQuestion = true;

        this.index = ++this.index;
        this.currentCountry = this.randomCountries[this.index].iso;

    }

    handleSummery() {
        this.showSummery = true;
        this.showQuestion = false;

    }

    playAgain() {
        this.index = 0;

        this.mapService.currentLocation = null;
        this.mapService.flyToDK();
        this.mapService.removeHighlight();

        this.showLanding = true;
        this.showSummery = false;
        this.showQuestion = false;
    }

    getRandomCountries(countries: Country[], n: number) {
        const result = new Array(n);
        let len = countries.length;
        const taken = new Array(len);

        if (n > len) {
            throw new RangeError('getRandomLocations: more elements taken than available');
        }
        while (n--) {
            const x = Math.floor(Math.random() * len);
            result[n] = countries[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }

}
