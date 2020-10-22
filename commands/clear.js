exports.run = (_client, msg, args, _command, _content, Discord) => {
    //Check if the user has enough permissions.
    if (!msg.member.hasPermission("MANAGE_MESSAGES")) {
        var embed = new Discord.MessageEmbed()
        .setColor('#8b0000')
        .setTimestamp()
        .setFooter(`Denegado a ${msg.member.displayName}`)
        .setTitle(`Error`)
        .setDescription('No tienes permisos para hacer esto.');
        
        msg.channel.send({embed}).catch(console.error);
        return;
    }

    //Create a constant where we store the number of messages to delete and parse them to integer.
    const clearMessages = parseInt(args[0], 10);
    //If arguments are null, execute this code
    if (!clearMessages) {
        var embed = new Discord.MessageEmbed()
        .setColor('#8b0000')
        .setTimestamp()
        .setFooter(`Denegado a ${msg.member.displayName}`)
        .setTitle('Error')
        .setDescription('Debes mencionar un número mayor a 0 y menor o igual a 100.');
        
        msg.channel.send({embed}).catch(console.error);
        return;
    }
    
    //Check if the quantity of messages to delete is lower than 100, because that's the limit.
    if (clearMessages > 100) {
        var embed = new Discord.MessageEmbed()
        .setColor('#8b0000')
        .setTimestamp()
        .setFooter(`Denegado a ${msg.member.displayName}`)
        .setTitle('Error')
        .setDescription('Debes mencionar un número mayor a 0 y menor o igual a 100.');
        
        msg.channel.send({embed}).catch(console.error);
        return;
    }
    
    //Check if the bot can delete the command message.
    if (msg.deletable) msg.delete();
    //Bulk delete all the messages that were specified in the args.
    msg.channel.bulkDelete(clearMessages)
    //Send a message to the user that all messages were deleted successfully.
    var embed = new Discord.MessageEmbed()
    .setColor('#ff8c00')
    .setTitle('Lithium - Limpieza')
    .setTimestamp()
    .setFooter(`Solicitado por ${msg.member.displayName}`)
    .setDescription(`Se han borrado ${clearMessages} mensajes.`);
    
    //Send the embed and then delete the embed to keep the chat clear.
    msg.channel.send({embed}).catch(console.error).then(msg => {
        msg.delete({ timeout: 10000 }).catch(console.error);
    });
}

//Add an entry for this command in the help.
exports.help = {
    name: "Clear",
    category: "Administración",
    description: "Elimina mensajes de un canal.",
    usage: "Clear [Cantidad]",
    example: "",
    status: "Ready"
};