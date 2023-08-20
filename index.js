const { EmbedBuilder, Colors, ButtonStyle } = require('discord.js');
const DBI = require('../../../dbi');
const MAX_DESCRIPTION_LENGTH = 2048;

module.exports.embed = ({
  title = null,
  description = null,
  fields = [],
  footer: { text: footerText = null, icon: footerIcon = null } = {},
  image = null,
  thumbnail = null,
  color = 0xffb41c,
  timestamp = null,
  author: { url: embedAuthorLink = null, name: embedAuthorName = null, icon: embedAuthorIcon = null } = {},
  outArray = false,
  split = false
}) => {
  if (typeof split === "string" && description && description.length > MAX_DESCRIPTION_LENGTH) {
    const embeds = [];
    let currEmbedIndex = 0;
    let desc = description;

    while (desc.length > 0) {
      let splitIndex = MAX_DESCRIPTION_LENGTH;
      if (desc.length > MAX_DESCRIPTION_LENGTH) {
        const newlineIndex = desc.lastIndexOf(split, MAX_DESCRIPTION_LENGTH);
        if (newlineIndex !== -1) {
          splitIndex = newlineIndex;
        }
      }
      const splitDesc = desc.substring(0, splitIndex).trim();
      desc = desc.substring(splitIndex).trim();

      const embed = new EmbedBuilder()
        .setDescription(splitDesc)
        .setColor(typeof color === "number" ? color : (Colors[color] ?? (parseInt(color, 16) || parseInt(color.slice(1, -1), 16) || color)))
      if (currEmbedIndex === 0) {
        embed.setTitle(title)
          .setAuthor(embedAuthorName || embedAuthorIcon ? { name: embedAuthorName, iconURL: embedAuthorIcon, url: embedAuthorLink } : null)
          .setThumbnail(thumbnail);
      }
      if (desc.length === 0) {
        embed.setFields(fields ? fields.map(field => ({ name: field.name, value: field.value, inline: field.inline })) : null)
          .setImage(image)
          .setFooter(footerText || footerIcon ? { text: footerText, iconURL: footerIcon } : null);
      }
      embeds.push(embed);
      currEmbedIndex++;
    }

    if (outArray) {
      return outArray.concat(embeds);
    } else {
      return embeds;
    }
  } else {
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setFields(fields ? fields.map(field => ({ name: field.name, value: field.value, inline: field.inline })) : null)
      .setTimestamp(timestamp)
      .setColor(typeof color === "number" ? color : (Colors[color] ?? (parseInt(color, 16) || parseInt(color.slice(1, -1), 16) || color)))
      .setThumbnail(thumbnail)
      .setImage(image)
      .setFooter(footerText || footerIcon ? { text: footerText, iconURL: footerIcon } : null)
      .setAuthor(embedAuthorName || embedAuthorIcon ? { name: embedAuthorName, iconURL: embedAuthorIcon, url: embedAuthorLink } : null);
    if (Array.isArray(outArray)) {
      outArray.push(embed);
      return outArray;
    };
    return outArray ? embed : [embed];
  }
};

module.exports.button = ({
  style = null,
  label = null,
  name = null,
  emoji = null,
  url = null,
  disabled = false,
  data = null,
  dbi = true,
  custom_id
}) => {
  let overrides = {};
  let array = [{ value: style, name: "style" }, { value: label, name: "label" }, { value: emoji, name: "emoji" }, { value: url, name: "url" }, { value: disabled, name: "disabled" }];
  array.filter(item => item.value !== null).forEach((item, index) => {
    overrides[item.name] = item.value;
  });
  if (!dbi) return {
    type: 2,
    style,
    label,
    custom_id,
    url,
    disabled
  }
  return DBI.interaction(name).toJSON({
    overrides,
    reference: {
      data
    }
  })
}
