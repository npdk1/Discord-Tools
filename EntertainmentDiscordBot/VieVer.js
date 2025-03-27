// Nhập các module cần thiết từ Discord.js
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder } = require('discord.js');

// Cấu hình tập trung (token được hardcode tại đây và dùng ở mọi nơi)
const config = {
  token: 'tokenbot', // Token hardcode
};

// Khởi tạo client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Cấu hình hình ảnh theo tỷ lệ phần trăm
const imageConfig = {
  totinh: {
    low: 'https://media.tenor.com/iXq_oSpqtssAAAAM/sad-sad-face.gif', // 1-20% (không hợp)
    medium: 'https://images7.memedroid.com/images/UPLOADED814/59b74483cca34.jpeg', // 21-50% (cần cố gắng)
    high: 'https://encrypted-tbn0.gstatic.com/images?q=tbn9GcS6Qiuxnthgi3BiX6reEFiWHAQrpSTJZ6Mthw&s', // 51-80% (khá hợp)
    veryHigh: 'https://encrypted-tbn0.gstatic.com/images?q=tbn9GcTYmTUfxWp4Mg6Q8-dFBx9GB0Nl4TLaNM7l7w&s', // 81-100% (rất hợp)
  },
  ghepdoi: {
    low: 'https://media.tenor.com/iXq_oSpqtssAAAAM/sad-sad-face.gif', // 1-20% (không hợp)
    medium: 'https://images7.memedroid.com/images/UPLOADED814/59b74483cca34.jpeg', // 21-50% (cần cố gắng)
    high: 'https://encrypted-tbn0.gstatic.com/images?q=tbn9GcS6Qiuxnthgi3BiX6reEFiWHAQrpSTJZ6Mthw&s', // 51-80% (khá hợp)
    veryHigh: 'https://encrypted-tbn0.gstatic.com/images?q=tbn9GcTYmTUfxWp4Mg6Q8-dFBx9GB0Nl4TLaNM7l7w&s', // 81-100% (rất hợp)
  },
  howgay: {
    low: 'https://encrypted-tbn0.gstatic.com/images?q=tbn9GcRLwl_y_y6T-4Qaf2iq7iARbe_tNTIAsEhUpA&s', // 1-20% (thẳng)
    medium: 'https://64.media.tumblr.com/f298e1d3d548b188e6ba500611bb4990/tumblr_mfdgiqmZxx1rqcu9eo1_500.jpg', // 21-50% (hơi cong)
    high: 'https://i.imgflip.com/1q8rdu.jpg?a483528', // 51-80% (khá gay)
    veryHigh: 'https://pbs.twimg.com/media/E7GHBjKWQAEMdmm.jpg', // 81-100% (rất gay)
  },
  haihuoc: [
    'https://images7.memedroid.com/images/UPLOADED765/5a6cf7cb08199.jpeg', // Meme về Wi-Fi
    'https://encrypted-tbn0.gstatic.com/images?q=tbn9GcTVIWGMBmjVFII2bo4JndrRaM527YI84ILzQQ&s', // Meme về trà sữa
    'https://encrypted-tbn0.gstatic.com/images?q=tbn9GcQCp39g7UkyMdYKuziwYIW72qGYNJ_dCQCoMg&s', // Meme hài hước
  ],
  dance: [
    'https://media.tenor.com/YL8KBcr0Am4AAAAe/dancing-lit.png', // Nhảy múa
    'https://media.tenor.com/9xx5jJaHPpIAAAAM/fat-guy.gif', // Nhảy vui nhộn
    'https://media.tenor.com/S634LoO_WJ8AAAAM/remymane.gif', // Nhảy dễ thương
  ],
  game: {
    guess: 'https://i.pinimg.com/564x/8r/9s/0t/8r9s0t1u2v3w4x5y6z7a.jpg', // Hình ảnh số ngẫu nhiên
    taixiu: 'https://i.pinimg.com/564x/9s/0t/1u/9s0t1u2v3w4x5y6z7a8b.jpg', // Hình ảnh xúc xắc
    trivia: [
      'https://i.pinimg.com/564x/0t/1u/2v/0t1u2v3w4x5y6z7a8b9c.jpg', // Hình ảnh mèo
      'https://i.pinimg.com/564x/1u/2v/3w/1u2v3w4x5y6z7a8b9c0d.jpg', // Hình ảnh dây thun
      'https://i.pinimg.com/564x/2v/3w/4x/2v3w4x5y6z7a8b9c0d1e.jpg', // Hình ảnh không khí
    ],
    rps: 'https://i.pinimg.com/564x/3w/4x/5y/3w4x5y6z7a8b9c0d1e2f.jpg', // Hình ảnh oẳn tù tì
    typing: [
      'https://i.pinimg.com/564x/4x/5y/6z/4x5y6z7a8b9c0d1e2f3g.jpg', // Hình ảnh bàn phím
      'https://i.pinimg.com/564x/5y/6z/7a/5y6z7a8b9c0d1e2f3g4h.jpg', // Hình ảnh đua gõ
      'https://i.pinimg.com/564x/6z/7a/8b/6z7a8b9c0d1e2f3g4h5i.jpg', // Hình ảnh động viên
    ],
    win: 'https://i.imgflip.com/2dpztf.jpg', // Hình ảnh chiến thắng
    lose: 'https://media.tenor.com/0yYc6cK8cwQAAAAM/black-happy.gif', // Hình ảnh thua cuộc
    timeout: 'https://media.tenor.com/QBFbmd3FTiIAAAAM/im-rich-smile.gif', // Hình ảnh hết thời gian
  },
};

// Danh sách nội dung giải trí
const loveQuotes = [
  { quote: "Tao đéo hứa cho mày cả thế giới, nhưng tao thề sẽ nhét cái trái tim thối tha của tao vào mồm mày để yêu thương và bảo vệ cái đồ ngu mày! 💕", color: "#FF69B4" },
  { quote: "Trái tim tao như cái bãi rác chết tiệt cho đến khi mày lết cái đít thối tha của mày tới như cơn bão lũ làm mọi thứ nở hoa, con đĩ! 🌸", color: "#FFB6C1" },
  { quote: "Con mẹ mày, lạnh vãi lồn ngoài này, nói yêu tao đi—tim tao đập thình thịch như muốn nổ mẹ nó rồi, đồ ngu! 💓", color: "#FF1493" },
  { quote: "Tao ngu toán vãi, nhưng tao tính được tương lai tao sẽ đè mày ra đụ mỗi ngày, con đĩ ngon! 💍", color: "#FF4500" },
  { quote: "Mỗi lần mày cười, cả thế giới chó má của tao sáng lên—mày biết mày đang làm tao điên tiết không, con đĩ lẳng lơ? ✨", color: "#FFD700" },
];

const flirtyQuotes = [
  { quote: "Ê con đĩ, mày có bản đồ không? Tao lạc mẹ nó trong đôi mắt dâm đãng của mày rồi! 😘", color: "#FF69B4" },
  { quote: "Trái tim tao trống rỗng như cái lồn mày—muốn dọn cái đít thối của mày vào không? 💋", color: "#FF1493" },
  { quote: "Tao không hứa cho mày cả thế giới, nhưng tao hứa sẽ làm mày sướng cả đêm nay, con đĩ thèm đụ! 😏", color: "#FF4500" },
  { quote: "Mày là cà phê à? Đêm qua tao mất ngủ vì nghĩ đến cái đít dâm của mày, con đĩ! ☕❤️", color: "#FFB6C1" },
  { quote: "Tao không phải thợ chụp ảnh, nhưng tao tưởng tượng được cảnh tao đụ mày trong một câu chuyện tình hoàn hảo, con đĩ thèm cặc! 📸💕", color: "#FFD700" },
];

const funnyQuotes = [
  { quote: "Đời như cái Wi-Fi, đéo biết mình đang ở đâu trên cái thanh tín hiệu chó má đó, đồ ngu! 📶" },
  { quote: "Tiền không mua được hạnh phúc, nhưng mua được trà sữa, mà trà sữa thì gần giống hạnh phúc, đồ nghèo kiết xác! 🧋" },
  { quote: "Mặt tao xấu như cái lồn, nhưng kết cấu đẹp, giống như cái nhà vệ sinh công cộng vậy, đồ ngu! 🚽" },
];

const danceMoves = [
  { move: "💃 Nhảy điệu moonwalk như Michael Jackson, mượt hơn cái đít thối của mày cả ngàn lần, đồ ngu! 💃" },
  { move: "🕺 Quay vòng vòng như cái quạt trần, thổi bay cả server, còn mày thì ngồi đó ghen tị như con chó! 🕺" },
  { move: "👯 Nhảy điệu gà con, vừa nhảy vừa kêu cúc cù cu, dễ thương vãi lồn nhưng mày vẫn là đồ ngu! 👯" },
];

// Danh sách câu đố vui
const triviaQuestions = [
  { question: "Con gì kêu 'meo meo' nhưng không phải mèo, đồ ngu vãi lồn?", answer: "Con mèo giả vờ làm chó, đồ ngu như bò" },
  { question: "Cái gì càng kéo càng dài, càng thả càng ngắn, đồ biến thái khốn nạn?", answer: "Cái dây thun, đồ dâm dục bệnh hoạn" },
  { question: "Cái gì trong suốt, không cầm được, nhưng ai cũng cần, đồ ngu không não?", answer: "Không khí, đồ ngu như chó" },
];

// Danh sách câu để đua chữ
const typingChallenges = [
  { challenge: "Gõ câu này nhanh mẹ đi nếu không muốn bị gọi là đồ ngu vãi lồn, con đĩ chậm chạp!" },
  { challenge: "Ai gõ nhanh hơn thì thắng, mày sẵn sàng chưa, đồ ngu như bò?" },
  { challenge: "Câu này dài vãi lồn, nhưng mày làm được mà, đừng có ngu như chó!" },
];

// Logic thông minh cho tỷ lệ
const getCompatibilityMessage = (percentage) => {
  if (percentage <= 20) {
    return "Hai đứa mày không hợp nhau vãi lồn, đi tìm thằng khác mà đụ đi, đồ ngu! 😅";
  } else if (percentage <= 50) {
    return "Hai đứa mày cần cố gắng thêm chút nữa không thì chết mẹ nó trong cô đơn, đồ ngu! 💪";
  } else if (percentage <= 80) {
    return "Hai đứa mày khá hợp nhau đấy, tiếp tục đụ nhau đi, đồ dâm đãng! ❤️";
  } else {
    return "Đù má, hai đứa mày sinh ra để đụ nhau, chúc mừng cặp đôi dâm đãng! 💕";
  }
};

const getGayMessage = (percentage) => {
  if (percentage <= 20) {
    return "Mày thẳng như cái thước kẻ, chán vãi lồn, đồ ngu! 📏";
  } else if (percentage <= 50) {
    return "Mày hơi cong cong, nhưng vẫn là thằng thẳng ngu ngốc, đồ đần! 😏";
  } else if (percentage <= 80) {
    return "Mày khá là gay, nhưng vẫn còn chút thẳng để giả trân, đồ bóng giả bộ! 🌈";
  } else {
    return "Mày gay vãi lồn, thằng bóng thèm cặc, tự hào lên đi, con đĩ cầu vồng! 🏳️‍🌈";
  }
};

// Hàm chọn hình ảnh dựa trên tỷ lệ
const getImageByPercentage = (config, percentage) => {
  if (percentage <= 20) return config.low;
  if (percentage <= 50) return config.medium;
  if (percentage <= 80) return config.high;
  return config.veryHigh;
};

// Khi bot sẵn sàng
client.once('ready', async () => {
  console.log(`Bot ${client.user.tag} đã online, lũ ngu! ID: ${client.user.id}`);

  const commands = [
    new SlashCommandBuilder()
      .setName('totinh')
      .setDescription('Gửi lời tỏ tình cho con đĩ nào đó')
      .addStringOption(option =>
        option.setName('style')
          .setDescription('Chọn phong cách tỏ tình, đồ ngu')
          .setRequired(true)
          .addChoices(
            { name: 'Lãng mạn', value: 'romantic' },
            { name: 'Gợi cảm', value: 'flirty' },
          ))
      .addUserOption(option =>
        option.setName('target')
          .setDescription('Con đĩ mày muốn tỏ tình')
          .setRequired(true)),
    new SlashCommandBuilder()
      .setName('haihuoc')
      .setDescription('Gửi câu nói hài hước cho lũ ngu cười'),
    new SlashCommandBuilder()
      .setName('ghepdoi')
      .setDescription('Ghép đôi hai thằng ngu lại với nhau')
      .addUserOption(option =>
        option.setName('person1')
          .setDescription('Thằng ngu thứ nhất')
          .setRequired(true))
      .addUserOption(option =>
        option.setName('person2')
          .setDescription('Thằng ngu thứ hai')
          .setRequired(true)),
    new SlashCommandBuilder()
      .setName('dance')
      .setDescription('Bot sẽ nhảy như thằng điên'),
    new SlashCommandBuilder()
      .setName('game')
      .setDescription('Chơi một mini-game ngu ngốc')
      .addStringOption(option =>
        option.setName('type')
          .setDescription('Chọn loại game, đồ ngu')
          .setRequired(true)
          .addChoices(
            { name: 'Đoán số', value: 'guess' },
            { name: 'Tài xỉu', value: 'taixiu' },
            { name: 'Đố vui', value: 'trivia' },
            { name: 'Oẳn tù tì', value: 'rps' },
            { name: 'Đua chữ', value: 'typing' },
          )),
    new SlashCommandBuilder()
      .setName('howgay')
      .setDescription('Đo mức độ gay của thằng ngu nào đó')
      .addUserOption(option =>
        option.setName('target')
          .setDescription('Thằng ngu mày muốn đo')
          .setRequired(true)),
  ].map(command => command.toJSON());

  const rest = new REST({ version: '10' }).setToken(config.token);

  try {
    console.log('Đang đồng bộ lệnh, lũ ngu chờ đi...');
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );
    console.log('Đã đồng bộ lệnh xong, cảm ơn tao đi, lũ ngu!');
  } catch (error) {
    console.error(error);
  }
});

// Xử lý slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'totinh') {
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
        content: 'Đù má, mày ngu vãi lồn! Chọn "Lãng mạn" hoặc "Gợi cảm" đi, đồ ngu!',
        ephemeral: true,
      });
      return;
    }

    const lovePercentage = Math.floor(Math.random() * 100) + 1;
    const compatibilityMessage = getCompatibilityMessage(lovePercentage);
    const image = getImageByPercentage(imageConfig.totinh, lovePercentage);

    const embed = new EmbedBuilder()
      .setTitle('💘 Tỏ Tình Như Thằng Đàn Ông, Con Đĩ! 💘')
      .setDescription(`${target}, ${selectedQuote.quote}\n\n**Tỷ lệ hợp nhau:** ${lovePercentage}%\n${compatibilityMessage}`)
      .setColor(selectedQuote.color)
      .setImage(image)
      .setFooter({ text: `Gửi từ ${interaction.user.username}, thằng khốn nạn nhất server ❤️` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'haihuoc') {
    const randomIndex = Math.floor(Math.random() * funnyQuotes.length);
    const randomFunny = funnyQuotes[randomIndex];
    const image = imageConfig.haihuoc[randomIndex];

    const embed = new EmbedBuilder()
      .setTitle('😂 Câu Nói Hài Hước Cho Lũ Ngu Cười 😂')
      .setDescription(randomFunny.quote)
      .setColor('#FFFF00')
      .setImage(image)
      .setFooter({ text: `Gửi bởi ${interaction.user.username}, thằng hề ngu nhất server` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'ghepdoi') {
    const person1 = options.getUser('person1');
    const person2 = options.getUser('person2');

    if (person1.id === person2.id) {
      await interaction.reply({
        content: 'Đù má, mày không ghép đôi một thằng ngu với chính nó được, đồ ngu vãi lồn! 😅',
        ephemeral: true,
      });
      return;
    }

    const lovePercentage = Math.floor(Math.random() * 100) + 1;
    const compatibilityMessage = getCompatibilityMessage(lovePercentage);
    const image = getImageByPercentage(imageConfig.ghepdoi, lovePercentage);

    const embed = new EmbedBuilder()
      .setTitle('💞 Kết Quả Ghép Đôi, Lũ Đĩ Dâm Đãng! 💞')
      .setDescription(`Chúc mừng ${person1} và ${person2} đã được ghép đôi, lũ dâm đãng! ❤️\n**Tỷ lệ hợp nhau:** ${lovePercentage}%\n${compatibilityMessage}`)
      .setColor(lovePercentage > 50 ? '#FF69B4' : '#FF4500')
      .setImage(image)
      .setFooter({ text: 'Đừng có làm hỏng chuyện, lũ đĩ thèm đụ! 💕' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'dance') {
    const randomIndex = Math.floor(Math.random() * danceMoves.length);
    const randomDance = danceMoves[randomIndex];
    const image = imageConfig.dance[randomIndex];

    const embed = new EmbedBuilder()
      .setTitle('💃 Nhảy Như Thằng Điên Vãi Lồn! 🕺')
      .setDescription(randomDance.move)
      .setColor('#00CED1')
      .setImage(image)
      .setFooter({ text: `Biểu diễn bởi ${interaction.user.username}, thằng ngu nhảy dở nhất server` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'howgay') {
    const target = options.getUser('target');
    const gayPercentage = Math.floor(Math.random() * 100) + 1;
    const gayMessage = getGayMessage(gayPercentage);
    const image = getImageByPercentage(imageConfig.howgay, gayPercentage);

    const embed = new EmbedBuilder()
      .setTitle('🌈 Mày Gay Vãi Lồn Đến Đâu, Thằng Ngu? 🌈')
      .setDescription(`${target}, mức độ gay của mày là: **${gayPercentage}%**\n${gayMessage}`)
      .setColor(gayPercentage > 50 ? '#FF69B4' : '#1E90FF')
      .setImage(image)
      .setFooter({ text: `Đo bởi ${interaction.user.username}, thằng khốn nạn tò mò nhất server` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'game') {
    const gameType = options.getString('type');

    if (gameType === 'guess') {
      const secretNumber = Math.floor(Math.random() * 100) + 1;
      let attempts = 0;

      const embed = new EmbedBuilder()
        .setTitle('🎲 Mini-Game: Đoán Số, Đồ Ngu Vãi Lồn! 🎲')
        .setDescription('Tao đã chọn một số từ **1 đến 100**. Mày có 100 lượt để đoán, đồ ngu! Gõ số mày đoán vào chat đi!')
        .setColor('#1E90FF')
        .setImage(imageConfig.game.guess)
        .setFooter({ text: 'Gõ nhanh đi, đồ ngu chậm chạp!' });

      await interaction.reply({ embeds: [embed] });

      const filter = m => m.author.id === interaction.user.id && !isNaN(m.content) && m.content >= 1 && m.content <= 100;
      const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

      collector.on('collect', async m => {
        attempts++;
        const guess = parseInt(m.content);

        if (guess === secretNumber) {
          const winEmbed = new EmbedBuilder()
            .setTitle('🎉 Đù Má, Mày Thắng Thật, Thằng Ngu May Mắn! 🎉')
            .setDescription(`Mày đoán đúng số **${secretNumber}** sau **${attempts}** lượt, đồ ăn may vãi lồn!`)
            .setColor('#32CD32')
            .setImage(imageConfig.game.win)
            .setTimestamp();
          await interaction.followUp({ embeds: [winEmbed] });
          collector.stop();
        } else if (guess < secretNumber) {
          await interaction.followUp('Số mày đoán **thấp** vãi lồn! Thử lại đi, đồ ngu! ⬆️');
        } else {
          await interaction.followUp('Số mày đoán **cao** vãi lồn! Thử lại đi, đồ ngu không não! ⬇️');
        }

        if (attempts >= 100) {
          const loseEmbed = new EmbedBuilder()
            .setTitle('💔 Hết Lượt, Mày Thua Như Chó! 💔')
            .setDescription(`Số đúng là **${secretNumber}**. Lần sau cố lên, đồ ngu như bò!`)
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
            .setTitle('⏰ Hết Thời Gian, Đồ Ngu Chậm Chạp!')
            .setDescription(`Mày hết thời gian rồi, đồ ngu! Số đúng là **${secretNumber}**.`)
            .setColor('#FF4500')
            .setImage(imageConfig.game.timeout)
            .setTimestamp();
          interaction.followUp({ embeds: [timeoutEmbed] });
        }
      });
    }

    if (gameType === 'taixiu') {
      const result = Math.random() < 0.5 ? 'Tài' : 'Xỉu';
      const embed = new EmbedBuilder()
        .setTitle('🎰 Tài Xỉu, Đồ Nghiện Cờ Bạc! 🎰')
        .setDescription(`Kết quả: **${result}** 🎲\nChơi lại không, đồ ngu thèm cờ bạc?`)
        .setColor(result === 'Tài' ? '#FFD700' : '#FF4500')
        .setImage(imageConfig.game.taixiu)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }

    if (gameType === 'trivia') {
      const randomIndex = Math.floor(Math.random() * triviaQuestions.length);
      const question = triviaQuestions[randomIndex];
      const image = imageConfig.game.trivia[randomIndex];

      const embed = new EmbedBuilder()
        .setTitle('🧠 Đố Vui, Đồ Ngu Không Não! 🧠')
        .setDescription(`Câu hỏi: **${question.question}**\nMày có 30 giây để trả lời, đồ ngu! Gõ câu trả lời vào chat đi!`)
        .setColor('#FFA500')
        .setImage(image)
        .setFooter({ text: 'Suy nghĩ đi, đồ ngu như bò!' });

      await interaction.reply({ embeds: [embed] });

      const filter = m => m.author.id === interaction.user.id;
      const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

      collector.on('collect', async m => {
        const userAnswer = m.content.toLowerCase();
        if (userAnswer === question.answer.toLowerCase()) {
          const winEmbed = new EmbedBuilder()
            .setTitle('🎉 Đù Má, Mày Đúng Thật, Đồ Ngu May Mắn! 🎉')
            .setDescription(`Câu trả lời đúng là: **${question.answer}**! Mày không ngu như tao nghĩ! 🧠`)
            .setColor('#32CD32')
            .setImage(imageConfig.game.win)
            .setTimestamp();
          await interaction.followUp({ embeds: [winEmbed] });
          collector.stop();
        } else {
          await interaction.followUp('Sai mẹ rồi, đồ ngu! Thử lại đi, đồ ngu không não! 🤔');
        }
      });

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          const timeoutEmbed = new EmbedBuilder()
            .setTitle('⏰ Hết Thời Gian, Đồ Ngu Chậm Chạp!')
            .setDescription(`Câu trả lời đúng là: **${question.answer}**. Lần sau nhanh lên, đồ ngu!`)
            .setColor('#FF4500')
            .setImage(imageConfig.game.timeout)
            .setTimestamp();
          interaction.followUp({ embeds: [timeoutEmbed] });
        }
      });
    }

    if (gameType === 'rps') {
      const choices = ['kéo', 'búa', 'bao'];
      const botChoice = choices[Math.floor(Math.random() * choices.length)];
      const embed = new EmbedBuilder()
        .setTitle('✂️ Oẳn Tù Tì, Đồ Ngu! ✂️')
        .setDescription('Chọn: **kéo**, **búa**, hoặc **bao**! Mày có 15 giây, đừng ngu mà chọn sai, đồ ngu!')
        .setColor('#1E90FF')
        .setImage(imageConfig.game.rps)
        .setFooter({ text: 'Nhanh mẹ lên, đồ ngu chậm chạp!' });

      await interaction.reply({ embeds: [embed] });

      const filter = m => m.author.id === interaction.user.id && choices.includes(m.content.toLowerCase());
      const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

      collector.on('collect', async m => {
        const userChoice = m.content.toLowerCase();
        let result;

        if (userChoice === botChoice) {
          result = 'Hòa mẹ rồi! Cả hai cùng chọn **' + botChoice + '**, đồ ngu! 😅';
        } else if (
          (userChoice === 'kéo' && botChoice === 'bao') ||
          (userChoice === 'búa' && botChoice === 'kéo') ||
          (userChoice === 'bao' && botChoice === 'búa')
        ) {
          result = `Mày thắng, đồ ăn may vãi lồn! Mày chọn **${userChoice}**, tao chọn **${botChoice}**. 🎉`;
        } else {
          result = `Mày thua, đồ ngu! Mày chọn **${userChoice}**, tao chọn **${botChoice}**. Cút mẹ mày đi! 😢`;
        }

        const resultEmbed = new EmbedBuilder()
          .setTitle('✂️ Kết Quả Oẳn Tù Tì, Đồ Ngu! ✂️')
          .setDescription(result)
          .setColor(result.includes('thắng') ? '#32CD32' : result.includes('Hòa') ? '#FFFF00' : '#FF4500')
          .setImage(result.includes('thắng') ? imageConfig.game.win : result.includes('Hòa') ? imageConfig.game.rps : imageConfig.game.lose)
          .setTimestamp();
        await interaction.followUp({ embeds: [resultEmbed] });
        collector.stop();
      });

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          const timeoutEmbed = new EmbedBuilder()
            .setTitle('⏰ Hết Thời Gian, Đồ Ngu Chậm Chạp!')
            .setDescription('Mày không chọn kịp, đồ ngu! Tao chọn **' + botChoice + '**. Chơi lại đi, đồ ngu!')
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
        .setTitle('⌨️ Đua Chữ, Đồ Ngu Chậm Chạp! ⌨️')
        .setDescription(`Gõ câu này nhanh mẹ đi:\n**${challenge.challenge}**\nMày có 20 giây, đừng ngu mà làm sai, đồ ngu!`)
        .setColor('#FF69B4')
        .setImage(image)
        .setFooter({ text: 'Gõ nhanh lên, đồ ngu chậm như rùa!' });

      await interaction.reply({ embeds: [embed] });

      const startTime = Date.now();
      const filter = m => m.author.id === interaction.user.id && m.content === challenge.challenge;
      const collector = interaction.channel.createMessageCollector({ filter, time: 20000 });

      collector.on('collect', async m => {
        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000; // Thời gian tính bằng giây

        const winEmbed = new EmbedBuilder()
          .setTitle('🎉 Đù Má, Mày Thắng Thật, Đồ Ngu Chậm Chạp! 🎉')
          .setDescription(`Mày gõ đúng câu trong **${timeTaken} giây**! Không tệ cho một thằng ngu! 🚀`)
          .setColor('#32CD32')
          .setImage(imageConfig.game.win)
          .setTimestamp();
        await interaction.followUp({ embeds: [winEmbed] });
        collector.stop();
      });

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          const timeoutEmbed = new EmbedBuilder()
            .setTitle('⏰ Hết Thời Gian, Đồ Ngu Chậm Chạp!')
            .setDescription('Mày gõ không kịp, đồ ngu! Cố lên lần sau, đồ ngu như bò! 😅')
            .setColor('#FF4500')
            .setImage(imageConfig.game.timeout)
            .setTimestamp();
          interaction.followUp({ embeds: [timeoutEmbed] });
        }
      });
    }
  }
});

// Đăng nhập bot bằng token từ config
client.login(config.token);
