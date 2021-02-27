import { Plugin } from '@vizality/entities';
import { patch, unpatch } from '@vizality/patcher';
import { findInReactTree } from '@vizality/util/react';
import { getModule } from '@vizality/webpack';
import TypingIcon from './components/typingIcon';
import React from 'react';

const ChannelTextAreContainer = getModule(m => m?.type?.render?.displayName === 'ChannelTextAreaContainer')?.type
const typingModule = getModule('startTyping', 'stopTyping');

export default class SilentTyping extends Plugin {
   unpatches = [];
   
   start() {
      this.unpatches.push(
         this.patchChannelTextArea(),
         this.patchTypingModule()
      );

      this.injectStyles('style.scss');
   }
      
   patchTypingModule() {
      let oldStartTyping = typingModule.startTyping;
      
      typingModule.startTyping = channelId => {
         if (!channelId) return false;
         if (this.settings.get('excludeChannels', []).indexOf(channelId) < 0) return false;
         oldStartTyping(channelId);
      };

      return () => typingModule.startTyping = oldStartTyping;
   }

   removeChannel = channelId => {
      const settings = this.settings.get('excludeChannels', []);
      if (settings.indexOf(channelId) < 0) return;
      settings.splice(settings.indexOf(channelId), 1);
      this.settings.set('excludeChannels', settings);
   }

   addChannel = channelId => {
      const settings = this.settings.get('excludeChannels', []);
      if (settings.indexOf(channelId) > -1) return;
      this.settings.set('excludeChannels', settings.concat(channelId));
   }

   patchChannelTextArea() {
      patch('silent-typing-textarea', ChannelTextAreContainer, 'render', ([{channel, textValue}], res) => {
         const tree = findInReactTree(res, e => e?.className?.indexOf('buttons') > -1);
         if (!Array.isArray(tree?.children)) return res;

         
         tree.children.unshift(
            <TypingIcon
               settings={this.settings}
               addChannel={this.addChannel}
               removeChannel={this.removeChannel}
               channel={channel}
               textValue={textValue}
               typingModule={typingModule}
            />
         );

         return res;
      });

      return () => unpatch('silent-typing-textarea');
   }

   stop() {
      for (const unpatch of this.unpatches) unpatch();
   }
};
