function getSeed() {
	if (window.player !== undefined) return player.seed;
	else if (localStorage.getItem("rng_madness") !== null ? JSON.parse(atob(localStorage.getItem("rng_madness"))) !== null : false) return JSON.parse(atob(localStorage.getItem("rng_madness"))).seed;
	else return Math.round(Math.random()*1e9);
}

function RNGReset() {
	let s = +prompt("Enter a seed (number from 1 to 9e29).");
	if (isNaN(s)) return;
	if (s<0 || s>=1e33 || s!=Math.round(s)) return;
	hardReset(false, s);
}

const RNG_DATA = {
	rows: 5,
	minLayers: 1,
	maxLayers: 5,
	layers(row) { 
		let l = Math.max(Math.min(Math.floor(random(getSeed()*row)*RNG_DATA.maxLayers+1), RNG_DATA.maxLayers), RNG_DATA.minLayers);
		return Math.min(l, row);		
	},
	chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()<.>?{}[]|`~,\//¡©¿¨½¼¾'.split(''),
	types: ["normal", "static"],
	rowReqs: {
		1: new Decimal(1),
		2: new Decimal(10)
		3: new Decimal(100),
		4: new Decimal(1000),
		5: new Decimal(10000),
	},
	rowBaseExps: {
		1: new Decimal(5),
		2: new Decimal(25),
		3: new Decimal(100),
		4: new Decimal(2500),
		5: new Decimal(10000),
	},
	staticRowBaseExps: {
		1: new Decimal(0.4),
		2: new Decimal(0.7),
		3: new Decimal(0.3),
		4: new Decimal(0.11),
		5: new Decimal(0.5),
	},
	rowLayerTotalMultExps: {
		1: new Decimal(0.1),
		2: new Decimal(0.2),
		3: new Decimal(0.3),
		4: new Decimal(0.4),
		5: new Decimal(0.5),
	},
}

function random(seed) {
    var x = Math.sin(seed*10+1) * 10000;
    return x - Math.floor(x);
}

function globalEffect(target) {
	let eff = new Decimal(1);
	for (let l in layers) {
		if (!tmp[l].hasEffect) continue;
		if (tmp[l].effectTarget == target) {
			if (target!="NONE"?tmp[target].type=="static":false) eff = eff.div(tmp[l].effect);
			else eff = eff.times(tmp[l].effect);
		}
	}
	return eff;
}

function globalUpgEffect(target) {
	let eff = new Decimal(1);
	for (let l in layers) {
		if (!tmp[l].upgrades) continue;
		for (let r=1;r<=tmp[l].upgrades.rows;r++) {
			for (let c=1;c<=tmp[l].upgrades.cols;c++) {
				let id = r*10+c;
				if (!hasUpgrade(l, id)) continue;
				if (tmp[l].upgrades[id].et == target) {
					if (target!="NONE"?tmp[target].type=="static":false) eff = eff.div(tmp[l].upgrades[id].effect);
					else eff = eff.times(tmp[l].upgrades[id].effect);
				}
			}
		}
	}
	return eff;
}

function globalBuyableEffect(target) {
	let eff = new Decimal(1);
	for (let l in layers) {
		if (!tmp[l].buyables) continue;
		for (let r=1;r<=tmp[l].buyables.rows;r++) {
			for (let c=1;c<=tmp[l].buyables.cols;c++) {
				let id = r*10+c;
				if (tmp[l].buyables[id].et == target) {
					if (target!="NONE"?tmp[target].type=="static":false) eff = eff.div(tmp[l].buyables[id].effect);
					else eff = eff.times(tmp[l].buyables[id].effect);
				}
			}
		}
	}
	return eff;
}
