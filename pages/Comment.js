import React, { Component, createRef } from "react"
import { View, Text, Image, FlatList, Dimensions, Pressable, Linking, TextInput, Alert } from "react-native"
import axios from "axios"
import { storage, getImage, sendCommentToAcFun, commentToJSX } from "../utils"
import { Navigation } from "react-native-navigation"

class Floor extends Component {

    o = Dimensions.get("window").width / 640

    render() {

        const { o } = this

        const { userName, content, deviceModel, userId, timestamp, postDate, replyToUserName, avatarUrl, commentId, JSXList, imageList, likeCount, subCommentCount, showReplyUserName, onPress } = this.props

        return (
            <Pressable onPress={onPress} style={{ paddingLeft: 96 * o, paddingTop: 23 * o, paddingRight: 22 * o }}>
                <View style={{ position: "absolute", width: 54 * o, height: 54 * o, borderRadius: 27 * o, top: 22 * o, left: 22 * o, overflow: "hidden" }}>
                    <Image source={{ uri: avatarUrl }} style={{ width: 54 * o, height: 54 * o }} />
                </View>
                <View style={{ position: "absolute", right: 22 * o, top: 26 * o, flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontSize: 22 * o, letterSpacing: 1 * o, color: "#A4A4A4" }}>{likeCount}</Text>
                    <Image source={require("../images/like.png")} style={{ width: 24 * o, height: 24 * o, marginLeft: 8 * o }} />
                </View>
                <Text style={{ fontSize: 22 * o, color: "black", fontWeight: "900" }}>{userName}</Text>
                <Text style={{ fontSize: 18 * o, color: "#A4A4A4" }}>{postDate}  {deviceModel}</Text>
                <View style={{ marginTop: 8 * o }}>
                    <View>
                        <Text style={{ fontSize: 24 * o, lineHeight: 42 * o, letterSpacing: 2 * o, color: "black" }}>
                            {JSXList}
                        </Text>
                    </View>
                    {
                        imageList[0] ? <View style={{ marginTop: 16 * o, height: 196 * o, flexDirection: "row", alignItems: "center" }} ><Image source={{ uri: imageList[0] }} style={{ width: 196 * o, height: 196 * o }} resizeMode="center" />{
                            imageList[1] ? <Text>1 / {imageList.length}</Text> : <></>
                        }</View> : <></>
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


export class SendComment extends Component {
    state = {
        uploadImageList: [],
        commentContent: "",
        currentEmotionIndex: 0,
        showEmotion: false
    }

    inputRef = createRef()

    packageScroll = createRef()

    uploadImage = async () => {
        const url = await getImage()
        this.setState({
            uploadImageList: [...this.state.uploadImageList, url]
        })
        this.setState({
            commentContent: `${this.state.commentContent}[img=图片]${url}[/img]`
        })
    }

    o = Dimensions.get("window").width / 640

    changeText = text => {
        this.setState({
            commentContent: text
        })
    }

    deleteImage = url => {

        const _ = [...this.state.uploadImageList]

        _.splice(_.indexOf("url"), 1)

        this.setState({
            uploadImageList: _,
            commentContent: this.state.commentContent.replace(`[img=图片]${url}[/img]`, "")
        })
    }

    emotionPackageList = []

    emotionList = []

    async componentDidMount() {
        if (!this.emotionPackageList[0]) this.emotionPackageList = await storage.load({ key: "emotionPackageList" })
        if (!this.emotionList[0]) this.emotionList = await storage.load({ key: "emotionList" })
        this.inputRef.current.focus()
    }

    switchToPackage = index => {
        this.packageScroll.current.scrollToOffset({ offset: 0, animated: false })
        this.setState({ currentEmotionIndex: index })
    }

    addEmotion = id => {
        this.setState({
            commentContent: `${this.state.commentContent}[emot=acfun,${id}/]`
        })
    }

    renderEmotionCover = e => <Pressable onPress={() => this.switchToPackage(e.index)} style={{ width: 640 / 6 * this.o, alignItems: "center" }}>
        <Image source={{ uri: e.item.cover }} style={{ width: 80 * this.o, height: 80 * this.o }} />
        <View style={{ width: 640 / 6 * this.o, height: 4 * this.o, backgroundColor: e.index === this.state.currentEmotionIndex ? "#FD4C5D" : "transparent" }}></View>
    </Pressable>

    renderEmotionPackage = e => <Pressable onPress={() => this.addEmotion(e.item.id)} style={{ width: 640 / 6 * this.o, alignItems: "center", paddingTop: 10 * this.o, paddingBottom: 10 * this.o }}>
        <Image source={{ uri: e.item.url }} style={{ width: 80 * this.o, height: 80 * this.o }} />
    </Pressable>

    showEmotionPackage = () => {
        this.inputRef.current.blur()
        this.setState({
            showEmotion: true
        })
    }

    send = async () => {
        const code = await sendCommentToAcFun(this.state.commentContent, this.props.articleId, "", this.props.replyToCommentId)
        if (code * 1 === 200) {
            alert("发送成功")
            this.props.cancelReplyToSomeone()
        }
        else {
            alert("发送失败")
        }
    }

    render() {

        const { uploadImage, o, inputRef, changeText, deleteImage, emotionPackageList, renderEmotionCover, renderEmotionPackage, packageScroll, showEmotionPackage, send } = this

        const { replyToCommentId, replyToUserName, cancelReplyToSomeone } = this.props

        const { uploadImageList, commentContent, currentEmotionIndex, showEmotion } = this.state

        return (
            <View style={{ width: 640 * o, position: "absolute", bottom: 0, backgroundColor: "white" }}>
                {/* 房价[emot=acfun,1652/][img=图片]https://imgs.aixifan.com/newUpload/981615_c76e2f2e9ed44838a953f0ceb6b1571d.png[/img] */}
                <View style={{ padding: 20 * o }}><TextInput onFocus={() => { this.setState({ showEmotion: false }) }} style={{ fontSize: 30 * o }} multiline={true} placeholder={replyToUserName ? `回复 ${replyToUserName}` : "说点什么..."} ref={inputRef} onChangeText={changeText} value={commentContent}></TextInput></View>
                <View style={{ flexDirection: "row", padding: 20 * o, justifyContent: "space-between" }}>
                    {
                        uploadImageList.map(value => <View>
                            <Image source={{ uri: value }} style={{ width: 190 * o, height: 190 * o }} />
                            <Pressable onPress={() => deleteImage(value)} style={{ position: "absolute", right: 0, top: 0, backgroundColor: "rgba(0, 0, 0, 0.2)", width: 50 * o, height: 50 * o }}>
                                <Text style={{ color: "white", fontSize: 40 * o, width: 50 * o, lineHeight: 50 * o, textAlign: "center" }}>×</Text>
                            </Pressable>
                        </View>)
                    }
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row" }}>
                        <Pressable onPress={uploadImage} style={{ padding: 20 * o }}>
                            <Image style={{ width: 50 * o, height: 50 * o }} source={require("../images/image_selector.png")} />
                        </Pressable>
                        <Pressable onPress={showEmotionPackage} style={{ padding: 20 * o }}>
                            <Image style={{ width: 50 * o, height: 50 * o }} source={require("../images/emotion_selector.png")} />
                        </Pressable>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Pressable onPress={cancelReplyToSomeone} style={{ padding: 20 * o }}>
                            <Text style={{ fontSize: 30 * o, lineHeight: 50 * o, width: 120 * o, color: "#666666", fontWeight: "700", textAlign: "center" }}>取 消</Text>
                        </Pressable>
                        <Pressable onPress={send} style={{ padding: 20 * o }}>
                            <Text style={{ fontSize: 30 * o, lineHeight: 50 * o, backgroundColor: "#FD4C5D", width: 120 * o, borderRadius: 10 * o, color: "white", fontWeight: "700", textAlign: "center" }}>发 送</Text>
                        </Pressable>
                    </View>
                </View>
                {
                    emotionPackageList[0] ? <View style={{ display: showEmotion ? "flex" : "none" }}>
                        <FlatList
                            data={emotionPackageList[currentEmotionIndex].emotions}
                            renderItem={renderEmotionPackage}
                            style={{ width: 640 * o, height: 420 * o, backgroundColor: "#F6F6F6" }}
                            numColumns={6}
                            showsHorizontalScrollIndicator={false}
                            ref={packageScroll}
                        />
                        <FlatList
                            data={emotionPackageList}
                            renderItem={renderEmotionCover}
                            horizontal={true}
                            style={{ width: 640 * o, paddingTop: 10 * o, paddingBottom: 10 * o }}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View> : <></>
                }

            </View>
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
            alert("没有更多评论了哦")
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

    renderFloor = e => <Floor onPress={() => this.showReplyToSomeone(e.item.commentId, e.item.userName)} key={e.item.floorId} {...e.item} goToSubComment={this.goToSubComment} />

    decode = str => str.replace(/&#[\d\w]+;/ig, i => String.fromCharCode(i.slice(2, -1) * 1))

    o = Dimensions.get("window").width / 640

    showReplyToSomeone = (replyToCommentId = "", replyToUserName = null) => {
        this.setState({
            showReply: true,
            replyToCommentId,
            replyToUserName,
        })
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

    render() {

        const { renderFloor, o, cancelReplyToSomeone, addComment } = this

        const { commentList, showReply, replyToCommentId, replyToUserName } = this.state

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
                    showReply ? <SendComment articleId={this.props.articleId} replyToCommentId={replyToCommentId} replyToUserName={replyToUserName} cancelReplyToSomeone={cancelReplyToSomeone} /> : null
                }
            </View>
        )
    }
}