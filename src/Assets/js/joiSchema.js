const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string()
        .min(1)
        .max(25)
        .required(),

    prefix: Joi.string()
        .min(1)
        .max(25)
        .required(),

    library: Joi.string()
        .valid('discljord', 'aegis.cpp', 'Crystal', 'discordcr', 'Discord.Net', 'DSharpPlus', 'dscord', 'DiscordGo', 'DisGord', 'catnip', 'Discord4J', 'Javacord', 'JDA', 'discord.js', 'eris', 'Discord.jl', 'Discordia', 'Discordnim', 'RestCord', 'discord.py', 'disco', 'discordrb', 'discord-rs', 'Serenity', 'AckCord', 'Sword', 'disco')
        .required(),

    short_desc: Joi.string()
        .min(1)
        .max(100)
        .required(),

    long_desc_plain: Joi.string()
        .min(1)
        .max(5000)
        .required(),

    long_desc_rich: Joi.string()
        .min(1)
        .max(5000)
        .required(),

    invite_url: Joi.string()
        .min(1)
        .required(),

    website_url: Joi.string()
        .allow('')
        .optional(),

    support_url: Joi.string()
        .allow('')
        .optional(),

    donate_url: Joi.string()
        .allow('')
        .optional(),

    github_url: Joi.string()
        .allow('')
        .optional(),

    nsfw: Joi.boolean(),

    slash_commands: Joi.boolean(),

}).options({ stripUnknown: true })

exports.schema = schema