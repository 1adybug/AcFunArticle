import React, { Component, createRef } from "react"
import { View, Text, Image, FlatList, Dimensions, Pressable, Linking, TextInput, Platform } from "react-native"
import axios from "axios"
import { storage, getImage, sendCommentToAcFun, commentToJSX, getLoginUserInfo } from "../utils"
import { SendComment, MessageBox } from "./Component"
import ImageView from "react-native-image-viewing"
import { Navigation } from "react-native-navigation"

class Floor extends Component {

    o = Dimensions.get("window").width / 640

    render() {

        const { o } = this

        const { userName, content, deviceModel, userId, timestamp, postDate, replyToUserName, avatarUrl, commentId, JSXList, imageList, likeCount, subCommentCount, showReplyUserName, onPress, showImageViewer } = this.props

        const _avatarUrl = avatarUrl.replace("http:", "https:")

        return (
            <Pressable onPress={onPress} style={{ paddingLeft: 96 * o, paddingTop: 23 * o, paddingRight: 22 * o }}>
                <View style={{ position: "absolute", width: 54 * o, height: 54 * o, borderRadius: 27 * o, top: 22 * o, left: 22 * o, overflow: "hidden" }}>
                    <Image source={{ uri: _avatarUrl }} style={{ width: 54 * o, height: 54 * o }} />
                </View>
                <View style={{ position: "absolute", right: 22 * o, top: 26 * o, flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontSize: 22 * o, letterSpacing: 1 * o, color: "#A4A4A4" }}>{likeCount}</Text>
                    <Image source={require("../images/like.png")} style={{ width: 24 * o, height: 24 * o, marginLeft: 8 * o }} />
                </View>
                <Text style={{ fontSize: 22 * o, color: "black", fontWeight: "700" }}>{userName} </Text>
                <Text style={{ fontSize: 18 * o, color: "#A4A4A4" }}>{postDate}  {deviceModel}</Text>
                <View style={{ marginTop: 8 * o }}>
                    <View>
                        <Text style={{ fontSize: 24 * o, lineHeight: 42 * o, letterSpacing: 2 * o, color: "black" }}>
                            {JSXList}
                        </Text>
                    </View>
                    {
                        imageList[0] ? <Pressable onPress={() => showImageViewer(imageList.map(value => ({ uri: value })))} style={{ marginTop: 16 * o, height: 196 * o, flexDirection: "row", alignItems: "center" }} ><Image source={{ uri: imageList[0] }} style={{ width: 196 * o, height: 196 * o }} resizeMode="center" />{
                            imageList[1] ? <Text>1 / {imageList.length}</Text> : <></>
                        }</Pressable> : <></>
                    }
                </View>
                {
                    subCommentCount ? <Pressable onPress={() => this.props.goToSubComment(this.props.commentId)} style={{ marginTop: 14 * o, height: 38 * o, paddingLeft: 20 * o }}>
                        <View style={{ position: "absolute", width: 5 * o, height: 38 * o, backgroundColor: "#EEEEEE", left: 2 * o }}></View>

                        <Text style={{ lineHeight: 38 * o, fontSize: 22 * o, letterSpacing: 2.2 * o, color: "#547AA8" }}>
                            {showReplyUserName}
                            <Text style={{ lineHeight: 38 * o, fontSize: 22 * o, letterSpacing: 2.2 * o, color: "#252525" }}> 等人 </Text>
                            共{subCommentCount}条回复
                        </Text>

                    </Pressable> : <></>
                }

                <View style={{ height: 1, backgroundColor: "#EEEEEE", marginTop: 20 }}></View>
            </Pressable>
        )
    }
}

export default class Comment extends Component {


    constructor(props) {
        super(props)
        Navigation.events().bindComponent(this)
    }

    navigationButtonPressed({ buttonId }) {
        this.showReplyToSomeone()
    }

    commentToJSX = commentToJSX

    static options = {
        topBar: {
            rightButtons: {
                icon: require("../images/edit.png")
            }
        }
    }

    state = {
        commentList: [],
        showReply: false,
        replyToCommentId: "",
        replyToUserName: null,
        message: null,
        imageViewerList: [],
        imageViewerVisible: false
    }

    async componentDidMount() {

        if (!this.emotionPackageList) this.emotionPackageList = await storage.load({ key: "emotionPackageList" })
        if (!this.emotionList) this.emotionList = await storage.load({ key: "emotionList" })
        this.setState({
            commentList: await this.getComment()
        })

    }

    getComment = async () => {

        const { articleId } = this.props

        if (this.nextPage > this.totalPage) {
            this.refreshing = false
            this.showMessage("没有更多评论了哦")
            return
        }

        const { data: { rootComments, hotComments, subCommentsMap, stickyComments, totalPage } } = await axios({
            url: `https://www.acfun.cn/rest/pc-direct/comment/list?sourceId=${articleId}&sourceType=3&page=${this.nextPage}&pivotCommentId=0&newPivotCommentId=&t=${(new Date()) * 1}&supportZtEmot=true`,
            method: "GET"
        })

        this.nextPage++

        this.totalPage = totalPage

        const _stickyComments = (stickyComments ? stickyComments : []).map(value => {
            const _ = Object.assign({}, value)
            _.userName += "【置顶】"
            _.floorId = "sticky" + _.commentId
            return _
        })

        const _hotComments = (hotComments ? hotComments : []).map(value => {
            const _ = Object.assign({}, value)
            _.floorId = "hot" + _.commentId
            return _
        })

        const _rootComments = (rootComments ? rootComments : []).map(value => {
            const _ = Object.assign({}, value)
            _.floorId = "root" + _.commentId
            return _
        })

        const res = [..._stickyComments, ..._hotComments, ..._rootComments].map(comment => {
            const { JSXList, imageList } = this.commentToJSX(comment.content)
            comment.JSXList = JSXList
            comment.imageList = imageList
            comment.userName = this.decode(comment.userName)
            comment.avatarUrl = comment.headUrl[0].url
            comment.articleId = this.props.articleId
            return comment
        })

        for (let i in subCommentsMap) {
            const oList = res.find(value => (value.commentId === i * 1))
            if (oList) {
                oList.showReplyUserName = subCommentsMap[i].subComments[0].userName
                oList.showReplyUserName = this.decode(oList.showReplyUserName)
            }
        }

        this.refreshing = false

        return res
    }

    goToSubComment = commentId => {
        Navigation.push(this.props.componentId, {
            component: {
                name: "SubComment",
                passProps: {
                    articleId: this.props.articleId,
                    rootCommentId: commentId
                }
            }
        })
    }

    renderFloor = e => <Floor onPress={() => this.showReplyToSomeone(e.item.commentId, e.item.userName)} key={e.item.floorId} {...e.item} goToSubComment={this.goToSubComment} showImageViewer={this.showImageViewer} />

    decode = str => str.replace(/&#[\d\w]+;/ig, i => String.fromCharCode(i.slice(2, -1) * 1))

    o = Dimensions.get("window").width / 640

    showReplyToSomeone = async (replyToCommentId = "", replyToUserName = null) => {

        const info = await getLoginUserInfo()

        if (info) {
            this.setState({
                showReply: true,
                replyToCommentId,
                replyToUserName,
            })
        } else {
            Navigation.push(this.props.componentId, {
                component: {
                    name: "Login"
                }
            })
        }
    }

    cancelReplyToSomeone = () => {
        this.setState({
            showReply: false,
            replyToCommentId: "",
            replyToUserName: null,
        })
    }

    nextPage = 1

    totalPage = 1

    refreshing = false

    addComment = async () => {
        if (this.refreshing) return
        this.refreshing = true
        const _ = await this.getComment()
        const __ = []
        _.forEach(value => {
            if (!this.state.commentList.find(_value => _value.floorId === value.floorId)) {
                __.push(value)
            }
        })
        this.setState({
            commentList: [...(this.state.commentList), ...__]
        })
    }

    showMessage = data => {
        if (this.timer) clearTimeout(this.timer)
        this.setState({
            message: data
        })
        this.timer = setTimeout(() => {
            this.setState({
                message: null
            })
        }, 1500)
    }

    newComment = () => {
        this.nextPage = 1
        this.totalPage = 1
        this.setState({
            commentList: []
        })
        this.addComment()
    }


    showImageViewer = list => this.setState({
        imageViewerList: list,
        imageViewerVisible: true
    })

    render() {

        const { renderFloor, o, cancelReplyToSomeone, addComment, showMessage, newComment, showImageViewer } = this

        const { commentList, showReply, replyToCommentId, replyToUserName, message, imageViewerList, imageViewerVisible } = this.state

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    style={{ flex: 1 }}
                    data={commentList}
                    renderItem={renderFloor}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.floorId}
                    onEndReachedThreshold={0.5}
                    onEndReached={addComment}
                />
                {
                    showReply ? <SendComment articleId={this.props.articleId} replyToCommentId={replyToCommentId} replyToUserName={replyToUserName} cancelReplyToSomeone={cancelReplyToSomeone} showMessage={showMessage} newComment={newComment} /> : null
                }
                <ImageView
                    images={imageViewerList}
                    imageIndex={0}
                    visible={imageViewerVisible}
                    presentationStyle="overFullScreen"
                    onRequestClose={() => { this.setState({ imageViewerVisible: false }) }}
                    swipeToCloseEnabled={Platform.OS === "ios"}
                />
                <MessageBox message={message} />
            </View>
        )
    }
}