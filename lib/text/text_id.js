const prefix = require('../../settings').prefix;

const menu = `
*❤---꧁༺ʍʀ.ʐ ɮօȶ༻꧂--❤* 
Developed by 
*_𝒩𝒾𝒹𝓊𝓀𝒶 𝒜𝓀𝒶𝓁𝒶𝓃𝓀𝒶_*

█▓▒­░⡷⠂DΞV'S MΞДДSДGΞ⠐⢾░▒▓█
Have a critique/suggestion or want to request a feature? or want to ask about bots? Please follow Instagram Developer *@niduka_akalanka_* or contact him for any furthur assistances.

█▓▒­░⡷⠂GЦIDДИCΞ⠐⢾░▒▓█
Use the *${prefix}rules* command to see the rules for using bots and *${prefix}faq* to see some answers for some frequently asked questions.
 
█▓▒­░⡷⠂CФMMДИDS⠐⢾░▒▓█

*෴groupGroup Command෴*

${prefix}kickall
${prefix}add [62812...]
${prefix}kick [@mention]
⌖ ${prefix}promote [@mention]
${prefix}demote [@mention]
${prefix}revoke
${prefix}link
${prefix}silent [on|off]

${prefix}ping
${prefix}gmatch
${prefix}groupstats
${prefix}kickme
${prefix}mystats
${prefix}pick [Handsome]

*෴General Commands෴*

${prefix}menu
${prefix}rules
${prefix}info
${prefix}faq
${prefix}support

*෴Fun Command෴*

⌖ ${prefix}quote
${prefix}voice [Text]
${prefix}makequote [name@sentence]
${prefix}similar to [person's name]
${prefix}gay [person's name]
${prefix}bucin
${prefix}cat
${prefix}dog
${prefix}meme
${prefix}roll
${prefix}imagequote
${prefix}mate [name&name]

*෴Educational Order෴*

${prefix}brainly [question]
${prefix}wiki [query]

*෴Sticker Command෴*

${prefix}sticker
${prefix}gifsticker
⌖ ${prefix}giphysticker [giphy url]
${prefix}text sticker [Sentence]

*෴Music Command෴*

${prefix}music [Title]
${prefix}lyrics [Title]
${prefix}short [URL]
${prefix}covid [Country]

*෴Other Commands෴*

${prefix}anime [Title]
${prefix}join [Group Link]
${prefix}weather [City]
${prefix}movie [Title]
${prefix}contact
`;

const rules = `
█▓▒­░⡷⠂ЦSДGΞ ЯЦLΞS⠐⢾░▒▓█
+All Responsibility is left to the user
+Only use bots as needed, don't use them as a tool for SPAM
+Never call Bots

*Note*
If you violate the rules above, the user will be blocked banned by the bot upon the bot owner's orders. Users will no longer be able to use the bot!
Please contact the Developer on Instagram *@niduka_akalanka_* for any furthur assistances
`;

const info = `
█▓▒­░⡷⠂ЦPDДΓΞS⠐⢾░▒▓█
Currently: 0.1 Beta
The bot is still under the constructions. There's a lot to come
`;

const faq = `
█▓▒­░⡷⠂FДǪS⠐⢾░▒▓█

*How to use Bot?*
Send a message using ${prefix} at the beginning of the command to a personal message Bot or to a Group that contains the Bot

*What can Bots do?*
Users can see what commands can be performed by the bot by sending a command message ${prefix}menu

*Who made this Bot?*
Let's get acquainted via Instagram *@niduka_akalanka_*
`;

module.exports = { menu, rules, info, faq };