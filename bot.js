const Discord = require("discord.js")
const bot = new Discord.Client()
const config = require("./c0nfig.json")

bot.login(config.token)


bot.on("ready", () => {
    console.log("Ready")
    bot.user.setStatus("online")
    bot.user.setActivity('Wersja beta 0.3')
});

bot.on("reconnecting", () => {
    console.log("Reconnecting")
});

bot.on("guildCreate", guild => {
    guild.createRole({ name: "Muted", color: "#313131" })
    console.log("Joined a new server:" + guild.name)
    console.log("It has " + guild.memberCount + " members ;)")
});

bot.on("guildDelete", guild => {
    console.log("Left the server:" + guild.name)
});

bot.on("message", message => {

    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase()

    if (command === "kick") {
        if (!message.member.hasPermission('KICK_MEMBERS'))
            return message.channel.send(":no_entry: Niewystarczające uprawnienia")
        const member = message.mentions.members.first();
        if (!member)
            return message.channel.send(":no_entry: Nie wymieniono żadnego użytkownika.")
        const reason = args.slice(1).join(" ") 
        if (!member.kickable)
            return message.channel.send(":no_entry: Nie mogę wyrzucić tego użytkownika.")
        if (member) {
            if (!reason) {
                return member.kick().then(member => {
                    message.channel.send(`${member.user.tag} został wyrzucony przez ${message.author}, nie podano powodu.`);
                })
            }
            if (reason) {
                member.kick().then(member => {
                    message.channel.send(`${member.user.tag} został wyrzucony przez ${message.author} ponieważ ${reason}.`);
                })
            }
        }
    }
    if (command === "plg") {
    	return message.channel.send("Polska Górą!!!")
    }
    if (command === "ban") {
        if (!message.member.hasPermission('BAN_MEMBERS'))
            return message.channel.send(":no_entry: Niewystarczające uprawnienia")
        const member = message.mentions.members.first();
        if (!member)
            return message.channel.send(":no_entry: Niewystarczające uprawnienia.")
        const reason = args.slice(1).join(" ")
        if (!member.kickable)
            return message.channel.send(":no_entry: Nie mogę zablokować tego użytkownika.")
        if (member) {
            if (!reason) {
                return member.ban().then(member => {
                    message.channel.send(`${member.user.tag} został zbanowany przez ${message.author}, nie podano powodu.`)
                })
            }
            if (reason) {
                member.ban().then(member => {
                    message.channel.send(`${member.user.tag} został zbanowany przez ${message.author} ponieważ ${reason}.`)
                })
            }
        }
    }

    if (command === "add") {
        if (!message.member.hasPermission("MANAGE_ROLES"))
            return message.channel.send(":no_entry: Insufficient permissions")
        const member = message.mentions.members.first()
        if (!member)
            return message.channel.send(":no_entry: No user mentioned")
        const add = args.slice(1).join(" ")
        if (!add)
            return message.channel.send(":no_entry: No role said")
        const roleAdd = message.guild.roles.find(role => role.name === add);
        if (!roleAdd)
            return message.channel.send(":no_entry: Role does not exist")
            if (member.roles.has(roleAdd.id)){
            return message.channel.send(":no_entry: User already has role")
            }
        if (member) {
            member.addRole(roleAdd).catch((error) =>{
                message.channel.send(":cry: Error")
            }).then((member) => {
                message.channel.send(`:thumbsup: ${roleAdd} added to ${member.displayName}`)
            })

        }
    }
    if (command === "remove") {
        if (!message.member.hasPermission("MANAGE_ROLES"))
            return message.channel.send(":no_entry: Insufficient permissions")
        const member = message.mentions.members.first()
        if (!member)
            return message.channel.send(":no_entry: No user mentioned")
        const remove = args.slice(1).join(" ")
        if (!remove)
            return message.channel.send(":no_entry: No role said")
        const roleRemove = message.guild.roles.find(role => role.name === remove);
        if (!roleRemove)
            return message.channel.send(":no_entry: Role does not exist")
            if (!member.roles.has(roleRemove.id)){
            return message.channel.send(":no_entry: User already does not have role")
            }
        if (member) {
            member.removeRole(roleRemove).catch((err) =>{
                message.channel.send(":cry: Error")
            }).then((member) => {
                message.channel.send(`:thumbsup: ${roleRemove} removed from ${member.displayName}`)
            })

        }
    }

    if(command === "rps"){
        const options = [
            "rock :shell: ",
            "paper :newspaper2:",
            "scissors :scissors: "
        ]
        const option = options[Math.floor(Math.random() * options.length)]
        message.channel.send(`You got ${option}`)
    }

    if (command === "uptime") {
        let totalSeconds = (bot.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds / 60;
        message.channel.send(`:low_brightness: **Uptime:** ${days} days, ${hours} hours and ${minutes} mins`)

    }
});
