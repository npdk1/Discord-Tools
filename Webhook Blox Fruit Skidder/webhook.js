process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;

const config = require("./config");

try {
    require.resolve("discord.js-selfbot-v13");
} catch (e) {
    console.log("Please run: `npm install discord.js-selfbot-v13`");
    process.exit(0);
}

try {
    require.resolve("discord.js");
} catch (e) {
    console.log("Please run: `npm install discord.js`");
    process.exit(0);
}

try {
    require.resolve("axios");
} catch (e) {
    console.log("Please run: `npm install axios`");
    process.exit(0);
}

const { Client } = require("discord.js-selfbot-v13");
const { WebhookClient, EmbedBuilder } = require("discord.js");
const client = new Client({
    partials: [
        "USER",
        "CHANNEL",
        "GUILD_MEMBER",
        "MESSAGE",
        "REACTION",
        "GUILD_SCHEDULED_EVENT",
    ],
    checkUpdate: false,
});

const anime = async function (embed) {
    if (!config.random_anime_picture) {
        return embed;
    }
    try {
        const { data: sex_alumi_hubb } = await require("axios").get(
            "https://i.imgur.com/I1qfyoF.jpeg"
        );
        embed.setImage(sex_alumi_hubb.url);
    } catch (error) {
        console.error("Error fetching anime picture:", error.message);
    }
    return embed;
};

client.on("ready", async () => {
    console.log(`Successfully: Code Started.`);
    client.user.setStatus("invisible");

    try {
        const owner = await client.users.fetch(config.ownerID);
        if (owner) {
            config.nameOwner = owner.tag;
        } else {
            console.warn(`User with ID ${config.ownerID} not found. Using default nameOwner.`);
        }
    } catch (error) {
        console.error(`Error fetching user with ID ${config.ownerID}:`, error.message);
    }
});

client.on("messageCreate", async (message) => {
    const channel = message.channelId;
    if (!message.embeds[0]) return; 

    const webhookPromises = [];

    for (const [type, noti] of Object.entries(config.notifications)) {
        if (channel === noti.channel_id && noti.enabled) {
            const promise = (async () => {
                try {
                    const webhook = new WebhookClient({ url: noti.webhook });
                    const originalEmbed = message.embeds[0];

                    const embed = new EmbedBuilder()
                        .setTitle(originalEmbed.title)
                        .setDescription(originalEmbed.description || null)
                        .setColor(originalEmbed.color || "ffffff")
                        .setTimestamp(originalEmbed.timestamp ? new Date(originalEmbed.timestamp) : Date.now())
                        .setURL(config.invite_discord);

                    embed.setFooter({
                        text: `Created By: @${config.nameOwner} • ${config.invite_discord}`,
                        iconURL: config.avtOwner || undefined,
                    });

                    if (originalEmbed.fields?.length) {
                        embed.addFields(originalEmbed.fields.map(field => ({
                            name: field.name,
                            value: field.value,
                            inline: field.inline || false
                        })));
                    }

                    if (originalEmbed.image) embed.setImage(originalEmbed.image.url);
                    if (originalEmbed.thumbnail) embed.setThumbnail(originalEmbed.thumbnail.url);

                    const finalEmbed = await anime(embed);

                    await webhook.send({
                        embeds: [finalEmbed],
                    });
                } catch (error) {
                    console.error(`Error sending webhook for ${type}:`, error.message);
                }
            })();

            webhookPromises.push(promise);
        }
    }

    await Promise.all(webhookPromises);
});

client.login(config.token);