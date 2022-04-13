const set = require('../settings');
const text = require('../lib/text/text_id');

module.exports = async (client, event) => {
   const { id, formattedTitle, groupMetadata } = event;
   const { owner, participants } = groupMetadata;

   if (participants.length < 5 && !set.owner.includes(owner)) {
     await client.sendText(id, `_⚠️ Ooppss.. sorry Your group member is ${participants.length}, Bot can only be used in groups with 5 or more members!_`);
     return await client.leaveGroup(id);
   }

   return await client.sendText(id, text.menu);
};