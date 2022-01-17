import { deleteOldestText } from "../server.js";

const MAX_TEXT = 10;

export default class TextContainer {
  constructor() {
    this.textsQueue = [];
  }

  get textsJson() {
    return JSON.stringify(this.textsQueue);
  }

  addText(obj) {
    if (this.textsQueue.length >= MAX_TEXT) {
      let oldId = this.textsQueue.shift().id;
      deleteOldestText(oldId);
      console.log(`Deleted: ${oldId} / ${this.textsQueue.length}`);
    }

    this.textsQueue.push({
      text: obj.text,
      id: obj.id,
    });

    console.log(`Received: ${obj.text} / ${this.textsQueue.length}`);
  }
}
