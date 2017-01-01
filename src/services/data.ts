import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Injectable } from "@angular/core";

@Injectable()

export class Data {

	start(){

		return this.storage.get('countsAmount');

	}

	drop(n){

		var q = [this.storage.remove('countsAmount'), this.storage.remove('counts')];
		
		for (var i = 0; i < n; ++i) {
    		q.push(this.storage.remove(i.toString()));
    	}

		return Promise.all(q);
	}

	deleteCount(i){
		return this.storage.remove(i.id);
	}

	getCount(){

	}

	setCount(){

	}

	fetch(n: number){

		console.log("fetch")

    	var q = [this.storage.get('counts')];

    	for (var i = 0; i < n; ++i) {
    		q.push(this.storage.get(i.toString()));
    	}

    	return Promise.all(q);

	}

	fetchSingle(i:number){
		
		return this.storage.get(i.toString());

	}

	save(n, i, d){

		var q = [this.storage.set('countsAmount', n.toString()), this.storage.set(i.toString(), JSON.stringify(d))];

		return Promise.all(q);

	}

	saveAll(d){

		var c = [];
		var q = [];

		for (var i = 0; i < d.length; ++i) {

			q.push(this.storage.set(d[i].id, JSON.stringify( {"id" : d[i].id, "records" : d[i].records} )));
			c.push({"id": d[i].id, "name" : d[i].name})
			
		}

		q.push(this.storage.set('countsAmount', d.length.toString()));
		q.push(this.storage.set('counts', JSON.stringify(c)));


		return Promise.all(q);
		
	}


	constructor(private storage: Storage) {}

}
