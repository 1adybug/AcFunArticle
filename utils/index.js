import React from "react"
import axios from "axios"
import { View, Text, Pressable, Image, Linking } from "react-native"
import { Navigation } from "react-native-navigation"
import Storage from "react-native-storage"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { launchImageLibrary } from "react-native-image-picker"
import { Buffer } from "buffer"


export const storage = new Storage({
    // maximum capacity, default 1000 key-ids
    size: 1000,

    // Use AsyncStorage for RN apps, or window.localStorage for web apps.
    // If storageBackend is not set, data will be lost after reload.
    storageBackend: AsyncStorage, // for web: window.localStorage

    // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
    // can be null, which means never expire.
    defaultExpires: null,

    // cache data in the memory. default is true.
    enableCache: true,

    // if data was not found in storage or expired data was found,
    // the corresponding sync method will be invoked returning
    // the latest data.
    sync: {
        // we'll talk about the details later.
    }
})

export function getAll(str, start, end, startBool = false, endBool = false) {
    const array = []
    for (; ;) {
        const b = str.indexOf(end)
        if (b === -1) return array
        let _str = str.slice(0, b)
        const a = _str.lastIndexOf(start)
        if (a === -1) {
            str = str.slice(b + end.length)
            continue
        }
        array.push(str.slice(a + (startBool ? 0 : start.length), b + (endBool ? end.length : 0)))
        str = str.slice(b + end.length)
    }
}

export function replaceAll(str, prev, now) {
    for (; ;) {
        str = str.replace(prev, now)
        if (!str.includes(prev)) return str
    }
}

export async function getAcFunUserInfo(id) {
    const { data: { profile } } = await axios(`https://www.acfun.cn/rest/pc-direct/user/userInfo?userId=${id}`)
    return profile
}

export const indexList = [
    {
        name: "推荐",
        childList: [
            {
                name: "全部版块",
                subChannelId: ""
            },
            {
                name: "综合杂谈",
                subChannelId: 110
            },
            {
                name: "生活情感",
                subChannelId: 73
            },
            {
                name: "游戏领域",
                subChannelId: 164
            },
            {
                name: "动漫文化",
                subChannelId: 74
            },
            {
                name: "画师涂鸦",
                subChannelId: 184
            },
            {
                name: "漫画文学",
                subChannelId: 75
            },
        ],
        rangeList: [
            {
                name: "24小时",
                data: "DAY"
            },
            {
                name: "三日",
                data: "THREE_DAYS"
            },
            {
                name: "本周",
                data: "WEEK"
            },
        ],
        orderList: []
    },
    {
        name: "综合",
        childList: [
            {
                name: "杂谈",
                realmId: 5
            },
            {
                name: "体育",
                realmId: 22
            },
            {
                name: "影视",
                realmId: 3
            },
            {
                name: "自媒体",
                realmId: 4
            }
        ],
        rangeList: [
            {
                name: "24小时",
                data: "oneDay"
            },
            {
                name: "三日",
                data: "threeDay"
            },
            {
                name: "本周",
                data: "oneWeek"
            },
            {
                name: "本月",
                data: "oneMonth"
            },
            {
                name: "不限",
                data: "all"
            },
        ],
        orderList: [
            {
                name: "最新发表",
                data: "createTime"
            },
            {
                name: "最后回复",
                data: "lastCommentTime"
            },
            {
                name: "最高热度",
                data: "hotScore"
            },
        ]
    },
    {
        name: "吐槽",
        childList: [
            {
                name: "爽文",
                realmId: 50
            },
            {
                name: "吐槽",
                realmId: 25
            },
            {
                name: "买买买",
                realmId: 34
            },
            {
                name: "情感",
                realmId: 7
            },
            {
                name: "工作",
                realmId: 6
            },
            {
                name: "摄影游记",
                realmId: 17
            },
            {
                name: "美食",
                realmId: 1
            },
            {
                name: "萌宠",
                realmId: 2
            },
            {
                name: "新人报道",
                realmId: 49
            },
        ],
        rangeList: [
            {
                name: "24小时",
                data: "oneDay"
            },
            {
                name: "三日",
                data: "threeDay"
            },
            {
                name: "本周",
                data: "oneWeek"
            },
            {
                name: "本月",
                data: "oneMonth"
            },
            {
                name: "不限",
                data: "all"
            },
        ],
        orderList: [
            {
                name: "最新发表",
                data: "createTime"
            },
            {
                name: "最后回复",
                data: "lastCommentTime"
            },
            {
                name: "最高热度",
                data: "hotScore"
            },
        ]
    },
    {
        name: "游戏",
        childList: [
            {
                name: "游戏杂谈",
                realmId: 8
            },
            {
                name: "英雄联盟",
                realmId: 11
            },
            {
                name: "暴雪游戏",
                realmId: 43
            },
            {
                name: "明日方舟",
                realmId: 44
            },
            {
                name: "手机游戏",
                realmId: 45
            },
            {
                name: "游戏主播",
                realmId: 46
            },
            {
                name: "命运神界",
                realmId: 47
            },
        ],
        rangeList: [
            {
                name: "24小时",
                data: "oneDay"
            },
            {
                name: "三日",
                data: "threeDay"
            },
            {
                name: "本周",
                data: "oneWeek"
            },
            {
                name: "本月",
                data: "oneMonth"
            },
            {
                name: "不限",
                data: "all"
            },
        ],
        orderList: [
            {
                name: "最新发表",
                data: "createTime"
            },
            {
                name: "最后回复",
                data: "lastCommentTime"
            },
            {
                name: "最高热度",
                data: "hotScore"
            },
        ]
    },
    {
        name: "动漫",
        childList: [
            {
                name: "动漫杂谈",
                realmId: 13
            },
            {
                name: "手办模玩",
                realmId: 31
            },
            {
                name: "富豪刑警",
                realmId: 48
            }
        ],
        rangeList: [
            {
                name: "24小时",
                data: "oneDay"
            },
            {
                name: "三日",
                data: "threeDay"
            },
            {
                name: "本周",
                data: "oneWeek"
            },
            {
                name: "本月",
                data: "oneMonth"
            },
            {
                name: "不限",
                data: "all"
            },
        ],
        orderList: [
            {
                name: "最新发表",
                data: "createTime"
            },
            {
                name: "最后回复",
                data: "lastCommentTime"
            },
            {
                name: "最高热度",
                data: "hotScore"
            },
        ]
    },
    {
        name: "涂鸦",
        childList: [
            {
                name: "原创画作",
                realmId: 18
            },
            {
                name: "临摹练习",
                realmId: 14
            },
            {
                name: "美图转载",
                realmId: 51
            }
        ],
        rangeList: [
            {
                name: "24小时",
                data: "oneDay"
            },
            {
                name: "三日",
                data: "threeDay"
            },
            {
                name: "本周",
                data: "oneWeek"
            },
            {
                name: "本月",
                data: "oneMonth"
            },
            {
                name: "不限",
                data: "all"
            },
        ],
        orderList: [
            {
                name: "最新发表",
                data: "createTime"
            },
            {
                name: "最后回复",
                data: "lastCommentTime"
            },
            {
                name: "最高热度",
                data: "hotScore"
            },
        ]
    },
    {
        name: "漫文",
        childList: [
            {
                name: "文学",
                realmId: 15
            },
            {
                name: "漫画",
                realmId: 23
            },
            {
                name: "国漫·条漫",
                realmId: 16
            }
        ],
        rangeList: [
            {
                name: "24小时",
                data: "oneDay"
            },
            {
                name: "三日",
                data: "threeDay"
            },
            {
                name: "本周",
                data: "oneWeek"
            },
            {
                name: "本月",
                data: "oneMonth"
            },
            {
                name: "不限",
                data: "all"
            },
        ],
        orderList: [
            {
                name: "最新发表",
                data: "createTime"
            },
            {
                name: "最后回复",
                data: "lastCommentTime"
            },
            {
                name: "最高热度",
                data: "hotScore"
            },
        ]
    },
]

export function commentToJSX(comment) {
    try {
        const tagList = []
        comment.replace(/\[resource/g, (value, index) => {
            tagList.push({
                tag: "resource",
                index
            })
        })
        comment.replace(/\[img/g, (value, index) => {
            tagList.push({
                tag: "img",
                index
            })
        })
        comment.replace(/\[emot=[\d\w,]+\/\]/g, (value, index) => {
            tagList.push({
                tag: "emot",
                index
            })
        })
        comment.replace(/\[at/g, (value, index) => {
            tagList.push({
                tag: "at",
                index
            })
        })
        comment.replace(/\[color/g, (value, index) => {
            tagList.push({
                tag: "color",
                index
            })
        })
        comment.replace(/\[size/g, (value, index) => {
            tagList.push({
                tag: "size",
                index
            })
        })
        tagList.sort((a, b) => a.index - b.index)
        const res = {
            JSXList: [],
            imageList: []
        }
        let start = 0
        tagList.forEach(value => {
            const { tag, index } = value
            if (index < start) return
            const text = comment.slice(start, index)
            if (text !== "") res.JSXList.push(<Text>{text}</Text>)
            if (tag === "resource") {
                start = start + comment.slice(start).indexOf("[/resource]") + 11
                const _ = comment.slice(index, start)
                const articleId = _.match(/id=\d+\s/)[0].slice(3, -1)
                const type = _.match(/type=\d+\s/)[0].slice(5, -1) * 1
                const str = _.slice(_.indexOf("]") + 1, _.lastIndexOf("["))
                if (type === 2) {
                    res.JSXList.push(<Pressable key={index} onPress={() => Linking.openURL(`https://www.acfun.cn/v/ac${articleId}`)}><Text articleId={articleId} style={{ color: "blue" }}>{str}</Text></Pressable>)
                    return
                }
                if (type === 3) {
                    res.JSXList.push(<Pressable key={index} onPress={e => {
                        Navigation.push("HomeStack", {
                            component: {
                                name: "Article",
                                passProps: {
                                    articleId
                                },
                                options: {
                                    topBar: {
                                        title: {
                                            color: "#FFFFFF",
                                            text: `AC${articleId}`,
                                            alignment: "center"
                                        }
                                    }
                                }
                            }
                        })
                    }}><Text articleId={articleId} style={{ color: "blue" }}>{str}</Text></Pressable>)
                    return
                }
                res.JSXList.push(<Text key={index} articleId={articleId} style={{ color: "blue" }}>{str}</Text>)

            }
            if (tag === "img") {
                start = start + comment.slice(start).indexOf("[/img]") + 6
                const _ = comment.slice(index, start)
                const src = _.slice(_.indexOf("]") + 1, _.lastIndexOf("["))
                res.imageList.push(src)
            }
            if (tag === "emot") {
                start = start + comment.slice(start).indexOf("/]") + 2
                const _ = comment.slice(index, start)
                const emotionId = _.slice(_.indexOf(",") + 1, -2)
                res.JSXList.push(<View key={index}><Image source={{ uri: this.emotionList[emotionId] || `https://cdn.aixifan.com/dotnet/20130418/umeditor/dialogs/emotion/images/ac/${emotionId}.gif` }} style={{ width: 42 * this.o, height: 42 * this.o, top: 4 * this.o }} /></View>)
            }
            if (tag === "at") {
                start = start + comment.slice(start).indexOf("[/at]") + 5
                const _ = comment.slice(index, start)
                const userId = _.match(/id=\d+[\s\]]/)[0]
                const str = _.slice(_.indexOf("]") + 1, _.lastIndexOf("["))
                res.JSXList.push(<Text key={index} userId={parseInt(userId)} style={{ color: "blue" }}>{str}</Text>)
            }
            if (tag === "color") {
                start = start + comment.slice(start).indexOf("[/color]") + 8
                const _ = comment.slice(index, start)
                const color = _.match(/color=[#\d\w]+\]/)[0].slice(6, -1)
                const str = _.slice(_.indexOf("]") + 1, _.lastIndexOf("["))
                res.JSXList.push(<Text key={index} style={{ color }}>{str}</Text>)
            }
            if (tag === "size") {
                start = start + comment.slice(start).indexOf("[/size]") + 7
                const _ = comment.slice(index, start)
                const str = _.slice(_.indexOf("]") + 1, _.lastIndexOf("["))
                res.JSXList.push(<Text key={index}>{str}</Text>)
            }
        })
        res.JSXList.push(<Text key="last">{comment.slice(start)}</Text>)
        return res
    } catch (error) {
        console.log(error)
        return {
            JSXList: [<Text key="only">{comment}</Text>],
            imageList: []
        }
    }
}

export async function getImage() {
    const readRes = await launchImageLibrary({
        mediaType: "photo",
        includeBase64: true
    })

    const { fileName, base64 } = readRes.assets[0]

    const { cookie } = await getLoginUserInfo()

    const { data: { info: { token } } } = await axios({
        url: "https://www.acfun.cn/rest/pc-direct/image/upload/getToken",
        method: "post",
        headers: {
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "cookie": cookie,
            "dnt": 1,
            "origin": "https://www.acfun.cn",
            "pragma": "no-cache",
            "referer": "https://www.acfun.cn/a/ac33577229",
            "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36"
        },
        data: `fileName=${fileName}`
    })

    await axios({
        url: `https://upload.kuaishouzt.com/api/upload/resume?upload_token=${token}`,
        method: "get",
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "zh-CN,zh;q=0.9",
            "Connection": "keep-alive",
            "dnt": 1,
            "Host": "upload.kuaishouzt.com",
            "origin": "https://www.acfun.cn",
            "referer": "https://www.acfun.cn",
            "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36"
        }
    })

    await axios({
        url: `https://upload.kuaishouzt.com/api/upload/fragment?upload_token=${token}&fragment_id=0`,
        method: "post",
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "zh-CN,zh;q=0.9",
            "Connection": "keep-alive",
            "content-type": "application/octet-stream",
            "dnt": 1,
            "Host": "upload.kuaishouzt.com",
            "origin": "https://www.acfun.cn",
            "referer": "https://www.acfun.cn",
            "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36"
        },
        data: Buffer.from(base64, "base64")
    })


    await axios({
        url: `https://upload.kuaishouzt.com/api/upload/complete?fragment_count=1&upload_token=${token}`,
        method: "post",
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "zh-CN,zh;q=0.9",
            "Connection": "keep-alive",
            "dnt": 1,
            "Host": "upload.kuaishouzt.com",
            "origin": "https://www.acfun.cn",
            "referer": "https://www.acfun.cn",
            "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36"
        }
    })

    const res = await axios({
        url: "https://www.acfun.cn/rest/pc-direct/image/upload/getUrlAfterUpload",
        method: "post",
        headers: {
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "cookie": cookie,
            "dnt": 1,
            "origin": "https://www.acfun.cn",
            "referer": "https://www.acfun.cn/a/ac33577229",
            "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36"
        },
        data: `token=${token}&bizFlag=web-comment-text`
    })

    return res.data.url
}

export async function sendCommentToAcFun(content, articleId, replyToCommentId = "") {

    const { cookie } = await getLoginUserInfo()

    const res = await axios({
        url: "https://www.acfun.cn/rest/pc-direct/comment/add",
        method: "POST",
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            "cookie": cookie,
            "dnt": 1,
            "origin": "https://www.acfun.cn",
            "pragma": "no-cache",
            "referer": `https://www.acfun.cn/a/ac${articleId}`,
            "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36"
        },
        data: `sourceId=${articleId}&sourceType=3&content=${encodeURIComponent(content)}&replyToCommentId=${replyToCommentId}`
    })
    return res.status
}

export async function getLoginUserInfo() {
    try {
        const cookie = await storage.load({ key: "cookie" })
        const a = cookie.indexOf("ac_username=")
        const b = cookie.slice(a + 12)
        const c = b.indexOf("; ")
        const userName = (decodeURIComponent(b.slice(0, c))).replace(/&#[\d\w]+;/ig, i => String.fromCharCode(i.slice(2, -1) * 1))
        const d = cookie.indexOf("ac_userimg=")
        const e = cookie.slice(d + 11)
        const f = e.indexOf("; ")
        const avatarUrl = decodeURIComponent(e.slice(0, f))
        return { cookie, userName, avatarUrl }
    } catch (error) {
        return null
    }
}