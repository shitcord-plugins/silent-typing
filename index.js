const { Plugin } = require('@vizality/entities');
const { getModule } = require('@vizality/webpack');

const typingModule = getModule('startTyping', 'stopTyping');

module.exports = class SilentTyping extends Plugin {
  onStart () {
    this._startTyping = typingModule.startTyping;
    typingModule.startTyping = () => void 0;
  }

  onStop () {
    typingModule.startTyping = this._startTyping;
  }
};
