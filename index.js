import { Plugin } from '@vizality/entities';
import { getModule } from '@vizality/webpack';

const typingModule = getModule('startTyping', 'stopTyping');

export default class SilentTyping extends Plugin {
  start () {
    this._startTyping = typingModule.startTyping;
    typingModule.startTyping = () => void 0;
  }

  stop () {
    typingModule.startTyping = this._startTyping;
  }
};
