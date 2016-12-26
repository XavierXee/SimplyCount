import { Component } from '@angular/core';
import { Injectable } from "@angular/core";

// @Injectable()

export interface IInfo {
	c:number; // Compound
	// t:number; // Threshold
	s:number; // Strake
	d:number; // Debt
}

export class Utils {

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


	constructor() {}

}
