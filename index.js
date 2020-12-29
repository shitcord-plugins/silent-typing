import { Plugin } from '@vizality/entities';
import { getModule } from '@vizality/webpack';

const typingModule = getModule('startTyping', 'stopTyping');

export default class SilentTyping extends Plugin {
  onStart () {
    this._startTyping = typingModule.startTyping;
    typingModule.startTyping = () => void 0;
  }

  onStop () {
    typingModule.startTyping = this._startTyping;
  }
};
