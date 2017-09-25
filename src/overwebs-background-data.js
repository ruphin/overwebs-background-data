import { GluonElement } from '../gluonjs/gluon.js';

const assetPath = (window.modulesAssetPath && window.modulesAssetPath('overwebs-background-data') + '/assets') || '/assets';

const mapBackgrounds = map => {
  return {
    to_play: {
      transition: 'play',
      preload: ['play_to_main'],
      video: `${map}/shared/to_play.mp4`,
      image: `${map}/shared/to_play.jpg`
    },
    to_training: {
      mirror: 'to_play'
    },
    play: {
      preload: ['play_to_main'],
      video: `${map}/shared/play.mp4`,
      image: `${map}/shared/play.jpg`
    },
    training: {
      mirror: 'play'
    },
    to_competitive: {
      transition: 'competitive',
      preload: ['competitive_to_play'],
      video: `${map}/shared/to_competitive.mp4`,
      image: `${map}/shared/to_competitive.jpg`
    },
    to_arcade: {
      mirror: 'to_competitive'
    },
    'to_vs-ai': {
      mirror: 'to_competitive'
    },
    competitive: {
      preload: ['competitive_to_play'],
      video: `${map}/shared/competitive.mp4`,
      image: `${map}/shared/competitive.jpg`
    },
    arcade: {
      mirror: 'competitive'
    },
    'vs-ai': {
      mirror: 'competitive'
    },
    competitive_to_play: {
      transition: ['play'],
      video: `${map}/shared/competitive_to_play.mp4`,
      image: `${map}/shared/competitive_to_play.jpg`
    },
    arcade_to_play: {
      mirror: 'competitive_to_play'
    },
    'vs-ai_to_play': {
      mirror: 'competitive_to_play'
    },
    'vs-ai_to_training': {
      mirror: 'competitive_to_play'
    },
    'to_hero-gallery': {
      transition: 'hero-gallery',
      preload: ['hero-gallery_to_main'],
      video: `${map}/shared/to_hero-gallery.mp4`,
      image: `${map}/shared/to_hero-gallery.jpg`
    },
    'hero-gallery': {
      preload: ['hero-gallery_to_main'],
      video: `${map}/shared/hero-gallery.mp4`,
      image: `${map}/shared/hero-gallery.jpg`
    },
    login: {
      preload: ['to_main'],
      video: false,
      image: 'shared/login.jpg'
    },
    // Hero specific backgrounds
    to_main: {
      transition: 'main',
      preload: ['to_play', 'to_hero-gallery']
    },
    main: {
      preload: ['to_play', 'to_hero-gallery']
    },
    play_to_main: {
      transition: 'main'
    },
    training_to_main: {
      mirror: 'play_to_main'
    },
    'hero-gallery_to_main': {
      transition: 'main'
    }
  };
};

const backgroundSets = {
  halloween: {
    reaper: mapBackgrounds('halloween'),
    mercy: mapBackgrounds('halloween')
  },
  hollywood: {
    tracer: mapBackgrounds('hollywood'),
    bastion: mapBackgrounds('hollywood')
  },
  volskaya: {
    widowmaker: mapBackgrounds('volskaya'),
    soldier76: mapBackgrounds('volskaya'),
    genji: mapBackgrounds('volskaya')
  },
  gibraltar: {
    winston: mapBackgrounds('gibraltar'),
    sombra: mapBackgrounds('gibraltar')
  },
  eichenwalde: {
    mccree: mapBackgrounds('eichenwalde'),
    roadhog: mapBackgrounds('eichenwalde')
  },
  hanamura: {
    reaper: mapBackgrounds('hanamura'),
    sombra: mapBackgrounds('hanamura')
  },
  kings_row: {
    reinhardt: mapBackgrounds('kings_row')
  },
  temple_of_anubis: {
    dva: mapBackgrounds('temple_of_anubis'),
    pharah: mapBackgrounds('temple_of_anubis')
  }
};

class OverwebsBackgroundData extends GluonElement {
  static get observedAttributes() {
    return ['select'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === 'select') {
      this.select = newValue;
    }
  }

  set select(select) {
    if (select !== this._select) {
      this._select = select;
      this._selectBackgrounds();
    }
  }

  get select() {
    return this._select;
  }

  set backgrounds(backgrounds) {
    if (backgrounds !== this._backgrounds) {
      this._backgrounds = backgrounds;
      this.dispatchEvent(new Event('backgrounds-changed'));
    }
  }

  get backgrounds() {
    return this._backgrounds;
  }

  set backgroundSelection(backgroundSelection) {
    if (backgroundSelection !== this._backgroundSelection) {
      this._backgroundSelection = backgroundSelection;
      this.dispatchEvent(new Event('backgroundSelection-changed'));
    }
  }

  get backgroundSelection() {
    return this._backgroundSelection;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.backgrounds) {
      this._selectBackgrounds();
    }
  }

  _selectBackgrounds() {
    // index all possible backgroundSets
    let index = this._index(backgroundSets);

    // If we want to select a specific backgroundSet
    if (this.select) {
      // Treat `this.select` as a literal string to match
      // let selectRegex = new RegExp(this.select.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      let selectRegex = new RegExp(this.select);
      // Limit our options to backgroundSets that match our selection
      index = index.filter(i => {
        return selectRegex.test(i);
      });
    }

    // Choose a random background from the selected options
    this.backgroundSelection = index[Math.floor(Math.random() * index.length)];

    // We weren't able to select anything
    if (!this.backgroundSelection) {
      console.warn('Could not select a backgroundSet');
      return;
    }

    // Get the data object from the backgroundSets
    let backgroundData = this.backgroundSelection
      .split('/')
      .slice(0, -1)
      .reduce((object, key) => {
        return object[key];
      }, backgroundSets);

    // Ok, we have selected backgroundData. Now we need to dynamically attach
    // video source locations, if those have not been added yet
    for (let background in backgroundData) {
      // If the background needs to mirror another one,
      // we don't have to do anything
      if (!backgroundData[background].mirror) {
        // Use the given sources if they are defined, otherwise infer the source
        let backgroundVideo = backgroundData[background].video || `${this.backgroundSelection}${background}.mp4`;
        backgroundVideo = `${assetPath}${backgroundVideo}`;
        let backgroundImage = backgroundData[background].image || `${this.backgroundSelection}${background}.jpg`;
        backgroundImage = `${assetPath}${backgroundImage}`;

        if (backgroundData[background].video !== false) {
          backgroundData[background].video = backgroundVideo;
        }
        backgroundData[background].image = backgroundImage;
      }
    }

    this.backgrounds = backgroundData;
  }

  _index(tree) {
    const result = [];
    for (let property in tree) {
      if (tree[property].transition || tree[property].preload) {
        return [''];
      }
      Array.prototype.push.apply(
        result,
        this._index(tree[property]).map(item => {
          return property + '/' + item;
        })
      );
    }
    return result;
  }
}

customElements.define(OverwebsBackgroundData.is, OverwebsBackgroundData);
