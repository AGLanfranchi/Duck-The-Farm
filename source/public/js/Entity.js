// Entity class that holds entity data
export default class Entity {
    soundURL;
    imageURL;
    name;
// Constructor taking settings and applying to object
    constructor(settings) {
        Object.entries({...settings}).forEach(([key, value]) => {
            this[key] = value
        })
    }

    set name(value) {
        this.name = value;
    }
}