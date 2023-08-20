import { EmbedBuilder, APIEmbedField, ColorResolvable, ButtonStyle } from "discord.js";

type EmbedContext = (
  | { title?: string; description: string; fields?: APIEmbedField[] }
  | { title: string; description?: string; fields?: APIEmbedField[] }
  | { title?: string; description?: string; fields: APIEmbedField[] }
) & OptionalEmbedContext;

type OptionalEmbedContext = {
  footer?: { text: string; icon?: string };
  image?: string;
  thumbnail?: string;
  color?: ColorResolvable;
  timestamp?: boolean | number | Date;
  author?: { name: string; icon?: string; url?: string };
  split?: boolean;
}


export function embed(embedCtx: EmbedContext & { outArray?: false }): EmbedBuilder;

export function embed(embedCtx: EmbedContext & { outArray: true | EmbedBuilder[] }): [EmbedBuilder];

export function embed(embedCtx: EmbedContext & { outArray: boolean | EmbedBuilder[] }): EmbedBuilder | [EmbedBuilder];

export function button(ctx: {
  name: string;
  label: string;
  style: ButtonStyle;
  disabled: boolean;
  url?: string;
  emoji?: string;
  data?: string[];
  dbi?: boolean,
  custom_id?: string
})
