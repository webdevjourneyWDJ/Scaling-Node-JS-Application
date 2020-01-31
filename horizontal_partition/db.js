const { LocalStorage } = require('node-localstorage')

const dbA = new LocalStorage('data-a-m')
const dbB = new LocalStorage('data-n-z')

const whichDB = name => name.match(/^[A-M]|^[a-m]/) ? dbA : dbB

const loadDogs = db => JSON.parse(db.getItem("dogs") || '[]')

const hasDog = name => loadDogs(whichDB(name))
    .map(dog => dog.name)
    .includes(name)

module.exports = {

    addDog(newDog) {
        if (!hasDog(newDog.name)) {
            let db = whichDB(newDog.name)
            let dogs = loadDogs(db)
            dogs.push(newDog)
            db.setItem("dogs", JSON.stringify(dogs, null, 2))
        }
    },

    findDogByName(name) {
        let db = whichDB(name)
        let dogs = loadDogs(db)
        return dogs.find(dog => dog.name === name)
    },

    findDogsByColor(color) {
        return [
            ...loadDogs(dbA).filter(dog => dog.color === color),
            ...loadDogs(dbB).filter(dog => dog.color === color)
        ]
    }

}
