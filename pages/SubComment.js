import React, { Component } from "react"
import { View, Text, Image, FlatList, Dimensions, Pressable } from "react-native"
import axios from "axios"
import { storage, commentToJSX, getLoginUserInfo } from "../utils"
import { SendComment, MessageBox } from "./Component"
import ImageView from "react-native-image-viewing"
import { Navigation } from "react-native-navigation"

class SubFloor extends Component {

    o = Dimensions.get("window").width / 640

    render() {

        const { o } = this

        const { userName, content, deviceModel, userId, timestamp, postDate, replyToUserName, avatarUrl, commentId, imageList, JSXList, likeCount, showReplyUserName, index, onPress, showImageViewer } = this.props

        const _avatarUrl = avatarUrl.replace("http:", "https:")

        return (
            <Pressable onPress={onPress} style={{ paddingLeft: 96 * o, paddingTop: 23 * o, paddingRight: 22 * o, paddingBottom: index === 0 ? 20 * o : 0, backgroundColor: index === 0 ? "white" : "transparent" }}>
                <View style={{ position: "absolute", width: 54 * o, height: 54 * o, borderRadius: 27 * o, top: 22 * o, left: 22 * o, overflow: "hidden" }}>
                    <Image source={{ uri: _avatarUrl }} style={{ width: 54 * o, height: 54 * o }} />
                </View>
                <View style={{ position: "absolute", right: 22 * o, top: 26 * o, flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontSize: 22 * o, letterSpacing: 1 * o, color: "#A4A4A4" }}>{likeCount}</Text>
                    <Image source={require("../images/like.png")} style={{ width: 24 * o, height: 24 * o, marginLeft: 8 * o }} />
                </View>
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: 22 * o, color: "black", fontWeight: "700", flex: 0 }}>{userName} </Text>
                    {
                        replyToUserName ?
                            <>
                                <Text style={{ fontSize: 22 * o, color: "black", flex: 0, color: "#999999" }}>  回复  </Text>
                                <Text style={{ fontSize: 22 * o, color: "black", fontWeight: "700", flex: 0 }}>{replyToUserName} </Text>
                            </> : <></>
                    }
                </View>
                <Text style={{ fontSize: 18 * o, color: "#A4A4A4" }}>{postDate}  {deviceModel}</Text>
                <View style={{ marginTop: 8 * o }}>
                    <View>
                        <Text style={{ fontSize: 24 * o, lineHeight: 42 * o, letterSpacing: 2 * o, color: "black" }}>
                            {JSXList}
                        </Text>
                    </View>
                    {
                        imageList[0] ? <Pressable onPress={() => showImageViewer(imageList.map(value => ({ uri: value })))}  style={{ marginTop: 16 * o, height: 196 * o, flexDirection: "row", alignItems: "center" }} ><Image source={{ uri: imageList[0] }} style={{ width: 196 * o, height: 196 * o }} resizeMode="center" />{
                            imageList[1] ? <Text>1 / {imageList.length}</Text> : <></>
                        }</Pressable> : <></>
                    }
                </View>
                {
                    index === 0 ? null : <View style={{ height: 1, backgroundColor: "#EEEEEE", marginTop: 20 }}></View>
                }
            </Pressable>
        )
    }
}

export default class SubComment extends Component {

    constructor(props) {
        super(props)
        Navigation.events().bindComponent(this)
    }

    static options = {
        topBar: {
            rightButtons: {
                icon: require("../images/edit.png")
            }
        }
    }

    navigationButtonPressed({ buttonId }) {
        this.showReplyToSomeone()
    }

    commentToJSX = commentToJSX

    o = Dimensions.get("window").width / 640

    state = {
        subCommentList: [],
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
            subCommentList: await this.getSubComment()
        })
    }

    decode = str => str.replace(/&#[\d\w]+;/ig, i => String.fromCharCode(i.slice(2, -1) * 1))

    getSubComment = async () => {

        if (this.nextPage > this.totalPage) {
            this.refreshing = false
            this.showMessage("没有更多评论了哦")
            return
        }

        const { data: { rootComment, subComments, subCommentCount, totalPage } } = await axios({
            url: `https://www.acfun.cn/rest/pc-direct/comment/sublist?sourceId=${this.props.articleId}&sourceType=3&rootCommentId=${this.props.rootCommentId}&page=${this.nextPage}&t=${(new Date()) * 1}&supportZtEmot=true`,
            method: "GET"
        })


        this.nextPage++

        this.totalPage = totalPage

        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                title: {
                    color: "#FFFFFF",
                    text: `${subCommentCount}条回复`,
                    alignment: "center"
                }
            }
        })

        const _rootComments = (rootComment ? [rootComment] : []).map(value => {
            const _ = Object.assign({}, value)
            _.floorId = "root" + _.commentId
            return _
        })

        const _subComments = (subComments ? subComments : []).map(value => {
            const _ = Object.assign({}, value)
            _.floorId = "sub" + _.commentId
            return _
        })

        const res = [..._rootComments, ..._subComments].map(comment => {
            const { JSXList, imageList } = this.commentToJSX(comment.content)
            comment.JSXList = JSXList
            comment.imageList = imageList
            comment.userName = this.decode(comment.userName)
            comment.avatarUrl = comment.headUrl[0].url
            comment.articleId = this.props.articleId
            return comment
        })
        this.refreshing = false
        return res
    }

    renderSubFloor = e => <SubFloor onPress={() => this.showReplyToSomeone(e.item.commentId, e.item.userName)} key={e.item.floorId} {...e.item} index={e.index} showImageViewer={this.showImageViewer} />

    showReplyToSomeone = async (replyToCommentId = this.props.rootCommentId, replyToUserName = "楼主") => {

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
            replyToCommentId: this.props.rootCommentId,
            replyToUserName: "楼主",
        })
    }


    nextPage = 1

    totalPage = 1

    refreshing = false

    addSubComment = async () => {
        if (this.refreshing) return
        this.refreshing = true
        const _ = await this.getSubComment()
        const __ = []
        _.forEach(value => {
            if (!this.state.subCommentList.find(_value => _value.floorId === value.floorId)) {
                __.push(value)
            }
        })
        this.setState({
            subCommentList: [...(this.state.subCommentList), ...__]
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
            subCommentList: []
        })
        this.addSubComment()
    }

    showImageViewer = list => this.setState({
        imageViewerList: list,
        imageViewerVisible: true
    })

    render() {

        const { renderSubFloor, o, cancelReplyToSomeone, addSubComment, showMessage, newComment } = this

        const { subCommentList, showReply, replyToCommentId, replyToUserName, message, imageViewerList, imageViewerVisible } = this.state

        return (
            <View style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
                <FlatList
                    style={{ flex: 1 }}
                    data={subCommentList}
                    renderItem={renderSubFloor}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.commentId}
                    onEndReachedThreshold={0.5}
                    onEndReached={addSubComment}
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