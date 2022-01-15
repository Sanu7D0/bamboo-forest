export default class TextContainer {
  constructor() {
    this.texts = [];
  }

  get textsJson() {
    return JSON.stringify(this.texts);
  }

  onVoiceData(voiceText) {
    this.addText(voiceText);
  }

  addText(text) {
    for (const char of text) {
      this.texts.push(char);
    }
    console.log(`Received: ${text}, total: ${this.texts.length}`);
  }

  clearTexts() {
    this.texts = [];
  }
}
