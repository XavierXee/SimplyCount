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

	public creationMode: boolean = false;
	public deleteMode: boolean = false;
	public editMode: boolean = false;

	private dateText: string;


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

    	console.log("format date text : ", new Date());

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

    onSwipeRight(modeCount: boolean){

    	if(modeCount){

	    	var countIndex = this.counts.indexOf(this.currentCount);

	    	if(this.counts.indexOf(this.currentCount) != 0){
	    		this.currentCount = this.counts[countIndex-1];
	    		this.currentRecord = this.currentCount.records[this.currentCount.records.length-1];
	    	}

    	} else {

	    	var recordIndex = this.currentCount.records.indexOf(this.currentRecord);

	    	if(this.currentCount.records.indexOf(this.currentRecord) != 0){
	    		this.currentRecord = this.currentCount.records[recordIndex-1];
	    	}

    	}

    	this.formatDateText();

    }

    onSwipeLeft(modeCount: boolean){

    	if(modeCount){

	    	var countIndex = this.counts.indexOf(this.currentCount);

	    	if(this.counts.indexOf(this.currentCount) != this.counts.length -1){
	    		this.currentCount = this.counts[countIndex+1];
	    		this.currentRecord = this.currentCount.records[this.currentCount.records.length-1];
	    	}

    	} else {
		
			var recordIndex = this.currentCount.records.indexOf(this.currentRecord);

    		if(this.currentCount.records.indexOf(this.currentRecord) != this.currentCount.records.length-1){
				this.currentRecord = this.currentCount.records[recordIndex+1];
    		}

    	}

    }

    onTouchStart(){

    	console.log("touch start");

    }

    triggerDoubleTap(modeDelete:boolean){

    	if(modeDelete){

    		this.deleteMode = true;

    	} else {

    		console.log("here --->>>> ", this.currentRecord);

    		if(this.currentRecord.amount == null){

    			this.currentRecord.amount = 0;

    		} else {

				this.currentRecord.amount++;

    		}
			
			this.store();

    	}

    }

    onTap($event, modeDelete:boolean){

    	if($event.timeStamp - this.doubleTapPrevTimeStamp > 300){
    		this.doubleTap = false;
    	}
    	if(this.doubleTap === true){
    		if($event.timeStamp - this.doubleTapPrevTimeStamp < 300){
	    		this.triggerDoubleTap(modeDelete);
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
			amount: null,
			date: this.formatDate(new Date())
    	};

		return record;

    }

    getNextId():string {

    	var id;
    	var idArray = [];

    	for (var i = 0; i < this.counts.length; ++i) {
    		idArray.push(Number(this.counts[i].id));
    	}

    	id = Math.max.apply(Math, idArray) + 1;

    	return id.toString();

    }

    createCount(): ICount[] {

    	console.log("|| create Count ||");

    	var count: ICount = {
			id: this.counts ? this.counts.length.toString() : "0",
			name: "",
			records: [this.createRecord()]
    	};

    	this.counts.push(count);

    	return this.counts;

    }


    storeCurrentCount(){


    }

    store(d?:ICount){

    	this.countsAmount = this.counts.length;

    	if(d){
	  //   	this.D.save(d, this.counts).then((res) => {

	  //   		console.log("store :: ", res);
	  //   		console.log("store :: counts", this.counts);

	  //   		this.creationMode = false;

			// });
    	} else {

	    	this.D.saveAll(this.counts).then((res) => {

	    		console.log("store :: ", res);
	    		console.log("store :: counts", this.counts);

	    		if(!this.counts || this.counts.length === 0){
	    			this.counts = [];
					this.startCreationMode();
	    		} else {
		    		this.creationMode = false;
	    		}

				this.countsAmount = this.counts.length;
				this.currentRecord = this.currentCount.records[this.currentCount.records.length-1];

			});

    	}

    }

    deleteCount(){

		this.D.deleteCount(this.currentCount).then(()=>{

			this.deleteMode = false;

			var index = this.counts.indexOf(this.currentCount);
			if (index > -1) {
			    this.counts.splice(index, 1);
			}

			this.currentCount = this.counts[this.counts.length-1];

			this.store();
			
		});

    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Entry Point

    startCreationMode(){

		this.createCount();		
		this.countsAmount = this.counts.length;
		this.currentCount = this.counts[this.counts.length-1];
    	this.currentRecord = this.currentCount.records[this.currentCount.records.length-1];
		this.creationMode = true;

    }

    quitCreationMode(o: boolean){

    	if(!o){

    		if(this.counts.length > 1){
	
	    		this.counts.pop();
	    		this.currentCount = this.counts[this.counts.length-1];
    			this.creationMode = false;

    		}

    	} else {

    		this.store();

    	}

    }

    init(d){

		var data = d;
		this.counts = JSON.parse(data.shift());

		console.log('init debut : ', this.counts, !this.counts);
		
		if (!this.counts) { 

			this.counts = [];
			this.startCreationMode();

		} else {

			// if counst list is not null, fetch records for each count
			for (var i = 0; i < data.length; ++i) {

				data[i] = JSON.parse(data[i]);

				for (var j = 0; j < this.counts.length; ++j) {

					console.log('data --> records :::  ', data[i].records);
					
					if(this.counts[j].id === data[i].id){

						// this.counts[j]["records"] = [];
						this.counts[j].records = data[i].records
						// this.counts[j].records.push(this.createRecord());

					}

				}

			}

			this.countsAmount = this.counts.length;
			this.currentCount = this.counts[this.counts.length-1];

			for (var i = 0; i < this.counts.length; ++i) {
			
		    	if(this.getToday() !== this.counts[i].records[this.counts[i].records.length-1].date){

		    		this.counts[i].records.push(this.createRecord());

		    	}

			}

	    	this.currentRecord = this.currentCount.records[this.currentCount.records.length-1];

			this.store();

		}

    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Class Constructor
	constructor(public platform: Platform, private storage: Storage, public D: Data, public utils: Utils) {

		var q = [platform.ready(), D.start()];

		Promise.all(q).then((d) => {

			this.countsAmount = Number(d[1]);

			// this.D.drop(this.countsAmount).then((res) => {

	    		this.D.fetch(this.countsAmount).then((result) => {

	    			this.init(result);

	    		}, (err) => {

		    		this.errorHandler(err);

		    	});

			// });




	    });
    
	}

}
