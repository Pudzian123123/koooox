exports.run = (client, msg, args, _content, _command, Discord, config) => {
  //Check the channel to avoid being used in other channels.
  if (!msg.channel.name.startsWith(`💻┋comandos`)) {
    var embed = new Discord.MessageEmbed()
    .setColor('#8b0000')
    .setTimestamp()
    .setFooter(`Denegado a ${msg.member.displayName}`)        
    .setTitle(`Error`)
    .setDescription('Usa comandos en los canales correspondientes.');
        
    msg.channel.send({embed}).catch(console.error);
    return;
  }

  //Get the support role from the configuration. This support role has access to all the tickets.
  const supportRole = msg.guild.roles.cache.get(config.supportRole);
  //Find the default server role.
  const defaultRole = msg.guild.roles.cache.find(x => x.id === "675762500376985640");
  
  //Check if the support role exists.
  if (!supportRole) {
    var roleError = new Discord.MessageEmbed()
    .setColor('#8b0000')
    .setTimestamp()
    .setFooter(`Denegado a ${msg.member.displayName}`)        
    .setTitle(`Error`)
    .setDescription('No se ha encontrado el rol de soporte.');
          
    msg.channel.send({ticketLog: roleError}).catch(console.error);
    return;
  }
  
  //Create the variable where we store the topic of the ticket.
  let ticketTopic = args.join(" ");
  //Replace the topic string if it is empty.
  if(!ticketTopic) ticketTopic = "Por defecto.";   
  //Get the ID of the message author, then convert it to string and extract substrings of the ID. Then add the discriminator of the message author to avoid ticket duplication.
  let ticketIdentification = msg.author.id.toString().substr(0, 4) + msg.author.discriminator;
  //Create the name of the ticket using the identification that we created before.
	let ticketName = `🗳┋ticket-${ticketIdentification}`;

  //Check if the user has another ticket.
	if (msg.guild.channels.cache.find(channel => channel.name === ticketName)) {
    var embed = new Discord.MessageEmbed()
    .setColor('#8b0000')
    .setTimestamp()
    .setFooter(`Denegado a ${msg.member.displayName}`)        
    .setTitle(`Error`)
    .setDescription('Ya has abierto un ticket, por favor, comunícate a través de ese o abre uno nuevo.');
        
    msg.channel.send({embed}).catch(console.error);
    return;
	}

  try {
    //Create ticket text channel with the variables that we created before.
	  msg.guild.channels.create(`🗳┋ticket-${ticketIdentification}`, {type: 'text'}).then(async ticketChannel => {
      //Set the category parent of the ticket (specified in the configuration).
      await ticketChannel.setParent(config.ticketsCategory);
      //Set the ticket topic used the variables that we declared before.
      await ticketChannel.setTopic(`**Información** - **Autor:** ${msg.author} | **Motivo:** ${ticketTopic}`);
    
      //Overwrite the permissions of the default role in the ticket channel.
		  await ticketChannel.updateOverwrite(defaultRole, {
  			VIEW_CHANNEL: false,
			  SEND_MESSAGES: false
      }).catch(console.error);
    
      //Overwrite the permissions of the ticket author in the ticket channel.
		  await ticketChannel.updateOverwrite(msg.author, {
  			VIEW_CHANNEL: true,
			  SEND_MESSAGES: true,
        ATTACH_FILES: true
      }).catch(console.error);
    
      //Overwrite the permissions of the support role in the ticket channel.
		  await ticketChannel.updateOverwrite(supportRole, {
	  	  VIEW_CHANNEL: true,
			  SEND_MESSAGES: true,
        ATTACH_FILES: true
		  }).catch(console.error);

      //Create an embed when the creation of the ticket is success.
		  const ticketCreation = new Discord.MessageEmbed()
		  .setColor('#ff8c00')
      .setTimestamp()
      .setTitle('Literium - Tickets')
		  .setDescription(`
Un nuevo ticket ha sido creado en el canal ${ticketChannel} para obtener soporte. Por favor, lee las instrucciones dadas y sigue los pasos para recibir un soporte adecuado.
\`\`\`yaml
Ticket:
  ID: ${ticketIdentification}
  Motivo: ${ticketTopic}\`\`\`
    `)
		  .setTimestamp()
      .setFooter(`Solicitado por ${msg.member.displayName}`);

      //Create an embed to give some information about the ticket in the ticket channel.
		  const ticketWelcome = new Discord.MessageEmbed()
		  .setColor('#ff8c00')
      .setTitle('Lithium - Tickets')
      .setTimestamp()
      .setFooter(`Solicitado por ${msg.member.displayName}`)      
      .setDescription(`
Hola, gracias por solicitar soporte al Staff. 
Alguien te atenderá lo más pronto posible, por lo que, te pedimos que mientras tanto describas tu problema a detalle para así solucionarlo lo antes posible.
Recuerda que si sientes que el soporte es inadecuado, siempre puedes contactar a alguien de la administración para solucionar el problema.
\`\`\`yaml
Ticket:
  Tag: ${msg.author.tag}
  ID: ${ticketIdentification}
  Motivo: ${ticketTopic}\`\`\`
      `);      

      //Send the embed with the ticket creation message.
      await msg.channel.send(ticketCreation).catch(console.error);
      //Send the information about the ticket to the ticket channel when the channel is successfully created.
		  await ticketChannel.send(ticketWelcome).catch(console.error);
    
      //Create an embed to log the creation of the ticket.
		  var ticketLog = new Discord.MessageEmbed()
      .setTimestamp()
      .setColor('#ff8c00')
      .setTitle(`Lithium - Tickets`)
      .setDescription(`
Se detectó la creación de un nuevo ticket en el canal ${ticketChannel}.
A continuación, se muestra información brevemente de este ticket:
\`\`\`yaml
Ticket:
  Tag: ${msg.author.tag}
  ID: ${ticketIdentification}
  Motivo: ${ticketTopic}\`\`\`
      `);

      //Send the log embed to the ticket log channel from the configuration.
      await client.channels.cache.get(config.ticketLogChannel).send(ticketLog).catch(console.error);
    });
  } catch(err) {
    console.log(err);
  }
}

//Add an entry for this command in the help.
exports.help = {
    name: "Ticket",
    category: "Soporte",
    description: "Abre un ticket.",
    usage: "Ticket [Motivo]",
    example: ""
}; 