import React, { Component } from "react"
import { View, Text, Image, Dimensions, Pressable, Linking } from "react-native"
import { Navigation } from "react-native-navigation"
import { storage, getLoginUserInfo } from "../utils"

export default class Setting extends Component {

    constructor(props) {
        super(props)
        Navigation.events().bindComponent(this)
    }

    o = Dimensions.get("window").width / 640

    goToLogin = () => {
        Navigation.push(this.props.componentId, {
            component: {
                name: "Login"
            }
        })
    }

    logout = () => {
        storage.remove({ key: "cookie" })
        this.setState({
            avatarUrl: "https://tx-free-imgs.acfun.cn/style/image/defaultAvatar.jpg",
            userName: "未登录",
            login: false
        })
    }

    async componentDidAppear() {
        const info = await getLoginUserInfo()
        if (info) {
            const { userName, avatarUrl } = info
            this.setState({
                userName, avatarUrl, login: true
            })
        }
    }

    state = {
        avatarUrl: "https://tx-free-imgs.acfun.cn/style/image/defaultAvatar.jpg",
        userName: "未登录",
        login: false
    }

    render() {

        const { o, goToLogin, logout } = this

        const { avatarUrl, userName, login } = this.state

        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: 360 * o }}>
                    <Image source={{ uri: "https://ali-imgs.acfun.cn/kos/nlav10360/static/space/static/img/bg.b05c10ef1e031e6b130c.jpg" }} style={{ position: "absolute", left: 0, top: 0, width: 640 * o, height: 360 * o, opacity: 0.5 }} />
                    <View style={{ width: 180 * o, height: 180 * o, alignSelf: "center", borderRadius: 90 * o, overflow: "hidden", marginTop: 30 * o }} >
                        <Image source={{ uri: avatarUrl }} style={{ width: 180 * o, height: 180 * o }} />
                    </View>
                    <Text style={{ alignSelf: "center", fontSize: 36 * o, color: "#333", marginTop: 50 * o, textShadowColor: "white", textShadowOffset: { width: 2 * o, height: 2 * o }, textShadowRadius: 30 * o, fontWeight: "700" }}> {userName} </Text>
                </View>
                {
                    login ?
                        <Pressable onPress={logout} style={{ padding: 20 * o, paddingLeft: 40 * o }}>
                            <Text style={{ fontSize: 36 * o, color: "black" }}>退出登录</Text>
                            <View style={{ height: 0.3 * o, backgroundColor: "#DDDDDD", position: "absolute", bottom: 0, width: 600 * o, left: 20 * o }}></View>
                        </Pressable>
                        :
                        <Pressable onPress={goToLogin} style={{ padding: 20 * o, paddingLeft: 40 * o }}>
                            <Text style={{ fontSize: 36 * o, color: "black" }}>登录账号</Text>
                            <View style={{ height: 0.3 * o, backgroundColor: "#DDDDDD", position: "absolute", bottom: 0, width: 600 * o, left: 20 * o }}></View>
                        </Pressable>
                }
                <Pressable style={{ padding: 20 * o, paddingLeft: 40 * o }}>
                    <Text style={{ fontSize: 36 * o, color: "black" }}>屏蔽列表</Text>
                    <View style={{ height: 0.3 * o, backgroundColor: "#DDDDDD", position: "absolute", bottom: 0, width: 600 * o, left: 20 * o }}></View>
                </Pressable>
                <Pressable style={{ padding: 20 * o, paddingLeft: 40 * o }}>
                    <Text style={{ fontSize: 36 * o, color: "black" }}>文章样式</Text>
                    <View style={{ height: 0.3 * o, backgroundColor: "#DDDDDD", position: "absolute", bottom: 0, width: 600 * o, left: 20 * o }}></View>
                </Pressable>
                <Pressable onPress={() => Linking.openURL("https://m.acfun.cn/upPage/981615")} style={{ padding: 20 * o, paddingLeft: 40 * o }}>
                    <Text style={{ fontSize: 36 * o, color: "black" }}>关注作者</Text>
                    <View style={{ height: 0.3 * o, backgroundColor: "#DDDDDD", position: "absolute", bottom: 0, width: 600 * o, left: 20 * o }}></View>
                </Pressable>
            </View>
        )
    }
}