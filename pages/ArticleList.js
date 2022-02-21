import React, { Component, createRef } from "react"
import { View, Text, Dimensions, Image, FlatList, ScrollView, Pressable, Button } from "react-native"
import { Navigation } from "react-native-navigation"
import axios from "axios"
import moment from "moment"
import { getAcFunUserInfo, indexList, storage } from "../utils"

class ArticleFloor extends Component {

    o = Dimensions.get("window").width / 640

    state = {
        headUrl: "http://tx-free-imgs2.acfun.cn/bs2/zt-image-host/08f0f80710b4f898d901"
    }

    async componentDidMount() {

        const { articleId, commentCount, createTime, formatCommentCount, formatViewCount, realmId, realmName, title, userId, userName, viewCount } = this.props

        const profile = await getAcFunUserInfo(userId)

        this.setState({
            headUrl: profile.headUrl
        })

    }

    goToArticle = e => {
        Navigation.push(this.props.componentId, {
            component: {
                name: "Article",
                passProps: {
                    articleId: this.props.articleId
                },
                options: {
                    topBar: {
                        title: {
                            color: "#FFFFFF",
                            text: `AC${this.props.articleId}`,
                            alignment: "center"
                        }
                    }
                }
            }
        })
    }

    render() {

        const { o, goToArticle } = this

        const { articleId, commentCount, createTime, formatCommentCount, formatViewCount, realmId, realmName, title, userId, userName, viewCount } = this.props

        const { headUrl } = this.state

        const showTime = moment(createTime).format("YYYY-MM-DD HH:mm")

        return (
            <Pressable onPress={goToArticle} style={{ paddingLeft: 82 * o, paddingBottom: 18 * o, paddingRight: 22 * o }}>
                <View style={{ position: "absolute", alignItems: "flex-end", right: 582 * o, top: 8 * o }}>
                    <Image source={require("../images/comment.png")} style={{ width: 18 * o, height: 18 * o }} />
                    <Text style={{ fontSize: 16 * o }}>{formatCommentCount}</Text>
                </View>
                <Text style={{ fontSize: 26 * o, color: "#333333", fontWeight: "700" }}>{title}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", height: 62 * o }}>
                    <View style={{ width: 30 * o, height: 30 * o, borderRadius: 15 * o, marginRight: 10 * o, overflow: "hidden" }} >
                        <Image source={{ uri: headUrl }} style={{ width: 30 * o, height: 30 * o }} />
                    </View>
                    <Text style={{ fontSize: 20 * o, color: "#999999" }} numberOfLines={1}>{userName}  {showTime}  {formatViewCount}阅读</Text>
                </View>
            </Pressable>
        )
    }
}

export default class ArticleList extends Component {

    constructor(props) {
        super(props)
        Navigation.events().bindComponent(this)
    }

    navigationButtonPressed({ buttonId }) {
        Navigation.push(this.props.componentId, {
            component: {
                name: "Setting"
            }
        })
    }

    static options = {
        topBar: {
            rightButtons: {
                icon: require("../images/setting_line.png")
            },
            title: {
                text: "AcFun 文章区",
            }
        }
    }

    indexList = indexList

    cursorList = [
        "first_page",
        "first_page",
        "first_page",
        "first_page",
        "first_page",
        "first_page",
        "first_page",
    ]

    limit = 20

    // state = {
    //     articleList: [],
    //     currentIndex: this.props.currentIndex ? this.props.currentIndex : 0,
    //     currentChildIndexList: this.props.currentChildIndexList ? this.props.currentChildIndexList : this.indexList.map((value, index) => (index === 0 ? [0] : value.childList.map((_value, _index) => _index))),
    //     currentOrderIndex: this.props.currentOrderIndex ? this.props.currentOrderIndex : 0,
    //     currentRangeIndex: this.props.currentRangeIndex ? this.props.currentRangeIndexRange : 0,
    //     currentRankRangeIndex: this.props.currentRankRangeIndex ? this.props.currentRankRangeIndexRange : 0
    // }

    state = {
        articleList: [],
        currentIndex: this.props.currentIndex,
        currentChildIndexList: this.props.currentChildIndexList,
        currentOrderIndex: this.props.currentOrderIndex,
        currentRangeIndex: this.props.currentRangeIndex,
        currentRankRangeIndex: this.props.currentRankRangeIndex
    }

    o = Dimensions.get("window").width / 640

    topScroll = createRef()

    secScroll = createRef()

    listScroll = createRef()

    async componentDidMount() {
        this.switchToIndex(this.state.currentIndex, true)
    }

    componentDidUpdate() {
        const { currentIndex, currentChildIndexList, currentOrderIndex, currentRangeIndex, currentRankRangeIndex } = this.state
        storage.save({
            key: "currentIndex",
            data: currentIndex
        })
        storage.save({
            key: "currentChildIndexList",
            data: currentChildIndexList
        })
        storage.save({
            key: "currentOrderIndex",
            data: currentOrderIndex
        })
        storage.save({
            key: "currentRangeIndex",
            data: currentRangeIndex
        })
        storage.save({
            key: "currentRankRangeIndex",
            data: currentRankRangeIndex
        })
    }

    renderArticleFloor = e => <ArticleFloor {...e.item} componentId={this.props.componentId} />

    switchToIndex = async (index, first = false, replace = true) => {

        const { indexList, topScroll, secScroll, listScroll, getRankList, getArticleList, cursorList } = this

        const { articleList, currentIndex, currentChildIndexList, currentOrderIndex, currentRangeIndex, currentRankRangeIndex } = this.state

        if (currentIndex === index && !first) return

        if (replace) cursorList[index] = "first_page"

        topScroll.current.scrollTo({ x: 0, animated: false })

        secScroll.current.scrollTo({ x: 0, animated: false })

        listScroll.current.scrollToOffset({ offset: 0, animated: false })

        if (index === 0) {
            this.setState({
                articleList: [...(replace ? [] : articleList), ...(await getRankList(indexList[0].childList[currentChildIndexList[0][0]].subChannelId, indexList[0].rangeList[currentRankRangeIndex].data))],
                currentIndex: index
            })
            if (!replace) this.refresh = {
                index,
                updating: false
            }
            return
        }

        this.setState({
            articleList: [...(replace ? [] : articleList), ...(await getArticleList(cursorList[index], indexList[index].orderList[currentOrderIndex].data, indexList[index].rangeList[currentRangeIndex].data, currentChildIndexList[index].map(value => indexList[index].childList[value].realmId), index))],
            currentIndex: index
        })

        if (!replace) this.refresh = {
            index,
            updating: false
        }
    }

    switchChildIndex = async childIndex => {
        const { indexList, listScroll, getRankList, getArticleList, cursorList } = this
        const { currentIndex, currentChildIndexList, currentOrderIndex, currentRangeIndex } = this.state
        if (currentIndex === 0) {
            if (currentChildIndexList[0][0] === childIndex) return
            cursorList[0] = "first_page"
            listScroll.current.scrollToOffset({ offset: 0, animated: false })
            const _ = [...currentChildIndexList]
            _[0][0] = childIndex
            this.setState({
                articleList: await getRankList(indexList[0].childList[childIndex].subChannelId, indexList[0].rangeList[currentRangeIndex].data),
                currentChildIndexList: _
            })
            return
        }

        cursorList[currentIndex] = "first_page"

        listScroll.current.scrollToOffset({ offset: 0, animated: false })

        if (currentChildIndexList[currentIndex].includes(childIndex)) {
            const _ = [...currentChildIndexList]
            _[currentIndex].splice(_[currentIndex].indexOf(childIndex), 1)
            this.setState({
                articleList: await getArticleList(cursorList[currentIndex], indexList[currentIndex].orderList[currentOrderIndex].data, indexList[currentIndex].rangeList[currentRangeIndex].data, _[currentIndex].map(value => indexList[currentIndex].childList[value].realmId), currentIndex),
                currentChildIndexList: _
            })
            return
        }

        const _ = [...currentChildIndexList]
        _[currentIndex].push(childIndex)
        this.setState({
            articleList: await getArticleList(cursorList[currentIndex], indexList[currentIndex].orderList[currentOrderIndex].data, indexList[currentIndex].rangeList[currentRangeIndex].data, _[currentIndex].map(value => indexList[currentIndex].childList[value].realmId), currentIndex),
            currentChildIndexList: _
        })
    }

    switchRangeIndex = async rangeIndex => {
        const { indexList, listScroll, getRankList, getArticleList, cursorList } = this
        const { currentIndex, currentChildIndexList, currentOrderIndex, currentRangeIndex, currentRankRangeIndex } = this.state
        if (currentIndex === 0) {
            if (currentRankRangeIndex === rangeIndex) return
            cursorList[currentIndex] = "first_page"
            listScroll.current.scrollToOffset({ offset: 0, animated: false })
            const _ = await getRankList(indexList[0].childList[currentChildIndexList[0][0]].subChannelId, indexList[0].rangeList[rangeIndex].data)
            this.setState({
                articleList: _,
                currentRankRangeIndex: rangeIndex
            })
            return
        }

        if (currentRangeIndex === rangeIndex) return
        cursorList[currentIndex] = "first_page"
        listScroll.current.scrollToOffset({ offset: 0, animated: false })
        this.setState({
            currentRangeIndex: rangeIndex,
            articleList: await getArticleList(cursorList[currentIndex], indexList[currentIndex].orderList[currentOrderIndex].data, indexList[currentIndex].rangeList[rangeIndex].data, currentChildIndexList[currentIndex].map(value => indexList[currentIndex].childList[value].realmId), currentIndex)
        })
    }

    switchOrderIndex = async orderIndex => {
        if (this.state.currentOrderIndex === orderIndex) return
        this.listScroll.current.scrollToOffset({ offset: 0, animated: false })
        const { currentIndex } = this.state
        this.cursorList[currentIndex] = "first_page"
        const _ = await this.getArticleList(this.cursorList[currentIndex], this.indexList[currentIndex].orderList[orderIndex].data, this.indexList[currentIndex].rangeList[this.state.currentRangeIndex].data, this.state.currentChildIndexList[currentIndex].map(value => this.indexList[currentIndex].childList[value].realmId), currentIndex)
        this.setState({
            articleList: _,
            currentOrderIndex: orderIndex
        })
    }

    getRankList = async (subChannelId, range) => {
        const { data: { rankList } } = await axios(`https://www.acfun.cn/rest/pc-direct/rank/channel?channelId=63&subChannelId=${subChannelId}&rankLimit=30&rankPeriod=${range}`)
        return rankList.map(value => ({
            articleId: value.resourceId,
            commentCount: value.commentCount,
            createTime: value.contributeTime,
            formatCommentCount: value.commentCountTenThousandShow,
            viewCount: value.viewCount,
            formatViewCount: value.viewCountShow,
            realmId: value.channelId,
            title: value.contentTitle,
            userId: value.userId,
            userName: value.userName
        }))
    }

    getArticleList = async (_cursor, order, range, realmIdList, index) => {
        if (!realmIdList[0]) return []
        try {
            const { data: { data, cursor } } = await axios({
                url: "https://www.acfun.cn/rest/pc-direct/article/feed",
                method: "POST",
                data: `cursor=${_cursor}&onlyOriginal=false&limit=20&sortType=${order}&timeRange=${range}${realmIdList.map(value => `&realmId=${value}`).join("")}`
            })
            this.cursorList[index] = cursor
            return data ? data : []
        } catch (error) {
            return []
        }
    }

    onSwipeRight = () => this.state.currentIndex >= 1 ? this.switchToIndex(this.state.currentIndex - 1) : null

    onSwipeLeft = () => this.state.currentIndex <= 6 ? this.switchToIndex(this.state.currentIndex + 1) : null

    refresh = {
        index: 0,
        updating: false
    }

    addArticle = () => {
        if (this.state.currentIndex === 0 || (this.refresh.index === this.state.currentIndex && this.refresh.updating)) return
        this.refresh = {
            index: this.state.currentIndex,
            updating: true
        }
        this.switchToIndex(this.state.currentIndex, true, false)
    }

    startPoint = 0

    endPoint = 0

    width = Dimensions.get("window").width

    touchStart = e => this.startPoint = e.nativeEvent.pageX

    touchEnd = e => {
        const { width } = this
        this.endPoint = e.nativeEvent.pageX
        if (this.endPoint - this.startPoint >= width / 3) this.onSwipeRight()
        if (this.startPoint - this.endPoint >= width / 3) this.onSwipeLeft()
    }

    render() {

        const { indexList, o, topScroll, secScroll, listScroll, renderArticleFloor, switchToIndex, switchChildIndex, switchRangeIndex, switchOrderIndex, touchStart, touchEnd, addArticle } = this

        const { articleList, currentIndex, currentChildIndexList, currentOrderIndex, currentRangeIndex, currentRankRangeIndex } = this.state

        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                    {
                        indexList.map((value, index) => <Pressable key={value.name} onPress={() => switchToIndex(index)}><Text style={{ textAlign: "center", lineHeight: 70 * o, fontSize: 24 * o, fontWeight: "700", color: currentIndex === index ? "#FD4C5C" : "black" }}>{value.name}</Text></Pressable>)
                    }
                </View>
                <ScrollView style={{ height: 50 * o, flexGrow: 0 }} horizontal={true} showsHorizontalScrollIndicator={false} ref={topScroll}>
                    {
                        indexList[currentIndex].childList.map((value, index) => <Pressable key={value.name} onPress={() => switchChildIndex(index)} style={{ justifyContent: "center", marginLeft: index === 0 ? 12 * o : 0, marginRight: 12 * o }}>
                            <Text style={{ fontSize: 22 * o, lineHeight: 40 * o, borderRadius: 20 * o, backgroundColor: currentChildIndexList[currentIndex].includes(index) ? "#FFECEE" : "#F2F2F2", paddingLeft: 16 * o, paddingRight: 16 * o, color: currentChildIndexList[currentIndex].includes(index) ? "#FD4C5D" : "#999999" }}>{value.name}</Text>
                        </Pressable>)
                    }
                </ScrollView>
                <ScrollView style={{ height: 50 * o, flexGrow: 0, marginBottom: 10 * o, marginTop: 6 * o }} horizontal={true} showsHorizontalScrollIndicator={false} ref={secScroll}>
                    {
                        indexList[currentIndex].orderList.map((value, index) => <Pressable key={value.name} onPress={() => switchOrderIndex(index)} style={{ justifyContent: "center", marginLeft: index === 0 ? 12 * o : 0, marginRight: 12 * o }}>
                            <Text style={{ fontSize: 22 * o, lineHeight: 40 * o, borderRadius: 20 * o, backgroundColor: currentOrderIndex === index ? "#FFECEE" : "#F2F2F2", paddingLeft: 16 * o, paddingRight: 16 * o, color: currentOrderIndex === index ? "#FD4C5D" : "#999999" }}>{value.name}</Text>
                        </Pressable>)
                    }
                    {
                        currentIndex === 0 ?
                            indexList[currentIndex].rangeList.map((value, index) => <Pressable key={value.name} onPress={() => switchRangeIndex(index)} style={{ justifyContent: "center", marginLeft: index === 0 ? 12 * o : 0, marginRight: 12 * o }}>
                                <Text style={{ fontSize: 22 * o, lineHeight: 40 * o, borderRadius: 20 * o, backgroundColor: currentRankRangeIndex === index ? "#FFECEE" : "#F2F2F2", paddingLeft: 16 * o, paddingRight: 16 * o, color: currentRankRangeIndex === index ? "#FD4C5D" : "#999999" }}>{value.name}</Text>
                            </Pressable>) :
                            indexList[currentIndex].rangeList.map((value, index) => <Pressable key={value.name} onPress={() => switchRangeIndex(index)} style={{ justifyContent: "center", marginLeft: index === 0 ? 12 * o : 0, marginRight: 12 * o }}>
                                <Text style={{ fontSize: 22 * o, lineHeight: 40 * o, borderRadius: 20 * o, backgroundColor: currentRangeIndex === index ? "#FFECEE" : "#F2F2F2", paddingLeft: 16 * o, paddingRight: 16 * o, color: currentRangeIndex === index ? "#FD4C5D" : "#999999" }}>{value.name}</Text>
                            </Pressable>)
                    }
                </ScrollView>
                {/* <GestureRecognizer style={{ flex: 1 }} onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
                    <FlatList
                        style={{ flex: 1, paddingTop: 20 * o, backgroundColor: "white", zIndex: 1, elevation: 1 }}
                        data={articleList}
                        renderItem={renderArticleFloor}
                        keyExtractor={item => item.articleId}
                        showsVerticalScrollIndicator={false}
                        ref={listScroll}
                        onEndReachedThreshold={0.5}
                        onEndReached={addArticle}
                        onTouchStart={e => console.log("Start", e.nativeEvent)}
                        onTouchEnd={e => console.log("End", e.nativeEvent)}
                        onTouchCancel={e => console.log("End", e.nativeEvent)}
                    />
                </GestureRecognizer> */}
                <FlatList
                    style={{ flex: 1, paddingTop: 20 * o, backgroundColor: "white", zIndex: 1, elevation: 1 }}
                    data={articleList}
                    renderItem={renderArticleFloor}
                    keyExtractor={item => item.articleId}
                    showsVerticalScrollIndicator={false}
                    ref={listScroll}
                    onEndReachedThreshold={0.5}
                    onEndReached={addArticle}
                    // onTouchStart={touchStart}
                    // onTouchCancel={touchEnd}
                />
            </View>
        )
    }
}