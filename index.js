import { Navigation } from "react-native-navigation"
import Article from "./pages/Article"
import Comment from "./pages/Comment"
import SubComment from "./pages/SubComment"
import Test from "./pages/Test"
import ArticleList from "./pages/ArticleList"
import Setting from "./pages/Setting"
import Login from "./pages/Login"
import Loading from "./pages/Loading"
import axios from "axios"
import { indexList, storage } from "./utils"


Navigation.registerComponent("Article", () => Article)
Navigation.registerComponent("Comment", () => Comment)
Navigation.registerComponent("SubComment", () => SubComment)
Navigation.registerComponent("ArticleList", () => ArticleList)
Navigation.registerComponent("Test", () => Test)
Navigation.registerComponent("Setting", () => Setting)
Navigation.registerComponent("Login", () => Login)
Navigation.registerComponent("Loading", () => Loading)

Navigation.setDefaultOptions({
    statusBar: {
        backgroundColor: "#FD4C5D"
    },
    topBar: {
        title: {
            color: "#FFFFFF",
            alignment: "center"
        },
        backButton: {
            color: "#FFFFFF"
        },
        background: {
            color: "#FD4C5D"
        }
    },
    bottomTab: {
        fontSize: 14,
        selectedFontSize: 14,
        textColor: "#00FF00",
        selectedTextColor: "#0000FF",
        disableIconTint: true,
        disableSelectedIconTint: true,
    },
    bottomTabs: {
        currentTabIndex: 3,
        titleDisplayMode: "alwaysShow",
    }
})

Navigation.events().registerAppLaunchedListener(async () => {

    Navigation.setRoot({
        root: {
            component: {
                name: "Loading"
            }
        }
    })

    axios({
        url: "https://www.acfun.cn/rest/pc-direct/emotion/getUserEmotion",
        method: "POST"
    }).then(res => {
        const emotionPackageList = res.data.emotionPackageList.map(value => ({
            emotions: value.emotions.map(_value => ({
                id: _value.id,
                url: _value.bigImageInfo.thumbnailImage.cdnUrls[0].url
            })),
            cover: value.iconImageInfo.thumbnailImageCdnUrl,
            name: value.name
        }))
        storage.save({
            key: "emotionPackageList",
            data: emotionPackageList
        })
        const emotionList = {}
        const _ = [].concat(...res.data.emotionPackageList.map(value => value.emotions))
        _.forEach(value => emotionList[value.id] = value.bigImageInfo.thumbnailImage.cdnUrls[0].url)
        storage.save({
            key: "emotionList",
            data: emotionList
        })
    })

    let currentIndex
    try {
        currentIndex = await storage.load({ key: "currentIndex" })
    } catch (error) {
        currentIndex = 0
        storage.save({ key: "currentIndex", data: 0 })
    }


    let currentChildIndexList
    try {
        currentChildIndexList = await storage.load({ key: "currentChildIndexList" })
    } catch (error) {
        currentChildIndexList = indexList.map((value, index) => (index === 0 ? [0] : value.childList.map((_value, _index) => _index)))
        storage.save({ key: "currentChildIndexList", data: currentChildIndexList })
    }


    let currentOrderIndex
    try {
        currentOrderIndex = await storage.load({ key: "currentOrderIndex" })
    } catch (error) {
        console.log(error)
        currentOrderIndex = 0
        storage.save({ key: "currentOrderIndex", data: 0 })
    }


    let currentRangeIndex
    try {
        currentRangeIndex = await storage.load({ key: "currentRangeIndex" })
    } catch (error) {
        currentRangeIndex = 0
        storage.save({ key: "currentRangeIndex", data: 0 })
    }


    let currentRankRangeIndex
    try {
        currentRankRangeIndex = await storage.load({ key: "currentRankRangeIndex" })
    } catch (error) {
        currentRankRangeIndex = 0
        storage.save({ key: "currentRankRangeIndex", data: 0 })
    }

    setTimeout(() => {
        Navigation.setRoot({
            root: {
                stack: {
                    id: "HomeStack",
                    children: [
                        {
                            component: {
                                name: "ArticleList",
                                passProps: {
                                    currentIndex,
                                    currentChildIndexList,
                                    currentOrderIndex,
                                    currentRangeIndex,
                                    currentRankRangeIndex
                                }
                            }
                        }
                    ]
                }
            }
        }) 
    }, 1000)
})
