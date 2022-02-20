import React, { Component, createRef } from "react"
import { View, Text, Image, FlatList, Dimensions, Pressable, Linking, TextInput } from "react-native"
import axios from "axios"
import { storage, getImage, sendCommentToAcFun, commentToJSX } from "../utils"
import { Navigation } from "react-native-navigation"

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
        // this.setState({
        //     commentContent: `${this.state.commentContent}\r\n[img=图片]${url}[/img]\r\n`
        // })
    }

    o = Dimensions.get("window").width / 640

    changeText = text => {
        this.setState({
            commentContent: text
        })
    }

    deleteImage = url => {

        const _ = [...this.state.uploadImageList]

        _.splice(_.indexOf(url), 1)

        this.setState({
            uploadImageList: _,
            // commentContent: this.state.commentContent.replace(`[img=图片]${url}[/img]`, "")
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

        const imageText = this.state.uploadImageList.map(value => `\r\n[img=图片]${value}[/img]`).join("")

        const code = await sendCommentToAcFun(this.state.commentContent + imageText, this.props.articleId, this.props.replyToCommentId)
        if (code * 1 === 200) {
            this.props.showMessage("发送成功")
            this.props.newComment()
            this.props.cancelReplyToSomeone()
        }
        else {
            this.props.showMessage("发送失败")
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
                <View style={{ flexDirection: "row", padding: 20 * o, justifyContent: "flex-start", flexWrap: "wrap" }}>
                    {
                        uploadImageList.map((value, index) => <View style={{ marginRight: (index % 3 !== 2) ? 15 * o : 0, marginTop: index > 2 ? 15 * o : 0 }}>
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

export class MessageBox extends Component {

    o = Dimensions.get("window").width / 640

    render() {
        return (
            <View style={{ position: "absolute", width: Dimensions.get("window").width, height: 1000 * this.o, left: 0, top: 0, justifyContent: "center", alignItems: "center", display: this.props.message ? "flex" : "none" }} >
                <Text style={{ lineHeight: 50 * this.o, fontSize: 30 * this.o, backgroundColor: "rgba(0, 0, 0, 0.5)", paddingLeft: 20 * this.o, paddingRight: 20 * this.o, borderRadius: 6 * this.o, color: "white" }}>{this.props.message}</Text>
            </View>
        )
    }
}