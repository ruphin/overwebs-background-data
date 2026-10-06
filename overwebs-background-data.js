import { GluonElement as e } from "../gluonjs/gluon.js";
//#region src/overwebs-background-data.js
var t = window.modulesAssetPath && window.modulesAssetPath("overwebs-background-data") + "/assets" || "/assets", n = (e) => ({
	to_play: {
		transition: "play",
		preload: ["play_to_main"],
		video: `${e}/shared/to_play.mp4`,
		image: `${e}/shared/to_play.jpg`
	},
	to_training: { mirror: "to_play" },
	play: {
		preload: ["play_to_main"],
		video: `${e}/shared/play.mp4`,
		image: `${e}/shared/play.jpg`
	},
	training: { mirror: "play" },
	to_competitive: {
		transition: "competitive",
		preload: ["competitive_to_play"],
		video: `${e}/shared/to_competitive.mp4`,
		image: `${e}/shared/to_competitive.jpg`
	},
	to_arcade: { mirror: "to_competitive" },
	"to_vs-ai": { mirror: "to_competitive" },
	competitive: {
		preload: ["competitive_to_play"],
		video: `${e}/shared/competitive.mp4`,
		image: `${e}/shared/competitive.jpg`
	},
	arcade: { mirror: "competitive" },
	"vs-ai": { mirror: "competitive" },
	competitive_to_play: {
		transition: ["play"],
		video: `${e}/shared/competitive_to_play.mp4`,
		image: `${e}/shared/competitive_to_play.jpg`
	},
	arcade_to_play: { mirror: "competitive_to_play" },
	"vs-ai_to_play": { mirror: "competitive_to_play" },
	"vs-ai_to_training": { mirror: "competitive_to_play" },
	"to_hero-gallery": {
		transition: "hero-gallery",
		preload: ["hero-gallery_to_main"],
		video: `${e}/shared/to_hero-gallery.mp4`,
		image: `${e}/shared/to_hero-gallery.jpg`
	},
	"hero-gallery": {
		preload: ["hero-gallery_to_main"],
		video: `${e}/shared/hero-gallery.mp4`,
		image: `${e}/shared/hero-gallery.jpg`
	},
	login: {
		preload: ["to_main"],
		video: !1,
		image: "shared/login.jpg"
	},
	to_main: {
		transition: "main",
		preload: ["to_play", "to_hero-gallery"]
	},
	main: { preload: ["to_play", "to_hero-gallery"] },
	play_to_main: { transition: "main" },
	training_to_main: { mirror: "play_to_main" },
	"hero-gallery_to_main": { transition: "main" }
}), r = {
	halloween: {
		reaper: n("halloween"),
		mercy: n("halloween")
	},
	hollywood: {
		tracer: n("hollywood"),
		bastion: n("hollywood")
	},
	volskaya: {
		widowmaker: n("volskaya"),
		soldier76: n("volskaya"),
		genji: n("volskaya")
	},
	gibraltar: {
		winston: n("gibraltar"),
		sombra: n("gibraltar")
	},
	eichenwalde: {
		mccree: n("eichenwalde"),
		roadhog: n("eichenwalde")
	},
	hanamura: {
		reaper: n("hanamura"),
		sombra: n("hanamura")
	},
	kings_row: { reinhardt: n("kings_row") },
	temple_of_anubis: {
		dva: n("temple_of_anubis"),
		pharah: n("temple_of_anubis")
	}
}, i = class extends e {
	static get observedAttributes() {
		return ["select"];
	}
	attributeChangedCallback(e, t, n) {
		e === "select" && (this.select = n);
	}
	set select(e) {
		e !== this._select && (this._select = e, this._selectBackgrounds());
	}
	get select() {
		return this._select;
	}
	set backgrounds(e) {
		e !== this._backgrounds && (this._backgrounds = e, this.dispatchEvent(new Event("backgrounds-changed")));
	}
	get backgrounds() {
		return this._backgrounds;
	}
	set backgroundSelection(e) {
		e !== this._backgroundSelection && (this._backgroundSelection = e, this.dispatchEvent(new Event("backgroundSelection-changed")));
	}
	get backgroundSelection() {
		return this._backgroundSelection;
	}
	connectedCallback() {
		super.connectedCallback(), this.backgrounds || this._selectBackgrounds();
	}
	_selectBackgrounds() {
		let e = this._index(r);
		if (this.select) {
			let t = new RegExp(this.select);
			e = e.filter((e) => t.test(e));
		}
		if (this.backgroundSelection = e[Math.floor(Math.random() * e.length)], !this.backgroundSelection) {
			console.warn("Could not select a backgroundSet");
			return;
		}
		let n = this.backgroundSelection.split("/").slice(0, -1).reduce((e, t) => e[t], r);
		for (let e in n) if (!n[e].mirror) {
			let r = n[e].video || `${this.backgroundSelection}${e}.mp4`;
			r = `${t}/${r}`;
			let i = n[e].image || `${this.backgroundSelection}${e}.jpg`;
			i = `${t}/${i}`, n[e].video !== !1 && (n[e].video = r), n[e].image = i;
		}
		this.backgrounds = n;
	}
	_index(e) {
		let t = [];
		for (let n in e) {
			if (e[n].transition || e[n].preload) return [""];
			Array.prototype.push.apply(t, this._index(e[n]).map((e) => n + "/" + e));
		}
		return t;
	}
};
customElements.define(i.is, i);
//#endregion

//# sourceMappingURL=overwebs-background-data.js.map