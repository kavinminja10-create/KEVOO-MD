const { cmd } = require('../command');
const { getPrefix } = require('../lib/prefix');
const config = require('../config');
const moment = require('moment-timezone');
const { runtime } = require('../lib/functions');

cmd({
    pattern: 'menu3',
    alias: ['menu3', 'hmenu'],
    desc: 'Show compact menu',
    category: 'menu',
    react: '📋',
    filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
    try {
        const prefix = getPrefix();
        const time = moment().tz(config.TIMEZONE || 'Africa/Dodoma').format('HH:mm:ss');
        const date = moment().format('DD/MM/YYYY');

        const menuText = `╭─❒ *KEVOO MD COMPACT MENU* ❒─╮
│
├─ 👤 *User:* @${sender.split("@")[0]}
├─ ⏱️ *Uptime:* ${runtime(process.uptime())}
├─ 🕒 *Time:* ${time} | ${date}
├─ 🔧 *Prefix:* ${prefix}
│
├─ 📋 *Available Menus:*
│
├─ 🏠 *${prefix}menu* - Main commands
├─ ⬇️ *${prefix}dlmenu* - Downloads
├─ 👥 *${prefix}groupmenu* - Group tools
├─ 🤖 *${prefix}aimenu* - AI features
├─ 🔍 *${prefix}searchmenu* - Search tools
├─ 🎮 *${prefix}funmenu* - Fun commands
├─ 👑 *${prefix}owner* - Owner panel
├─ 📦 *${prefix}othermenu* - Other tools
│
╰─❒ *${config.OWNER_NAME}* ❒─╯

> *Type any command to use it* ✨`;

        const contextInfo = {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true
        };

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || "https://files.catbox.moe/kbbm5e.jpg" },
            caption: menuText,
            contextInfo: contextInfo
        }, { quoted: mek });

    } catch (error) {
        console.error('Menu3 Error:', error);
        reply('❌ An error occurred while displaying the menu.');
    }
});
