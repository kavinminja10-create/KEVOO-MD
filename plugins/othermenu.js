const { cmd } = require('../command');
const { getPrefix } = require('../lib/prefix');
const config = require('../config');
const moment = require('moment-timezone');

cmd({
    pattern: 'othermenu',
    alias: ['other'],
    desc: 'Show all Other commands',
    category: 'other',
    react: '📁',
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const prefix = getPrefix();
        const time = moment().tz(config.TIMEZONE || 'Africa/Dodoma').format('HH:mm:ss');
        const date = moment().tz(config.TIMEZONE || 'Africa/Dodoma').format('dddd, DD MM YYYY');

        const otherRows = [
            { title: "Bot Info", rowId: `${prefix}botinfo`, description: "Get bot information" },
            { title: "Owner Info", rowId: `${prefix}owner`, description: "Bot owner information" },
            { title: "Ping", rowId: `${prefix}ping`, description: "Check bot ping" },
            { title: "Alive", rowId: `${prefix}alive`, description: "Check bot status" }
        ];

        const listMessage = {
            text: "*📁 OTHER MENU*\n\nSelect a command below:",
            footer: `🌟 KEVOO MD Bot | Kevoo Tech 🌟\n👤 User: @${sender.split('@')[0]}\n📅 ${time} • ${date}`,
            buttonText: "Open Other Menu",
            sections: [{ title: "Other Commands", rows: otherRows }],
            headerType: 1,
            contextInfo: { mentionedJid: [sender] },
            image: { url: "https://files.catbox.moe/kbbm5e.jpg" }
        };

        await conn.sendMessage(from, listMessage, { quoted: mek });

    } catch (e) {
        console.error('Other Menu Error:', e);
        await reply(`❌ Error: ${e.message}`);
    }
});
