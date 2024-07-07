import { ParamMap } from '@angular/router';

export class ActivatedRouteMock {
	private params: ParamMap;

	constructor(params: ParamMap) {
		this.params = params;
	}
	public get snapshot() {
		return {
			queryParams: this.params,
		};
	}
}
