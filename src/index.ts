import { Context, Schema, h } from 'koishi'
import { Configuration, OpenAIApi } from 'openai'


export interface Config {
  apiKey: string,
  model: string,
  // prompt: string,
  temperature: number,
  max_tokens: number,
  trigger: string,
  proxyHost: string,
  porxyPort: number
}



export const Config: Schema<Config> = Schema.object({
  apiKey: Schema.string().description("OpenAI API Key 获取地址: https://platform.openai.com/account/api-keys"),
  trigger: Schema.string().default("GPT，").description("触发机器人的关键词。"),
  model: Schema.union(['text-davinci-003', 'text-ada-001', 'text-babbage-001', 'text-curie-001']).default('text-davinci-003'),
  temperature: Schema.number().default(0.7).description("温度，更高的值意味着模型将承担更多的风险。对于更有创造性的应用，可以尝试0.9，而对于有明确答案的应用，可以尝试0（argmax采样）。"),
  max_tokens: Schema.number().default(500).description("生成的最大令牌数。"),
  proxyHost: Schema.string().default("127.0.0.1").description("代理的host"),
  porxyPort: Schema.number().default(7890).description("代理端口")
})

// import onebot from '@koishijs/plugin-adapter-onebot'

export const name = 'runtu'
// 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
export function apply(ctx: Context, config: Config) {
  const configuration = new Configuration({
    apiKey: config.apiKey,
  });

  const openai = new OpenAIApi(configuration);


  ctx.on('message', async (session) => {
    // console.log(session.elements[0].attrs)
    if (session.content.startsWith(config.trigger)) {
      const q = session.content.replace(config.trigger, '')
      openai.createCompletion({
        model: config.model,
        prompt: q,
        temperature: config.temperature,
        max_tokens: config.max_tokens,
      }, {
        proxy: {
          host: config.proxyHost,
          port: config.porxyPort
        }
      }).then((data) => {
        session.send(data.data.choices[0].text)
      }).catch(() => {
        session.send("出现错误，联系管理员")
      });
    }
  })
}