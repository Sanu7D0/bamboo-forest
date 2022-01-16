const MAX_TEXT = 10;

export default class TextContainer {
  constructor() {
    this.textsQueue = [];
  }

  get textsJson() {
    return JSON.stringify(this.textsQueue);
  }

  onVoiceData(voiceText) {
    this.addText(voiceText);
  }

  addText(text) {
    if (this.textsQueue.length >= MAX_TEXT) {
      this.textsQueue.shift();
    }

    this.textsQueue.push(text);

    console.log(`Received: ${text}`);
  }
}
