import { Session, h } from 'koishi'

export const friendsRequest = (isOpen: boolean, url?: string) => async (session: Session) => {
    console.log(session)
    if (isOpen) {
        await session.bot.handleFriendRequest(session.messageId, true)
        const welcomeInfo = url ? h("p", "hello", h("image", { url })) : h("p", {}, "hello")
        // 目前gocq有bug，如果不进行延迟，qq会判定为还没有成为好友从而导致发送消息失败
        setTimeout(() => {
            session.bot.sendPrivateMessage(session.userId, welcomeInfo)
        }, 500)
    } else {
        // TODO 对请求的messageId进行处理
        await session.bot.handleFriendRequest(session.messageId, false)
    }
} 