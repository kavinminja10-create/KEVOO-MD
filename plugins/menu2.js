const config = require('../config');
const moment = require('moment-timezone');
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const { getPrefix } = require('../lib/prefix');

cmd({
    pattern: 'menu2',
    alias: ['panel', 'menus'],
    desc: 'Show button menu',
    category: 'menu',
    react: '👌',
    filename: __filename
},
    async (conn, mek, m, { from, sender, isGroup, reply }) => {
        try {
            const prefix = getPrefix();
            const time = moment().tz(config.TIMEZONE || 'Africa/Dodoma').format('HH:mm:ss');
            const date = moment().format('DD/MM/YYYY');

            const caption = `╔══════════════════════╗
   ✨ *KEVOO XD MENU PANEL* ✨
╚══════════════════════╝

👤 User: @${sender.split("@")[0]}
⏱ Runtime: ${runtime(process.uptime())}
🕒 ${time} | ${date}

_Select a menu below 👇_`;

            const listMessage = {
                text: caption,
                footer: `🌟 KEVOO MD Bot | ${config.OWNER_NAME} 🌟\n👤 User: @${sender.split('@')[0]}\n📅 ${time} • ${date}`,
                buttonText: "Select Menu",
                sections: [
                    {
                        title: "📋 Available Menus",
                        rows: [
                            { title: "🏠 Main Menu", rowId: `${prefix}menu`, description: "View all commands" },
                            { title: "⬇️ Download Menu", rowId: `${prefix}dlmenu`, description: "Download commands" },
                            { title: "👥 Group Menu", rowId: `${prefix}groupmenu`, description: "Group management" },
                            { title: "🤖 AI Menu", rowId: `${prefix}aimenu`, description: "AI features" },
                            { title: "🔍 Search Menu", rowId: `${prefix}searchmenu`, description: "Search tools" },
                            { title: "🎮 Fun Menu", rowId: `${prefix}funmenu`, description: "Fun commands" },
                            { title: "👑 Owner Menu", rowId: `${prefix}owner`, description: "Owner commands" },
                            { title: "📦 Other Menu", rowId: `${prefix}othermenu`, description: "Miscellaneous" }
                        ]
                    }
                ],
                contextInfo: { mentionedJid: [sender] },
                image: { url: config.MENU_IMAGE_URL || "https://files.catbox.moe/kbbm5e.jpg" },
                headerType: 1
            };

            await conn.sendMessage(from, listMessage, { quoted: mek });

        } catch (error) {
            console.error('Menu2 Error:', error);
            reply("❌ Error displaying menu. Please try again.");
        }
    }
);
