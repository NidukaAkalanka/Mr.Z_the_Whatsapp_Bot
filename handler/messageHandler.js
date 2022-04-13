const { decryptMedia } = require('@open-wa/wa-automate');
const moment = require('moment');
const set = require('../settings');

// Library
const _function = require('../lib/function');
const _txt = require('../lib/text');
const color = require('../util/colors');

module.exports = async (client, message) => {
  try {
    const msgAmount = await client.getAmountOfLoadedMessages();
    if (msgAmount > 3000) await client.cutMsgCache();

    const { id, body, mimetype, type, t, from, sender, content, caption, author, isGroupMsg, chat, quotedMsg, quotedMsgObj, mentionedJidList } = message;
    const { name, shortName, pushname, formattedName } = sender;
    const { formattedTitle, isGroup, contact, groupMetadata } = chat;

    const botOwner = set.owner;
    const botGroup = set.support;
    const botPrefix = set.prefix;
    const botNumber = (await client.getHostNumber()) + '@c.us';

    const isAdmin = groupMetadata ? groupMetadata.participants.find((res) => res.id === sender.id).isAdmin : undefined;
    const isOwner = groupMetadata ? groupMetadata.participants.find((res) => res.id === sender.id).isSuperAdmin : undefined;
    const isBotAdmin = groupMetadata ? groupMetadata.participants.find((res) => res.id === botNumber).isAdmin : undefined;

    const validMessage = caption ? caption : body;
    if (!validMessage || validMessage[0] != botPrefix) return;

    const command = validMessage.trim().split(' ')[0].slice(1);
    const arguments = validMessage.trim().split(' ').slice(1);
    const senderId = sender.id.split('@')[0] || from.split('@')[0];
    const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

    // debug
    console.debug(color('green', '➜'), color('yellow', isGroup ? '[GROUP]' : '[PERSONAL]'), `!${command} | ${sender.id} ${isGroup ? 'FROM ' + formattedTitle : ''}`, color('yellow', moment().format()));

    if (isGroup) {
      if (groupMetadata.participants.length < 5 && !botOwner.includes(groupMetadata.owner)) {
        await client.reply(from, `_⚠️ Ooops... sorry to avoid SPAM groups, bots can only be used in groups with more than 10 members, while your group only has *${groupMetadata.participants.length}*_\n\n_For more information please ask me on instagram *@niduka_akalanka_*_`, id);
        return client.leaveGroup(from);
      }
    }

    const allChats = await client.getAllChats();
    switch (command) {
      case 'resetlimit':
        break;

      case 'unblock':
        if (senderId !== botOwner) return await client.reply(from, '_⛔ The command you are referring to can only be used by Owner bot!_', id);
        await client.contactUnblock(arguments[0] + 'c.us');
        return await client.reply(from, '_🟢 Succeeded *Unblock* user!_', id);
        break;

      case 'leaveall':
        if (senderId !== botOwner) return await client.reply(from, '_⛔ The command you are referring to can only be used by Owner bot!_', id);
        const allGroups = await client.getAllGroups();
        allGroups.forEach(async (group) => {
          if (!group.id !== botGroup) {
            await client.leaveGroup(group.id);
          }
        });
        return await client.reply(from, '_🟢 Bot Successfully exited all existing groups!_', id);
        break;

      case 'resetrank':
        break;

      case 'owner':
      case 'contact':
      case 'ownerbot':
        return await client.reply(from, '_👋 Hi, Let us communicate with the owner, Instagram : *@niduka_akalanka_*_', id);
        break;

      case 'clearall':
        if (senderId !== botOwner) return await client.reply(from, '_⛔ The command you are referring to can only be used by Owner bot!_', id);
        allChats.forEach(async (chat) => {
          await client.clearChat(chat.id);
        });
        return await client.reply(from, '_🟢 Successfully Cleared History Message Bot!_', id);
        break;

      case 'bc':
        if (senderId !== botOwner) return await client.reply(from, '_⛔ The command you are referring to can only be used by Owner bot!_', id);
        if (arguments.length < 1) return;
        await allChats.forEach(async (chat) => {
          await client.sendText(chat.id, arguments.join(' '));
        });
        return await client.reply(from, '_🟢 Successfully Broadcast all Chat List Bot!_', id);
        break;

      case 'premium':
        break;

      case 'tire':
        
        break;

      case 'freespace':
        
        break;

      case 'kickall':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (!isOwner) return await client.reply(from, '_⛔ This command can only be used by *Owner* group only!_', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ Bot *Must* be *Admin* to use this command!_', id);
        await client.reply(from, '_😏 Command executed! Hope you know what you are doing!_', id);
        await groupMetadata.participants.forEach(async (participant) => {
          if (!participant.isSuperAdmin) await client.removeParticipant(from, participant.id);
        });
        break;

      case 'start':
        
        break;

      case 'toxic':
       
        break;

      case 'add':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ This command can only be used by *Admin* group only!_', id);
        if (arguments.length !== 1) client.reply(from, '_⚠️ Example of command use : !add 62812....._', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ This command can only be used when *Bot is Admin* in this group!_', id);
        const isNumberValid = await client.checkNumberStatus(arguments[0] + '@c.us');
        if (isNumberValid.status === 200)
          await client
            .addParticipant(from, isNumberValid.id._serialized)
            .then(async () => await client.reply(from, '_🎉 Successfully added Member, Welcome!_', id))
            .catch(async (error) => await client.reply(from, '_🥺 Failed to add member! Possibly member has been blocked by bot! For unblocking please DM to *@niduka_akalanka_* on Instagram_', id));
        break;

      case 'kick':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ This command can only be used by *Admin* group only!_', id);
        if (mentionedJidList.length !== 1) client.reply(from, '_⚠️ Example of command use : !kick @mention_', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ This command can only be used when *Bot is Admin* in this group!_', id);
        const isKicked = await client.removeParticipant(from, mentionedJidList[0]);
        if (isKicked) return await client.reply(from, '_🎉 Successfully Kick member Say Goodbye!_', id);
        break;

      case 'promote':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ This command can only be used by *Admin* group only!_', id);
        if (mentionedJidList.length !== 1) client.reply(from, '_⚠️ Example of command use : !promote @mention_', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ This command can only be used when *Bot is Admin* in this group!_', id);
        const isPromoted = await client.promoteParticipant(from, mentionedJidList[0]);
        if (isPromoted) return await client.reply(from, '_🎉 Successfully promoted member to Admin/Group Administrator! Congratulations_', id);
        break;

      case 'demote':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (!isAdmin) return await client.reply(from,'_⛔ This command can only be used by Admin group only!_' , id);
        if (mentionedJidList.length !== 1) client.reply(from, '_⚠️ Example of command use : !demote @mention_', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ This command can only be used when *Bot is Admin* in this group!_', id);
        const isDemoted = await client.demoteParticipant(from, mentionedJidList[0]);
        if (isDemoted) return await client.reply(from, '_🎉 Successfully demote Admin to Member! Say Pity!_', id);
        break;

      case 'revoke':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ This command can only be used by *Admin* group only!_', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ This command can only be used when *Bot is Admin* in this group!_', id);
        await client
          .revokeGroupInviteLink(from)
          .then(async (res) => await client.reply(from, '_🎉 Successfully Reset Group Invite Link! use !link to get Group invite Link_', id))
          .catch((error) => console.log('revoke link error!'));
        break;

      case 'link':
      case 'invitelink':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ This command can only be used by *Admin* group only!_', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ This command can only be used when *Bot is Admin* in this group!_', id);
        await client
          .getGroupInviteLink(from)
          .then(async (inviteLink) => await client.reply(from, `_🔗 Group Invite Link : *${inviteLink}*_`, id))
          .catch((error) => console.log('Invite link error'));
        break;

      case 'startvote':
        
        break;

      case 'disconnect':
      case 'kickbot':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ This command can only be used by *Admin* group only!_', id);
        client
          .reply(from, '_👋 Thank you, for the memories we had so far, if you miss it, do not add me to your group again! I will always be there for you!_', id)
          .then(async() => await client.leaveGroup(from))
          .catch((error) => console.log('kickbot error'));
        break;

      case 'notif':
        
        break;

      case 'adminmode':
      case 'silent':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ This command can only be used by *Admin* group only!_', id);
        if (arguments.length !== 1) return await client.reply(from, '_⚠️ Example of using Command : !silent on|off_', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ This command can only be used when *Bot is Admin* in this group!_', id);
        const isSilent = await client.setGroupToAdminsOnly(from, arguments[0].toLowerCase() === 'on');
        if (isSilent) return await client.reply(from, `_🎉 Successfully set to-group *${arguments[0].toLowerCase() === 'on' ? 'Admin Mode' : 'Everyone Mode'}*_ `, id);
        break;

      case 'p':
      case 'ping':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        const allMembers = groupMetadata.participants.map((member) => `@${member.id.split('@')[0]}`);
        await client.sendTextWithMentions(from, `_😏 Summoning Technique!_\n\n${allMembers.join('\n')}\n\n_🧒🏻 Follow Developer instagram *@niduka_akalanka_*, to get more information about Bots!_`);
        break;

      case 'votekick':
        
        break;

      case 'voteinfo':
        
        break;

      case 'vote':
       
        break;

      case 'gjodoh':
      case 'matchme':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        let countMember = groupMetadata.participants.length;
        let randomNumber = Math.floor(Math.random() * (countMember - 1) + 1);
        const randomMembers = groupMetadata.participants[randomNumber];
        const isSenderNumber = randomMembers.id === sender.id;
        await client.sendTextWithMentions(from, isSenderNumber ? `_👬🏼 Yes! You can't find your soul mate in this group, just gay_` : `_❤️ Matchmaking @${sender.id.split('@')[0 ]} you are in this group is @${randomMembers.id.split('@')[0]}_`);
        break;

      case 'groupstats':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        let { owner, creation, participants, desc } = groupMetadata;
        const creationTime = moment.unix(creation);
        await client.sendTextWithMentions(from, `_📃 Group Information_\n\n_Name : ${formattedTitle}_\n_Owner : @${owner.split('@')[0]}_\n_Total Member : ${participants.length }_\n_Date Created : ${creationTime.format('DD MMMM YYYY')}_\n_Created Hour : ${creationTime.format('HH:mm:ss')}_\n_Description : ${desc ? desc : ' '}_`, id);
        break;

      case 'kickme':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (isOwner) return await client.reply(from, '_⛔ Owner group/Handsome people can not be kicked!_', id);
        await client.reply(from, '_😏 I hope you know what you are doing!_', id);
        await client.removeParticipant(from, sender.id);
        break;

      case 'mystats':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        const senderPicture = sender.profilePicThumbObj.eurl ? sender.profilePicThumbObj.eurl : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        await client.sendImage(from, senderPicture, formattedName, `_🎉 Group Member [ *${formattedTitle}* ]_\n\n_Name : ${pushname ? pushname : 'Unknown'}_\n_Owner Status : ${isOwner ? 'Yes' : 'No'}_\n_Admin Status : ${isAdmin ? 'Yes' : 'No'}_`, id);
        break;

      case 'rob':
        
        break;

      case 'richman':
        
        break;

      case 'pick':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (arguments.length < 1) return await client.reply(from, '_Example of command use : !pick <sifat>_', id);
        const pickSomeone = groupMetadata.participants[Math.floor(Math.random() * groupMetadata.participants.length)];
        await client.sendTextWithMentions(from, `_👦🏼 ${arguments.join(' ')} in this group is @${pickSomeone.id.split('@')[0]}_`);
        break;

      case 'voice':
        if (arguments.length < 1) return await client.reply(from, '_⚠️ Example of Command Usage: !voice <code> <sentence>_', id);
        const voiceUrl = _function.voiceUrl(arguments);
        await client.sendPtt(from, voiceUrl, id);
        break;

      case 'menu':
        return await client.reply(from, _txt.menu, id);
        break;

      case 'info':
        return await client.reply(from, _txt.info, id);

       case 'source':
        return await client.reply(from, _txt.source, id);

      case 'rules':
        return await client.reply(from, _txt.rules, id);
        break;

      case 'faq':
        return await client.reply(from, _txt.faq, id);
        break;

      case 'support':
        await client.addParticipant(botGroup, sender.id);
        return await client.reply(from, 'You have been added to this Official Bot Group!');
        break;

      case 'donate':
      case 'donasi':
        return await client.reply(from, _txt.donate, id);
        break;

case 'quotes':
        break;

       case 'makequote':
        if (arguments.join(' ').split('@').length < 2) return await client.reply(from, '_⚠️ Example of Command Usage : !makequote <name>@<sentence>_', id) ;
        const getMakequote = _function.makequote(arguments);
        await client.sendImage(from, getMakequote, sender.id, '', id);
        break;

      case 'mirip':
        if (mentionedJidList.length > 0 || arguments.length < 1) return await client.reply(from, '_⚠️ Example Command Usage: !similar to <name>_', id);
        const listName = ['Udin', 'Uzumaki Bayu', 'Saburo', 'Saruto', 'Yang Lek', 'Uchiha Roy', 'Corrupt DPR, fat and brainless fat', 'Monkey', 'Cage thief' , 'Inner Thief'];
        await client.reply(from, `_👦🏼 *${arguments.join(' ')}* Similar to ${listName[Math.floor(Math.random() * listName.length)]}_`, id) ;
        break;

      case 'gay':
        if (mentionedJidList.length > 0 || arguments.length < 1) return await client.reply(from, '_⚠️ Example Command Usage: !gay <name>_', id);
        const gayPercentage = Math.floor(Math.random() * 100);
        await client.reply(from, `_👬🏻 Gay level *${arguments.join(' ')}* of ${gayPercentage}%_`, id);
        break;

      case 'brainly':
        if (arguments.length < 1) return client.reply(from, '_⚠️ Example of Command Usage : !brainly <pertanyaan>_', id);
        const getBrainly = await _function.brainly(arguments.join(' '));
        await client.reply(from, getBrainly, id);
        break;

      case 'sticker':
      case 'stiker':
        if (!mimetype) return await client.reply(from, '_⚠️ Example of Command Usage: send an image that you want to use as a sticker then give caption !sticker_', id);
        if (!mimetype.includes('image')) return await client.reply(from, '_⚠️ Make sure you sent the correct image (gambar)_', id);
        const imagemediadata = await decryptMedia(message);
        const imageb64 = `data:${mimetype};base64,${imagemediadata.toString('base64')}`;
        await client.sendImageAsSticker(from, imageb64);
        break;

      case 'gifsticker':
      case 'gifstiker':
        if (!mimetype) return await client.reply(from, '_⚠️ Example of Command Usage: send a short video that you want to use as a sticker then give the caption !gifsticker_', id);
        if (!mimetype.includes('mp4')) return await client.reply(from, '_⚠️ Make sure you send a video file with extension mp4_', id);
        const vidmediadata = await decryptMedia(message);
        const vidb64 = `data:${mimetype};base64,${vidmediadata.toString('base64')}`;
        await client.sendMp4AsSticker(from, vidb64, { fps: 10, startTime: `00:00:00.0`, endTime: `00:00:05.0`, loop: 0 });
        break;

      case 'giphysticker':
      case 'giphystiker':
        if (arguments.length < 1) return await client.reply(from, '_⚠️ Example of Command Usage : !giphysticker <giphy url/link>_', id);
        if (!arguments[0].match(urlRegex)) return await client.reply(from, '_⚠️ Make sure you send the correct url_', id);
        await client.sendGiphyAsSticker(from, arguments[0]);
        break;

      case 'bucin':
        const katabucin = await _function.bucin();
        await client.reply(from, katabucin, id);
        break;

      case 'mate':
        const matchSplit = arguments.join(' ').split('&');
        if (mateSplit.length < 2) return await client.reply(from, '_⚠️ Example of Command Usage: !mate <your name>&<someone name>_');
        const matePercentage = Math.floor(Math.random() * 100);
        await client.reply(from, `_💖 Percentage match ${mateSplit[0]} & ${mateSplit[1]} ${matePercentage}_`, id);
        break;

      case 'hitme':
        
        break;

      case 'hitrank':
       
        break;

      case 'music':
      case 'music':
        if (arguments.length < 1) return await client.reply(from, '_⚠️ Example of Command Usage:!music <title>_', id);
        const musicLink = await _function.youtubeMusic(arguments.join(' '));
        if (!musicLink) return await client.reply(from, '_⚠️ Make sure the music you want is under 10 minutes!_', id);
        await client.sendPtt(from, musicLink, id);
        break;

      case 'downtiktok':
        return await client.reply(from, '_🛑 Feature in progress!_', id);
        break;

      case 'downtwitter':
        return await client.reply(from, '_🛑 Feature in progress_', id);
        break;

      case 'downfacebook':
        return await client.reply(from, '_🛑 Feature in progress_', id);
        break;

      case 'downinstagram':
        return await client.reply(from, '_🛑 Feature in progress_', id);
        break;

      case 'lyrics':
      case 'lyrics':
        if (arguments.length < 1) return await client.reply(from, '_⚠️ Example of Command Usage : !lirik <song title>_', id);
        const getLyrics = await _function.lyrik(arguments.join(' '));
        if (!getLyrics) return await client.reply(from, `_🥺 Lyrics *${arguments.join(' ')}* Not Found!_`, id);
        await client.reply(from, getLyrics, id);
        break;

      case 'short':
        if (arguments.length < 1) return await client.reply(from, '_⚠️ Example of Command Usage : !short <url/link you want to reduce>_', id);
        const getShortener = await _function.short(arguments[0]);
        await client.reply(from, `_${getShortener}_`, id);
        break;

      case 'corona':
      case 'covid':
        const getCovid = await _function.covid(arguments.join(' '));
        await client.reply(from, getCovid || '_⚠️ The country you are referring to does not appear to be registered!_', id);
        break;

      case 'cat':
        const getCat = await _function.cat();
        await client.sendImage(from, getCat || 'https://cdn2.thecatapi.com/images/uvt2Psd9O.jpg', `${t}_${sender.id}.jpg`, '', id);
        break;

      case 'dog':
        const getDog = await _function.dog();
        await client.sendImage(from, getDog || 'https://images.dog.ceo/breeds/cattledog-australian/IMG_3668.jpg', `${t}_${sender.id}.jpg`, '' , id);
        break;

      case 'meme':
        const getMeme = await _function.meme();
        await client.sendFile(from, getMeme.picUrl || 'https://i.redd.it/5zm5i8eqw5661.jpg', `${t}_${sender.id}.${getMeme.ext}`, '', id);
        break;

      case 'anime':
        if (arguments.length < 1) return await client.reply(from, '_Usage : !anime <title>_', id);
        const getAnime = await _function.anime(arguments.join(' '));
        await client.sendImage(from, getAnime.picUrl, `${t}_${sender.id}.jpg`, getAnime.caption, id);
        break;

      case 'stikernobg':
        return await client.reply(from, '_⚠️ Features Repair/work process!_', id);
        break;

      case 'stickertottext':
      case 'stikerteks':
        if (arguments.length < 1) return await client.reply(from, '_⚠️ Example of Command Usage : !stickertext <sentence>_', id);
        const textLink = _function.tosticker(arguments);
        await client.sendStickerfromUrl(from,textLink);
        break;

      case 'wikipedia':
      case 'wiki':
        if (arguments.length < 1) return await client.reply(from, '_⚠️ Example of Command Usage : !wiki <keywords>_', id);
        const getWiki = await _function.wiki(arguments.join(' '));
        if (!getWiki) return await client.reply(from, `_⚠️ *${arguments.join(' ')}* on Wikipedia not found_`, id);
        await client.sendImage(from, getWiki.picUrl, `${t}_${sender.id}.jpg`, getWiki.caption, id);
        break;

      case 'imagequote':
        const getImagequote = await _function.imgquote();
        await client.sendImage(from, getImagequote, `${t}_${sender.id}.jpg`, '', id);
        break;

      case 'join':
        if (arguments.length < 1) return await client.reply(from, '_⚠️ Example of Command Usage : !join <group link>_', id);
        const joinStatus = await client.joinGroupViaLink(arguments[0]);
        if (joinStatus === 406) return await client.reply(from, '_⚠️ Make sure you enter the correct group URL!_', id);
        if (joinStatus === 401) return await client.reply(from, '_⚠️ Bot Can not Join, because recently bot just kicked from the group!_', id);
        await client.reply(from, '_🚀 Launch! Bot successfully entered group!_', id);
        break;

      case 'roll':
        const rollNumber = Math.floor(Math.random() * (6 - 1) + 1);
        await client.sendStickerfromUrl(from, `https://www.random.org/dice/dice${rollNumber}.png`);
        break;

      case 'weather':
      case 'cuaca':
        if (arguments.length < 1) return await client.reply(from, '_⚠️ Example of Command Usage : !weather <city name>_', id);
        const getWeather = await _function.weather(arguments.join(' '));
        await client.reply(from, getWeather, id);
        break;

      case 'movie':
        if (arguments.length< 1) return await client.reply(from, '_⚠️ Example of Command Usage : !movie <title>_', id);
         const getMovie = await _function.movie(arguments.join(' '));
         if (!getMovie) return await client.reply(from, `_⚠️ ${arguments.join(' ')} Not found!_`, id);
         await client.sendImage(from, getMovie.moviePicture, `${t}_${sender.id}.jpeg`, getMovie.movieCaption, id);
         break;

       default:
         return console.debug(color('red', '➜'), color('yellow', isGroup ? '[GROUP]' : '[PERSONAL]'), `!${command} | ${sender.id} ${isGroup ? 'FROM ' + formattedTitle : ''}`, color('yellow', moment().format()));
     }

     return;
   } catch(err) {
     console.log(err);
   }
};