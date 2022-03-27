// Entity class that holds entity data
export default class Entity {
    soundURL;
    imageURL;
    name;
// Constructor taking settings and applying to object
    constructor(settings) {
        // Takes the key values pairs that are passed in through the settings parameter, 
        // spreads the settings into an Array and loops through them,
        // assigns the "value" to the equivalent "key" on the entity object(this)
        Object.entries({...settings}).forEach(([key, value]) => {
            this[key] = value
        })
    }

    set name(value) {
        this.name = value;
    }
}