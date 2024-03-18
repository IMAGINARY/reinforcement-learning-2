// noinspection JSUnresolvedReference

class ObjectStore {
  constructor(fixedObjectsPath = null) {
    this.fixedObjects = [];
    this.userObjects = [];

    this.loadUserObjects();
    if (fixedObjectsPath) {
      // noinspection JSIgnoredPromiseFromCall
      this.loadFixedObjects(fixedObjectsPath);
    }
  }

  async loadFixedObjects(path) {
    fetch(path, { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        this.fixedObjects = data.mazes;
      });
  }

  loadUserObjects() {
    try {
      const userObjects = JSON.parse(localStorage.getItem('reinforcementLearning2.mazeStore.mazes'));
      if (userObjects) {
        this.userObjects = userObjects;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Unable to access local storage ${err}`);
    }
  }

  saveLocal() {
    try {
      localStorage.setItem('reinforcementLearning2.mazeStore.mazes', JSON.stringify(this.userObjects));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Unable to access local storage ${err}`);
    }
  }

  getAllObjects() {
    return {

      ...this.getAllUserObjects(),
      ...this.getAllFixedObjects(),
    };
  }

  getAllFixedObjects() {
    return Object.fromEntries(this.fixedObjects.map((obj, i) => [
      `F${i}`,
      obj,
    ]));
  }

  getAllUserObjects() {
    return Object.fromEntries(this.userObjects.map((obj, i) => [
      `L${i}`,
      obj,
    ]).reverse());
  }

  get(id) {
    if (id[0] === 'F') {
      return this.fixedObjects[id.substr(1)];
    }
    return this.userObjects[id.substr(1)];
  }

  set(id, obj) {
    if (id === null || this.userObjects[id.substr(1)] === undefined) {
      this.userObjects.push(obj);
    } else {
      this.userObjects[id.substr(1)] = obj;
    }
    this.saveLocal();
  }
}

module.exports = ObjectStore;
