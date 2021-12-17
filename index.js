const { Plugin } = require('powercord/entities');

module.exports = class Bread extends Plugin {
    startPlugin() {
      powercord.api.commands.registerCommand({
        command: 'bread',
        description: 'Get bread image',
        usage: '{c} [--send]',
        executor: async (args) => {
          const send = args.includes('--send');

          const response = await fetch('https://source.unsplash.com/random/?bread');
          const bread = await this.loadImage(response.url);
          let result = '';

          if (!response.ok || !bread) {
            result = 'Unable to get bread, try again later.'
          } else {
            result = send ? bread.src : {
              image: {
                url: bread.src,
                width: bread.width,
                height: bread.height,
              },
              footer: { // Doesn't display in embed without title.
                text: 'Image from Unsplash'
              }
            }
          }
          
          return {
            send,
            result
          }
        }
      });
    }

    pluginWillUnload() {
        powercord.api.commands.unregisterCommand('bread');
    }

    loadImage(src) {
      return new Promise(async (resolve, reject) => {
        const img = new Image();

        img.onload = () => {
          resolve(img);
        }
        img.onerror = reject;
        
        img.crossOrigin = 'Anonymous'
        img.src = src;
      });
    }
}
