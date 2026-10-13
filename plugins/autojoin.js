uconst { cmd } = require("../command");
const config = require("../config");

// Auto join when bot receives group invite
cmd({
    on: "group-invite"
}, async (conn, mek, m, { reply }) => {
    try {
        const inviteCode = m?.messageStubParameters?.[0];
        const groupJid = m?.messageStubParameters?.[1] + "@g.us";
        
        if (!inviteCode) return;
        
        console.log(`📨 Group invite received: ${groupJid}`);
        
        // Try to accept the invite
        try {
            await conn.groupAcceptInvite(inviteCode);
            console.log(`✅ Successfully auto-joined group: ${groupJid}`);
            
            // Send welcome message to the group
            await conn.sendMessage(groupJid, {
                text: `✅ *KEVOO MD Bot Joined*\n\n👋 Hello! I'm KEVOO MD Bot\n\n📋 Type .menu to see all available commands\n\n🔗 Group Link Setup Complete!\n\n*Happy using the bot😅!*`
            });
            
        } catch (joinErr) {
            console.error(`❌ Failed to auto-join group ${groupJid}:`, joinErr.message);
        }
        
    } catch (error) {
        console.error("Autojoin error:", error);
    }
});

// Command to enable/disable autojoin from GROUP_LINK
cmd({
    pattern: "autojoin",
    alias: ["autogroup"],
    desc: "Enable/disable autojoin from GROUP_LINK config",
    category: "admin",
    react: "🔗",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, isOwner, isDev }) => {
    try {
        if (!isOwner && !isDev) {
            return reply("❌ Only bot owner can use this command");
        }

        if (!q || !q.trim()) {
            const status = config.GROUP_LINK ? "Enabled" : "Disabled";
            return reply(`ℹ️ *Autojoin Status:* ${status}\n\n*Commands:*\n.autojoin enable - Enable autojoin\n.autojoin disable - Disable autojoin\n.autojoin test - Test autojoin with current GROUP_LINK`);
        }

        const action = q.toLowerCase().trim();

        if (action === "test") {
            if (!config.GROUP_LINK) {
                return reply("❌ GROUP_LINK is not set in config");
            }

            await conn.sendMessage(from, {
                react: { text: "⏳", key: mek.key }
            });

            try {
                // Extract group code from link
                const linkMatch = config.GROUP_LINK.match(/https:\/\/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
                if (!linkMatch) {
                    return reply("❌ Invalid GROUP_LINK format in config");
                }

                const groupCode = linkMatch[1];
                await conn.groupAcceptInvite(groupCode);

                await conn.sendMessage(from, {
                    react: { text: "✅", key: mek.key }
                });

                return reply(`✅ *Successfully joined group!*\n\n🔗 Link: ${config.GROUP_LINK}`);

            } catch (testErr) {
                await conn.sendMessage(from, {
                    react: { text: "❌", key: mek.key }
                });

                let errorMsg = "❌ Failed to join group:\n\n";
                if (testErr.message.includes("already")) {
                    errorMsg += "Already a member of this group";
                } else if (testErr.message.includes("suspended")) {
                    errorMsg += "Group has been suspended";
                } else if (testErr.message.includes("not found")) {
                    errorMsg += "Invalid or expired link";
                } else {
                    errorMsg += testErr.message;
                }
                return reply(errorMsg);
            }
        } else if (action === "enable") {
            return reply("ℹ️ Autojoin is managed via GROUP_LINK in config\n\nSet GROUP_LINK=your_link in config.env to enable autojoin");
        } else if (action === "disable") {
            return reply("ℹ️ To disable autojoin, remove GROUP_LINK from config.env");
        }

        reply("❌ Invalid action. Use: .autojoin test, .autojoin enable, or .autojoin disable");

    } catch (error) {
        console.error("Autojoin command error:", error);
        reply(`❌ Error: ${error.message}`);
    }
});

// Command to join group from link
cmd({
    pattern: "joingroup",
    alias: ["addgroup"],
    desc: "Join a WhatsApp group from invite link",
    category: "group",
    use: ".joingroup <group_link>",
    react: "🔗",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, isOwner, isDev }) => {
    try {
        if (!isOwner && !isDev) {
            return reply("❌ Only bot owner can use this command");
        }

        if (!q) {
            return reply("📋 *Usage:* .joingroup <group_link>\n\n*Example:*\n.joingroup https://chat.whatsapp.com/xxxxxxxxxxxx");
        }

        await conn.sendMessage(from, {
            react: { text: "⏳", key: mek.key }
        });

        // Extract group code from link
        const linkMatch = q.match(/https:\/\/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
        if (!linkMatch) {
            return reply("❌ Invalid WhatsApp group link format\n\n*Expected:* https://chat.whatsapp.com/xxxxxxxxxxxx");
        }

        const groupCode = linkMatch[1];

        try {
            await conn.groupAcceptInvite(groupCode);

            await conn.sendMessage(from, {
                react: { text: "✅", key: mek.key }
            });

            return reply(`✅ *Successfully joined group!*\n\n🔗 Group Code: ${groupCode}`);

        } catch (joinErr) {
            await conn.sendMessage(from, {
                react: { text: "❌", key: mek.key }
            });

            let errorMsg = "❌ Failed to join group:\n\n";
            
            if (joinErr.message.includes("already")) {
                errorMsg += "🤖 Already a member of this group";
            } else if (joinErr.message.includes("suspended")) {
                errorMsg += "🚫 Group has been suspended";
            } else if (joinErr.message.includes("not found") || joinErr.message.includes("404")) {
                errorMsg += "🔍 Invalid or expired invite link";
            } else if (joinErr.message.includes("closed")) {
                errorMsg += "🔒 Group is closed (you cannot join)";
            } else if (joinErr.message.includes("restricted")) {
                errorMsg += "⚠️ Group is restricted (you cannot join)";
            } else {
                errorMsg += joinErr.message || "Unknown error occurred";
            }

            return reply(errorMsg);
        }

    } catch (error) {
        console.error("Join group command error:", error);
        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });
        reply(`❌ Error: ${error.message}`);
    }
});
