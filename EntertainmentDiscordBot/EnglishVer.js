// Import required Discord.js modules
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder } = require('discord.js');

// Centralized config (token is hardcoded here and used everywhere)
const config = {
  token: 'bottoken', // Hardcoded token
};

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Image config based on percentage ranges
const imageConfig = {
  flirt: {
    low: 'https://media.tenor.com/iXq_oSpqtssAAAAM/sad-sad-face.gif', // 1-20% (total mismatch)
    medium: 'https://images7.memedroid.com/images/UPLOADED814/59b74483cca34.jpeg', // 21-50% (meh, try harder)
    high: 'https://encrypted-tbn0.gstatic.com/images?q=tbn9GcS6Qiuxnthgi3BiX6reEFiWHAQrpSTJZ6Mthw&s', // 51-80% (not bad, kinda hot)
    veryHigh: 'https://encrypted-tbn0.gstatic.com/images?q=tbn9GcTYmTUfxWp4Mg6Q8-dFBx9GB0Nl4TLaNM7l7w&s', // 81-100% (f*cking soulmates)
  },
  match: {
    low: 'https://media.tenor.com/iXq_oSpqtssAAAAM/sad-sad-face.gif', // 1-20% (total mismatch)
    medium: 'https://images7.memedroid.com/images/UPLOADED814/59b74483cca34.jpeg', // 21-50% (meh, try harder)
    high: 'https://encrypted-tbn0.gstatic.com/images?q=tbn9GcS6Qiuxnthgi3BiX6reEFiWHAQrpSTJZ6Mthw&s', // 51-80% (not bad, kinda hot)
    veryHigh: 'https://encrypted-tbn0.gstatic.com/images?q=tbn9GcTYmTUfxWp4Mg6Q8-dFBx9GB0Nl4TLaNM7l7w&s', // 81-100% (f*cking soulmates)
  },
  howgay: {
    low: 'https://encrypted-tbn0.gstatic.com/images?q=tbn9GcRLwl_y_y6T-4Qaf2iq7iARbe_tNTIAsEhUpA&s', // 1-20% (straight as a ruler)
    medium: 'https://64.media.tumblr.com/f298e1d3d548b188e6ba500611bb4990/tumblr_mfdgiqmZxx1rqcu9eo1_500.jpg', // 21-50% (a bit fruity)
    high: 'https://i.imgflip.com/1q8rdu.jpg?a483528', // 51-80% (pretty damn gay)
    veryHigh: 'https://pbs.twimg.com/media/E7GHBjKWQAEMdmm.jpg', // 81-100% (full-on rainbow warrior)
  },
  funny: [
    'https://images7.memedroid.com/images/UPLOADED765/5a6cf7cb08199.jpeg', // Wi-Fi meme
    'https://encrypted-tbn0.gstatic.com/images?q=tbn9GcTVIWGMBmjVFII2bo4JndrRaM527YI84ILzQQ&s', // Bubble tea meme
    'https://encrypted-tbn0.gstatic.com/images?q=tbn9GcQCp39g7UkyMdYKuziwYIW72qGYNJ_dCQCoMg&s', // Random funny meme
  ],
  dance: [
    'https://media.tenor.com/YL8KBcr0Am4AAAAe/dancing-lit.png', // Lit dancing
    'https://media.tenor.com/9xx5jJaHPpIAAAAM/fat-guy.gif', // Funny dance
    'https://media.tenor.com/S634LoO_WJ8AAAAM/remymane.gif', // Cute dance
  ],
  game: {
    guess: 'https://i.pinimg.com/564x/8r/9s/0t/8r9s0t1u2v3w4x5y6z7a.jpg', // Random number image
    taixiu: 'https://i.pinimg.com/564x/9s/0t/1u/9s0t1u2v3w4x5y6z7a8b.jpg', // Dice image
    trivia: [
      'https://i.pinimg.com/564x/0t/1u/2v/0t1u2v3w4x5y6z7a8b9c.jpg', // Cat image
      'https://i.pinimg.com/564x/1u/2v/3w/1u2v3w4x5y6z7a8b9c0d.jpg', // Rubber band image
      'https://i.pinimg.com/564x/2v/3w/4x/2v3w4x5y6z7a8b9c0d1e.jpg', // Air image
    ],
    rps: 'https://i.pinimg.com/564x/3w/4x/5y/3w4x5y6z7a8b9c0d1e2f.jpg', // Rock-paper-scissors image
    typing: [
      'https://i.pinimg.com/564x/4x/5y/6z/4x5y6z7a8b9c0d1e2f3g.jpg', // Keyboard image
      'https://i.pinimg.com/564x/5y/6z/7a/5y6z7a8b9c0d1e2f3g4h.jpg', // Typing race image
      'https://i.pinimg.com/564x/6z/7a/8b/6z7a8b9c0d1e2f3g4h5i.jpg', // Encouragement image
    ],
    win: 'https://i.imgflip.com/2dpztf.jpg', // Victory image
    lose: 'https://media.tenor.com/0yYc6cK8cwQAAAAM/black-happy.gif', // Loss image
    timeout: 'https://media.tenor.com/QBFbmd3FTiIAAAAM/im-rich-smile.gif', // Timeout image
  },
};

// Entertainment content lists
const loveQuotes = [
  { quote: "I ain’t giving you the whole damn world, but I’ll shove my pathetic heart down your throat to love and protect your sorry ass. 💕", color: "#FF69B4" },
  { quote: "My heart was a f*cking wasteland until your annoying ass showed up like a goddamn tsunami and made shit bloom. 🌸", color: "#FFB6C1" },
  { quote: "Bitch, it’s freezing out here, so say you love me already—my heart’s about to explode waiting for your dumb ass! 💓", color: "#FF1493" },
  { quote: "I’m dogshit at math, but I can plan a future where I’m banging your fine ass every damn day. 💍", color: "#FF4500" },
  { quote: "Every time you smile, my whole shitty world lights up—stop f*cking with my head, you little tease! ✨", color: "#FFD700" },
];

const flirtyQuotes = [
  { quote: "Hey slut, got a map? ‘Cause I’m lost as f*ck in those slutty eyes of yours. 😘", color: "#FF69B4" },
  { quote: "My heart’s empty as shit—wanna move your skanky ass in? 💋", color: "#FF1493" },
  { quote: "I can’t give you the world, but I’ll make you scream all night, you desperate hoe. 😏", color: "#FF4500" },
  { quote: "Are you coffee? ‘Cause I couldn’t sleep thinking about your whorish ass all night. ☕❤️", color: "#FFB6C1" },
  { quote: "I’m no photographer, but I can picture us f*cking in a perfect love story, you thirsty bitch. 📸💕", color: "#FFD700" },
];

const funnyQuotes = [
  { quote: "Life’s like Wi-Fi—you never know where the f*ck you are on that shitty signal bar, you dumbass. 📶" },
  { quote: "Money can’t buy happiness, but it buys bubble tea, and that’s close enough for your broke ass. 🧋" },
  { quote: "My face is ugly as a dog’s ass, but the structure’s on point—like a goddamn public toilet. 🚽" },
];

const danceMoves = [
  { move: "💃 Moonwalking like Michael Jackson, smoother than your pathetic ass will ever be, you talentless f*ck! 💃" },
  { move: "🕺 Spinning like a f*cking ceiling fan—blowing everyone away while you sit there like a jealous piece of shit! 🕺" },
  { move: "👯 Doing the chicken dance, clucking like a little bitch—cute as hell, but you’re still a loser! 👯" },
];

// Trivia questions
const triviaQuestions = [
  { question: "What goes 'meow meow' but isn’t a cat, you brain-dead f*ck?", answer: "A cat pretending to be a dog, you absolute moron" },
  { question: "What gets longer when you pull it and shorter when you let go, you filthy-minded bastard?", answer: "A rubber band, you sick f*ck" },
  { question: "What’s see-through, can’t be held, but everyone needs it, you clueless dipshit?", answer: "Air, you brainless piece of trash" },
];

// Typing challenges
const typingChallenges = [
  { challenge: "Type this shit fast if you don’t wanna look like a complete f*cking loser, you slow-ass bitch!" },
  { challenge: "Whoever types faster wins, you ready or what, you pathetic little shit?" },
  { challenge: "This one’s long as f*ck, but you can do it—don’t be a useless pussy!" },
];

// Smart logic for compatibility percentage
const getCompatibilityMessage = (percentage) => {
  if (percentage <= 20) {
    return "You two are a f*cking disaster—go find someone else, you miserable pieces of shit! 😅";
  } else if (percentage <= 50) {
    return "You two are a goddamn mess—try harder or you’ll both die alone, you pathetic f*cks! 💪";
  } else if (percentage <= 80) {
    return "You two are kinda hot together—don’t f*ck it up, you horny bastards! ❤️";
  } else {
    return "Holy f*ck, you two are meant to bang—congrats, you disgusting lovebirds! 💕";
  }
};

// Smart logic for gay percentage with savage insults
const getGayMessage = (percentage) => {
  if (percentage <= 20) {
    return "You’re straight as a f*cking ruler—boring as shit, you basic-ass bitch! 📏";
  } else if (percentage <= 50) {
    return "You’re a bit fruity, but still a lame-ass straight wannabe, you confused f*ck! 😏";
  } else if (percentage <= 80) {
    return "You’re pretty f*cking gay, but still clinging to some straight-ass bullshit, you half-assed queer! 🌈";
  } else {
    return "You’re a full-on rainbow-slut, you cock-sucking queen—f*cking own it, you fabulous piece of shit! 🏳️‍🌈";
  }
};

// Function to select image based on percentage
const getImageByPercentage = (config, percentage) => {
  if (percentage <= 20) return config.low;
  if (percentage <= 50) return config.medium;
  if (percentage <= 80) return config.high;
  return config.veryHigh;
};

// When the bot is ready
client.once('ready', async () => {
  console.log(`Bot ${client.user.tag} is online, you worthless f*cks! ID: ${client.user.id}`);

  const commands = [
    new SlashCommandBuilder()
      .setName('flirt')
      .setDescription('Send a flirty or romantic message to some desperate hoe')
      .addStringOption(option =>
        option.setName('style')
          .setDescription('Pick your flirting style, you thirsty bastard')
          .setRequired(true)
          .addChoices(
            { name: 'Romantic', value: 'romantic' },
            { name: 'Flirty', value: 'flirty' },
          ))
      .addUserOption(option =>
        option.setName('target')
          .setDescription('Who you wanna hit on, you horny f*ck')
          .setRequired(true)),
    new SlashCommandBuilder()
      .setName('funny')
      .setDescription('Send a dumbass quote to make you laugh, you pathetic clown'),
    new SlashCommandBuilder()
      .setName('match')
      .setDescription('Match two desperate f*cks together')
      .addUserOption(option =>
        option.setName('person1')
          .setDescription('First pathetic loser')
          .setRequired(true))
      .addUserOption(option =>
        option.setName('person2')
          .setDescription('Second pathetic loser')
          .setRequired(true)),
    new SlashCommandBuilder()
      .setName('dance')
      .setDescription('Bot will dance like a crazy motherf*cker'),
    new SlashCommandBuilder()
      .setName('game')
      .setDescription('Play a stupid-ass mini-game, you bored f*ck')
      .addStringOption(option =>
        option.setName('type')
          .setDescription('Pick a game type, you lazy shit')
          .setRequired(true)
          .addChoices(
            { name: 'Guess Number', value: 'guess' },
            { name: 'High-Low', value: 'taixiu' },
            { name: 'Trivia', value: 'trivia' },
            { name: 'Rock-Paper-Scissors', value: 'rps' },
            { name: 'Typing Race', value: 'typing' },
          )),
    new SlashCommandBuilder()
      .setName('howgay')
      .setDescription('Check how gay some dumbass is')
      .addUserOption(option =>
        option.setName('target')
          .setDescription('Who you wanna check, you nosy f*ck')
          .setRequired(true)),
  ].map(command => command.toJSON());

  const rest = new REST({ version: '10' }).setToken(config.token);

  try {
    console.log('Syncing slash commands, you impatient piece of shit...');
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );
    console.log('Commands synced, you ungrateful bastard!');
  } catch (error) {
    console.error(error);
  }
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'flirt') {
    const style = options.getString('style');
    const target = options.getUser('target');
    let selectedQuote;

    if (style === 'romantic') {
      selectedQuote = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
    } else if (style === 'flirty') {
      selectedQuote = flirtyQuotes[Math.floor(Math.random() * flirtyQuotes.length)];
    }

    if (!selectedQuote) {
      await interaction.reply({
        content: 'F*cked up already! Pick "Romantic" or "Flirty", you brain-dead slut!',
        ephemeral: true,
      });
      return;
    }

    const lovePercentage = Math.floor(Math.random() * 100) + 1;
    const compatibilityMessage = getCompatibilityMessage(lovePercentage);
    const image = getImageByPercentage(imageConfig.flirt, lovePercentage);

    const embed = new EmbedBuilder()
      .setTitle('💘 Flirt Like a F*cking Pro, You Horny Bitch 💘')
      .setDescription(`${target}, ${selectedQuote.quote}\n\n**Match Rate:** ${lovePercentage}%\n${compatibilityMessage}`)
      .setColor(selectedQuote.color)
      .setImage(image)
      .setFooter({ text: `Sent by ${interaction.user.username}, the thirstiest f*ck alive ❤️` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'funny') {
    const randomIndex = Math.floor(Math.random() * funnyQuotes.length);
    const randomFunny = funnyQuotes[randomIndex];
    const image = imageConfig.funny[randomIndex];

    const embed = new EmbedBuilder()
      .setTitle('😂 Dumbass Quote to Make Your Sorry Ass Laugh 😂')
      .setDescription(randomFunny.quote)
      .setColor('#FFFF00')
      .setImage(image)
      .setFooter({ text: `Sent by ${interaction.user.username}, the biggest f*cking clown around` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'match') {
    const person1 = options.getUser('person1');
    const person2 = options.getUser('person2');

    if (person1.id === person2.id) {
      await interaction.reply({
        content: 'You can’t match someone with their own pathetic ass, you brain-dead f*ck! 😅',
        ephemeral: true,
      });
      return;
    }

    const lovePercentage = Math.floor(Math.random() * 100) + 1;
    const compatibilityMessage = getCompatibilityMessage(lovePercentage);
    const image = getImageByPercentage(imageConfig.match, lovePercentage);

    const embed = new EmbedBuilder()
      .setTitle('💞 Matchmaking Results, You Disgusting F*cks 💞')
      .setDescription(`Congrats to ${person1} and ${person2} for being matched, you horny bastards! ❤️\n**Match Rate:** ${lovePercentage}%\n${compatibilityMessage}`)
      .setColor(lovePercentage > 50 ? '#FF69B4' : '#FF4500')
      .setImage(image)
      .setFooter({ text: 'Don’t f*ck this up, you pathetic lovebirds! 💕' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'dance') {
    const randomIndex = Math.floor(Math.random() * danceMoves.length);
    const randomDance = danceMoves[randomIndex];
    const image = imageConfig.dance[randomIndex];

    const embed = new EmbedBuilder()
      .setTitle('💃 Dance Like a Crazy Motherf*cker! 🕺')
      .setDescription(randomDance.move)
      .setColor('#00CED1')
      .setImage(image)
      .setFooter({ text: `Performed by ${interaction.user.username}, the shittiest dancer alive` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'howgay') {
    const target = options.getUser('target');
    const gayPercentage = Math.floor(Math.random() * 100) + 1;
    const gayMessage = getGayMessage(gayPercentage);
    const image = getImageByPercentage(imageConfig.howgay, gayPercentage);

    const embed = new EmbedBuilder()
      .setTitle('🌈 How F*cking Gay Are You, You Little Bitch? 🌈')
      .setDescription(`${target}, your gay level is: **${gayPercentage}%**\n${gayMessage}`)
      .setColor(gayPercentage > 50 ? '#FF69B4' : '#1E90FF')
      .setImage(image)
      .setFooter({ text: `Checked by ${interaction.user.username}, the nosiest f*cking asshole` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'game') {
    const gameType = options.getString('type');

    if (gameType === 'guess') {
      const secretNumber = Math.floor(Math.random() * 100) + 1;
      let attempts = 0;

      const embed = new EmbedBuilder()
        .setTitle('🎲 Mini-Game: Guess the F*cking Number, You Dumbass 🎲')
        .setDescription('I’ve picked a number from **1 to 100**. You’ve got 100 tries to guess it, you pathetic piece of shit! Type your guess in the chat!')
        .setColor('#1E90FF')
        .setImage(imageConfig.game.guess)
        .setFooter({ text: 'Start typing, you slow-ass motherf*cker!' });

      await interaction.reply({ embeds: [embed] });

      const filter = m => m.author.id === interaction.user.id && !isNaN(m.content) && m.content >= 1 && m.content <= 100;
      const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

      collector.on('collect', async m => {
        attempts++;
        const guess = parseInt(m.content);

        if (guess === secretNumber) {
          const winEmbed = new EmbedBuilder()
            .setTitle('🎉 Holy F*ck, You Actually Won, You Lucky Bastard! 🎉')
            .setDescription(`You guessed the number **${secretNumber}** after **${attempts}** tries, you cheating piece of shit!`)
            .setColor('#32CD32')
            .setImage(imageConfig.game.win)
            .setTimestamp();
          await interaction.followUp({ embeds: [winEmbed] });
          collector.stop();
        } else if (guess < secretNumber) {
          await interaction.followUp('Your guess is **too f*cking low**, you brain-dead moron! Try again! ⬆️');
        } else {
          await interaction.followUp('Your guess is **too f*cking high**, you clueless dipshit! Try again! ⬇️');
        }

        if (attempts >= 100) {
          const loseEmbed = new EmbedBuilder()
            .setTitle('💔 Out of Tries, You F*cking Suck! 💔')
            .setDescription(`The number was **${secretNumber}**. Better luck next time, you absolute failure of a human!`)
            .setColor('#FF0000')
            .setImage(imageConfig.game.lose)
            .setTimestamp();
          await interaction.followUp({ embeds: [loseEmbed] });
          collector.stop();
        }
      });

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          const timeoutEmbed = new EmbedBuilder()
            .setTitle('⏰ Time’s Up, You Useless F*ck!')
            .setDescription(`You ran out of time, you slow-ass bitch! The number was **${secretNumber}**.`)
            .setColor('#FF4500')
            .setImage(imageConfig.game.timeout)
            .setTimestamp();
          interaction.followUp({ embeds: [timeoutEmbed] });
        }
      });
    }

    if (gameType === 'taixiu') {
      const result = Math.random() < 0.5 ? 'High' : 'Low';
      const embed = new EmbedBuilder()
        .setTitle('🎰 High-Low, You Broke-Ass Gambler! 🎰')
        .setDescription(`Result: **${result}** 🎲\nWanna go again, you desperate f*ck?`)
        .setColor(result === 'High' ? '#FFD700' : '#FF4500')
        .setImage(imageConfig.game.taixiu)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }

    if (gameType === 'trivia') {
      const randomIndex = Math.floor(Math.random() * triviaQuestions.length);
      const question = triviaQuestions[randomIndex];
      const image = imageConfig.game.trivia[randomIndex];

      const embed = new EmbedBuilder()
        .setTitle('🧠 Trivia Time, You Brain-Dead F*ck! 🧠')
        .setDescription(`Question: **${question.question}**\nYou’ve got 30 seconds to answer, you dumb piece of shit! Type your answer in the chat!`)
        .setColor('#FFA500')
        .setImage(image)
        .setFooter({ text: 'Think hard, you f*cking idiot!' });

      await interaction.reply({ embeds: [embed] });

      const filter = m => m.author.id === interaction.user.id;
      const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

      collector.on('collect', async m => {
        const userAnswer = m.content.toLowerCase();
        if (userAnswer === question.answer.toLowerCase()) {
          const winEmbed = new EmbedBuilder()
            .setTitle('🎉 Holy F*ck, You Got It Right, You Lucky Bastard! 🎉')
            .setDescription(`The answer is: **${question.answer}**! You’re not as f*cking stupid as you look! 🧠`)
            .setColor('#32CD32')
            .setImage(imageConfig.game.win)
            .setTimestamp();
          await interaction.followUp({ embeds: [winEmbed] });
          collector.stop();
        } else {
          await interaction.followUp('Wrong, you f*cking moron! Try again, dipshit! 🤔');
        }
      });

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          const timeoutEmbed = new EmbedBuilder()
            .setTitle('⏰ Time’s Up, You Useless Piece of Shit!')
            .setDescription(`The answer was: **${question.answer}**. See you next time, you brain-dead f*ck!`)
            .setColor('#FF4500')
            .setImage(imageConfig.game.timeout)
            .setTimestamp();
          interaction.followUp({ embeds: [timeoutEmbed] });
        }
      });
    }

    if (gameType === 'rps') {
      const choices = ['rock', 'paper', 'scissors'];
      const botChoice = choices[Math.floor(Math.random() * choices.length)];
      const embed = new EmbedBuilder()
        .setTitle('✂️ Rock-Paper-Scissors, You F*cking Loser! ✂️')
        .setDescription('Pick: **rock**, **paper**, or **scissors**! You’ve got 15 seconds, don’t f*ck it up, you dumbass!')
        .setColor('#1E90FF')
        .setImage(imageConfig.game.rps)
        .setFooter({ text: 'Hurry the f*ck up, you slow bitch!' });

      await interaction.reply({ embeds: [embed] });

      const filter = m => m.author.id === interaction.user.id && choices.includes(m.content.toLowerCase());
      const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

      collector.on('collect', async m => {
        const userChoice = m.content.toLowerCase();
        let result;

        if (userChoice === botChoice) {
          result = 'It’s a f*cking tie! We both picked **' + botChoice + '**, you boring piece of shit! 😅';
        } else if (
          (userChoice === 'rock' && botChoice === 'scissors') ||
          (userChoice === 'paper' && botChoice === 'rock') ||
          (userChoice === 'scissors' && botChoice === 'paper')
        ) {
          result = `You win, you cheating f*ck! You picked **${userChoice}**, I picked **${botChoice}**. 🎉`;
        } else {
          result = `You lose, you pathetic bitch! You picked **${userChoice}**, I picked **${botChoice}**. Suck my dick! 😢`;
        }

        const resultEmbed = new EmbedBuilder()
          .setTitle('✂️ Rock-Paper-Scissors Results, You F*cking Loser ✂️')
          .setDescription(result)
          .setColor(result.includes('win') ? '#32CD32' : result.includes('tie') ? '#FFFF00' : '#FF4500')
          .setImage(result.includes('win') ? imageConfig.game.win : result.includes('tie') ? imageConfig.game.rps : imageConfig.game.lose)
          .setTimestamp();
        await interaction.followUp({ embeds: [resultEmbed] });
        collector.stop();
      });

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          const timeoutEmbed = new EmbedBuilder()
            .setTitle('⏰ Time’s Up, You Slow-Ass F*ck!')
            .setDescription('You didn’t pick in time, you lazy piece of shit! I picked **' + botChoice + '**. Play again, you useless bastard!')
            .setColor('#FF4500')
            .setImage(imageConfig.game.timeout)
            .setTimestamp();
          interaction.followUp({ embeds: [timeoutEmbed] });
        }
      });
    }

    if (gameType === 'typing') {
      const randomIndex = Math.floor(Math.random() * typingChallenges.length);
      const challenge = typingChallenges[randomIndex];
      const image = imageConfig.game.typing[randomIndex];

      const embed = new EmbedBuilder()
        .setTitle('⌨️ Typing Race, You Slow-Ass Motherf*cker! ⌨️')
        .setDescription(`Type this shit as fast as you can:\n**${challenge.challenge}**\nYou’ve got 20 seconds, don’t f*ck it up, you useless bitch!`)
        .setColor('#FF69B4')
        .setImage(image)
        .setFooter({ text: 'Get your pathetic ass typing, you slow f*ck!' });

      await interaction.reply({ embeds: [embed] });

      const startTime = Date.now();
      const filter = m => m.author.id === interaction.user.id && m.content === challenge.challenge;
      const collector = interaction.channel.createMessageCollector({ filter, time: 20000 });

      collector.on('collect', async m => {
        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000; // Time in seconds

        const winEmbed = new EmbedBuilder()
          .setTitle('🎉 Holy F*ck, You Actually Won, You Slow-Ass Bitch! 🎉')
          .setDescription(`You typed that shit in **${timeTaken} seconds**! Not bad for a f*cking moron! 🚀`)
          .setColor('#32CD32')
          .setImage(imageConfig.game.win)
          .setTimestamp();
        await interaction.followUp({ embeds: [winEmbed] });
        collector.stop();
      });

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          const timeoutEmbed = new EmbedBuilder()
            .setTitle('⏰ Time’s Up, You F*cking Loser!')
            .setDescription('You couldn’t type in time, you slow-ass piece of shit! Try harder next time, you pathetic f*ck! 😅')
            .setColor('#FF4500')
            .setImage(imageConfig.game.timeout)
            .setTimestamp();
          interaction.followUp({ embeds: [timeoutEmbed] });
        }
      });
    }
  }
});

// Log in the bot using the token from config
client.login(config.token);
