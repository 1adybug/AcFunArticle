import React, { useEffect, Component } from "react"
import { View, Text, Dimensions, Image, Pressable } from "react-native"
import WebView from "react-native-webview"
import axios from "axios"
import { getAll, replaceAll } from "../utils"
import { Navigation } from "react-native-navigation"

export default class Article extends Component {

    constructor(props) {
        super(props)
        Navigation.events().bindComponent(this)
    }

    state = {
        content: ""
    }

    static options = {
        topBar: {
            rightButtons: {
                icon: require("../images/comment_line.png"),
                id: "comment"
            }
        }
    }

    navigationButtonPressed({ buttonId }) {
        Navigation.push(this.props.componentId, {
            component: {
                name: "Comment",
                passProps: {
                    articleId: this.props.articleId
                },
                options: {
                    topBar: {
                        title: {
                            color: "#FFFFFF",
                            text: `${this.commentCount}条评论`,
                            alignment: "center"
                        }
                    }
                }
            }
        })
    }

    async componentDidMount() {
        const { data } = await axios(`https://m.acfun.cn/v/?ac=${this.props.articleId}&type=article`)
        const a = replaceAll(getAll(data, '"content":"', '"}],"superUbb"')[0], '\\"', '"')
        const b = a.replace(/\\[tnr]{1}/g, "")
        const res = await axios({
            url: "https://www.acfun.cn/rest/pc-direct/emotion/getUserEmotion",
            method: "POST"
        })
        const emotionList = {}
        const _ = [].concat(...res.data.emotionPackageList.map(value => value.emotions))
        _.forEach(value => emotionList[value.id] = value.bigImageInfo.thumbnailImage.cdnUrls[0].url)
        const c = b.replace(/\[emot=acfun,\d+\/\]/g, item => `<img src="${emotionList[parseInt(item.slice(12))]}" style="width: 40px; height: 40px;" ></img>`)
        this.commentCount = data.match(/<span>评论: <\/span><span class="quanity">\d+<\/span>/)[0].replace(/<span>评论: <\/span><span class="quanity">/, "").replace(/<\/span>/, "") * 1
        this.setState({
            content: c
        })
    }

    onSwipeLeft = () => {
        Navigation.push(this.props.componentId, {
            component: {
                name: "Comment",
                passProps: {
                    articleId: this.props.articleId
                },
                options: {
                    topBar: {
                        title: {
                            color: "#FFFFFF",
                            text: `${this.commentCount}条评论`,
                            alignment: "center"
                        }
                    }
                }
            }
        })
    }

    render() {
        const { width, height } = Dimensions.get("window")
        const o = width / 640
        const { content } = this.state
        return (
            <View
                style={{ flex: 1 }}
            // onSwipeLeft={this.onSwipeLeft}
            >
                <WebView
                    source={{
                        baseUrl: "https://www.acfun.cn",
                        html: `
                        <!DOCTYPE html>
                        <html lang="zh">

                        <head>
                            <meta charset="UTF-8">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
                            <title>文章区</title>
                            <style>
                                * {
                                    margin: 0;
                                    padding: 0;
                                    box-sizing: border-box;
                                    word-break: break-all;
                                }

                                body {
                                    padding: 10px;
                                    overflow-x: hidden;
                                }

                                img {
                                    max-width: 100% !important;
                                    height: auto !important;
                                    vertical-align: bottom;
                                }
                            </style>
                        </head>

                        <body>
                            ${content}
                        </body>

                        
                        <script>
                            const allList = [...document.body.querySelectorAll("*")]
                            allList.map(item => parseFloat(getComputedStyle(item).fontSize)).forEach((item, index) => {
                                if (!item) return
                                allList[index].style.fontSize = (item + 2) + "px"
                                allList[index].style.lineHeight = (item + 2) * 1.8 + "px"
                            })
                            // const imgList = [...document.body.querySelectorAll("img")]
                            // imgList.forEach(item => {
                            //     item.src = item.src.replace("https://www.acfun.cn/imageProxy?url=", "")
                            // })
                            const aList = [...document.body.querySelectorAll("a")]
                            aList.forEach(item => {
                                item.onclick = e => {
                                    e.preventDefault()
                                    if (e.target.href.startsWith("https://www.acfun.cn/a/ac")) {
                                        alert(e.target.href)
                                    }
                                }
                            })
                        </script>
                    
                        </html>
                        `
                    }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    mixedContentMode="always"
                />
                <Pressable onPress={this.onSwipeLeft} style={{ position: "absolute", width: 80 * o, height: 80 * o, backgroundColor: "#FD4C5D", alignItems: "center", justifyContent: "center", borderRadius: 40 * o, overflow: "hidden", right: 40 * o, bottom: 40 * o, opacity: 0.8 }}>
                    <Image source={require("../images/comment_line.png")} style={{ width: 60 * o, height: 60 * o }} />
                </Pressable>
            </View >
        )
    }
}