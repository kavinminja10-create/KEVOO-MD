const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "ping",
    alias: ["speed", "pong", "ping2"],
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, sender, reply }) => {
        try {
            const start = Date.now();
            const loading = await conn.sendMessage(from, { text: '*Pinging...*' });

            // small reaction for flair
            try { await conn.sendMessage(from, { react: { text: '⚡', key: mek.key } }) } catch (e) { }

            const end = Date.now();
            const latency = end - start; // ms
            const up = runtime(process.uptime());

            const caption = `╭─❒ *${config.BOT_NAME}* ❒─╮
│
├─ ⚡ *Pong!* ${['🚀', '🌟', '💫', '🔥'][Math.floor(Math.random() * 4)]}
├─ 📶 *Latency:* _${latency} ms_
├─ ⏱️ *Uptime:* _${up}_
│
╰─❒ *${config.OWNER_NAME}* ❒─╯

> *Powered by KEVOO MD* ✨`;

            await conn.sendMessage(from, {
                image: { url: config.MENU_IMAGE_URL },
                caption: caption,
                contextInfo: { mentionedJid: [sender] }
            }, { quoted: loading }).catch(() => {
                // fallback to text only
                conn.sendMessage(from, { text: caption }, { quoted: loading }).catch(() => { });
            });

        } catch (e) {
            console.error("Error in ping command:", e);
            reply(`An error occurred: ${e.message}`);
        }
    });
