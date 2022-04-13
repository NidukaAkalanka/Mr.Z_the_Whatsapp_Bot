module.exports = async (client, event) => {
   const { action, who, chat } = event;

   const botNumber = await client.getHostNumber();

   if (action === 'add') {
     console.log('bug!!!!');
   } else {
     if (who === botNumber) return;
     return await client.sendTextWithMentions(chat, `Goodbye @${who.split('@')[0]} welcome to the almighty side`);
   }
};