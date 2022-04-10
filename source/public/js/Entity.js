// Entity class that holds entity data

const DEFAULT_SETTINGS = {
    animations: ['bounce', 'flip', 'wobble'],
    imageURL: './images/defaultImage.jpg'
}

export default class Entity {
    id;
    soundURL;
    imageURL;
    name;
    animations;
    // Constructor taking settings and applying to object
    constructor(settings) {
        // Takes the key values pairs that are passed in through the settings parameter, 
        // spreads the settings into an Array and loops through them,
        // assigns the "value" to the equivalent "key" on the entity object(this)
        Object.entries({ ...DEFAULT_SETTINGS, ...settings }).forEach(([key, value]) => {
            this[key] = value
        })
    }

    set name(value) {
        this.name = value;
    }
}