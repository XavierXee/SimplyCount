import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Injectable } from "@angular/core";

@Injectable()

export class Data {

	start(){

		return this.storage.get('countsAmount');

	}

	getCount(){

	}

	setCount(){

	}

	delete(){

	}


	fetch(n: number){

    	// var q = [this.storage.get('countsAmount'), this.storage.get('counts')];
    	var q = [this.storage.get('counts')];

    	for (var i = 0; i < n; ++i) {
    		q.push(this.storage.get(i.toString()));
    	}

    	return Promise.all(q);

	}

	fetchSingle(i:number){

		// var q = [this.storage.get('countsAmount'), this.storage.get('counts')];
		
		return this.storage.get(i.toString());

	}

	save(n, i, d){

		var q = [this.storage.set('countsAmount', n.toString()), this.storage.set(i.toString(), JSON.stringify(d))];

		return Promise.all(q);

	}

	saveAll(n, d){

		// var q = [this.storage.set('countsAmount', n.toString()), this.storage.set(i.toString(), JSON.stringify(d))];//old

		var q = [this.storage.set('countsAmount', n.toString())];

		for (var i = 0; i < n; ++i) {

			var _d;

			for (var j = 0; j < d.length; ++j) {
				if(d[j].id == j){
					_d = d[j];
				}
			}

			console.log("DEBUG--------", _d);
			console.log("DEBUG--------", d[i]);
			console.log("DEBUG--------", JSON.stringify(d[i]) == JSON.stringify(d[i]));

			q.push(this.storage.set(j.toString(), JSON.stringify(_d)));

		}

		return Promise.all(q);
		
	}


	constructor(private storage: Storage) {}

}
