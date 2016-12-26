import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { FormsModule }   from '@angular/forms';
import { Data } from '../../services/data';
import { Utils } from '../../services/utils';

//import { HttpService } from '@angular/core';
// import { NavController } from 'ionic-angular';
// import {Observable} from 'rxjs/Rx';



export interface IInfo {
	c:number; // Compound
	// t:number; // Threshold
	s:number; // Strake
	d:number; // Debt
}

export interface IParams {
	c:boolean;
	t:boolean;
	d:boolean;
	cDuration:number;
	tDuration:number;
}

export interface IRecord {
	amount:number;
	date:string;
	infos?: IInfo[];
}

export interface ICount {
	id:string;
	name:string;
	params?: IParams;
	records?: IRecord[];
}

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})

export class HomePage {

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Variables Declaration

	// Data
	private counts: ICount[] = [];
	private countsAmount: number;


	private currentCount: ICount;
	private currentRecord: IRecord;

	// Ui
	private doubleTap: boolean = false;
	private doubleTapPrevTimeStamp: number;

	private creationMode: boolean = false;
	private editMode: boolean = false;

	private dateText: string;

	private newCount: ICount = { id: "", name: "" };

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Utils
	errorHandler(err){
		console.log("!!!!!!!!!!!!!!!");
		console.log(err);
		console.log("!!!!!!!!!!!!!!!");
	}

    formatDate(date: Date): string {

    	return date.getUTCDate().toString() + "/" + date.getUTCMonth().toString() + "/" + date.getUTCFullYear().toString();

    }

    getToday():string {

    	return this.formatDate(new Date());

    }

    formatDateText(): string {

    	return "";

    }

    computeInfos(): IInfo {

    	var info: IInfo = {
			c: 0,
			// t: 0,
			s: 0,
			d: 0 
    	};

    	return info;

    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Events 

    onSwipeRight(){

    	var recordIndex = this.currentCount.records.indexOf(this.currentRecord);

    	if(this.currentCount.records.indexOf(this.currentRecord) != 0){
    		this.currentRecord = this.currentCount.records[recordIndex-1];
    	}

    }

    onSwipeLeft(){
		
		var recordIndex = this.currentCount.records.indexOf(this.currentRecord);

    	if(this.currentCount.records.indexOf(this.currentRecord) != this.currentCount.records.length-1){
			this.currentRecord = this.currentCount.records[recordIndex+1];
    	}

    }

    onTouchStart(){

    	console.log("touch start");

    }

    triggerDoubleTap(){

		this.currentRecord.amount++;
		this.store();

    }

    onTap($event){

    	if($event.timeStamp - this.doubleTapPrevTimeStamp > 300){
    		this.doubleTap = false;
    	}
    	if(this.doubleTap === true){
    		if($event.timeStamp - this.doubleTapPrevTimeStamp < 300){
	    		this.triggerDoubleTap();
    		}
    		this.doubleTap = false;
    	} else {
    		this.doubleTapPrevTimeStamp = $event.timeStamp;
    		this.doubleTap = true;
    	}

    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Data Retrieving

    createRecord(): IRecord {

    	var record: IRecord = {
			amount: 999,
			date: this.formatDate(new Date())
    	};

		return record;

    }

    createCount(): ICount[] {

    	console.log("|| create Count ||");

    	var count: ICount = {
			id: this.counts ? this.counts.length.toString() : "0",
			name: "New Count",
			records: [this.createRecord()]
    	};

    	this.counts.push(count);

    	return this.counts;

    }

    storeNewCount(){

    	var newCountToPush = JSON.parse(JSON.stringify(this.newCount));
    	this.counts.push(newCountToPush);

    }

    storeCurrentCount(){


    }

    store(){

    	this.countsAmount = this.counts.length;

    	this.D.saveAll(this.counts).then((res) => {

    		console.log("store :: ", res);
    		console.log("store :: counts", this.counts);

		});

    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Entry Point

    startCreationMode(){

    	this.creationMode = true;

    }

    quitCreationMode(){

    	this.creationMode = false;
    	this.newCount = { id:"", name:"" };

    }

    init(d){

		var data = d;
		this.counts = JSON.parse(data.shift());
		
		if (!this.counts) { 

			this.counts = [];
			this.creationMode = true;

		} else {

			// if counst list is not null, fetch records for each count

			for (var i = 0; i < data.length; ++i) {

				data[i] = JSON.parse(data[i]);

				for (var j = 0; j < this.counts.length; ++j) {
					
					if(this.counts[j].id === data[i].id){

						this.counts[j]["records"] = [];
						this.counts[j].records = data[i].records;

					}

				}

			}

		}

		this.countsAmount = this.counts.length;
		this.currentCount = this.counts[this.counts.length-1];


    	if(this.getToday() !== this.currentCount.records[this.currentCount.records.length-1].date){

    		this.currentCount.records.push(this.createRecord());

    	}

    	this.currentRecord = this.currentCount.records[this.currentCount.records.length-1];

		this.store();

    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Class Constructor
	constructor(public platform: Platform, private storage: Storage, public D: Data, public utils: Utils) {

		var q = [platform.ready(), D.start()];

		Promise.all(q).then((d) => {

    		this.D.fetch(Number(d[1])).then((result) => {

    			this.init(result);

    		}, (err) => {

	    		this.errorHandler(err);

	    	});


	    });
    
	}

}
