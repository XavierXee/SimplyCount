import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

export interface IInfo {
	c:number; // Compound
	t:number; // Threshold
	s:number; // Strake
	d:number; // Debt
}

export interface IRecord {
	amount:number;
	date:string;
	infos?: IInfo[];
}

export interface ICount {
	id:number;
	name:string;
	records: IRecord[];
}

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})

export class HomePage {

	private currentCount: ICount;
	private currentRecord: IRecord;

    formatDate(date: Date): string {
    	return date.getUTCDate().toString() + "/" + date.getUTCMonth().toString() + "/" + date.getUTCFullYear().toString();
    }

    onSwipeRight(){

    }

    onSwipeLeft(){
    	
    }

    onTap(){
    	
    }

	constructor(public navCtrl: NavController) {

		// test
		this.currentCount = {
			id: 0,
			name: "test",
			records: [
				{
					amount: 0,
					date: this.formatDate(new Date())
				}
			]
		};

		this.currentRecord = this.currentCount.records[0];
		// test

		console.log("controleur ok");

    
	}

}
