import React, { Component, createRef } from "react"
import { View, Text, Image, Dimensions, TextInput, Pressable } from "react-native"
import { Navigation } from "react-native-navigation"
import WebView from "react-native-webview"
import { storage } from "../utils"

export default class Login extends Component {

    static options = {
        topBar: {
            title: {
                text: "登录"
            }
        }
    }

    width = Dimensions.get("window").width
    height = Dimensions.get("window").height
    o = Dimensions.get("window").width / 640
    account = ""
    password = ""
    cookie = ""
    code = ""
    webview = createRef()

    state = {
        image: "",
        showInputCookie: false,
        text: "登录",
        disabled: false,
        color: "#FD4C5D"
    }

    timer = null

    loginAccount = () => {

        this.setState({
            text: "登录中...",
            disabled: true,
            color: "#6E6E6E"
        })

        this.timer = setTimeout(() => {
            this.setState({
                text: "登录",
                disabled: fasle,
                color: "#FD4C5D"
            })
        }, 5000)

        if (this.state.showInputCookie) {
            if (this.cookie.includes("username")) {
                if (this.cookie.startsWith("'") || this.cookie.startsWith('"')) this.cookie = this.cookie.slice(1, -1)
                storage.save({
                    key: "cookie",
                    data: this.cookie
                })
                Navigation.pop(this.props.componentId)
            } else {
                alert("请在网页登录后重试，或者注销再登录")
            }
        }
        this.webview.current.postMessage(JSON.stringify({
            account: this.account,
            password: this.password
        }))
    }

    listen = e => {
        const { type, data } = JSON.parse(e.nativeEvent.data)
        switch (type) {
            case "cookie":
                if (data.includes("username")) {
                    storage.save({
                        key: "cookie",
                        data
                    })
                    Navigation.pop(this.props.componentId)
                } else {
                    alert("登录失败")
                }
                break

            case "code":
                this.setState({
                    image: data
                })
                break

            default:
                break
        }
    }

    componentWillUnmount() {
        if (this.timer) clearTimeout(this.timer)
    }

    render() {

        const { o, width, height, webview, loginAccount, listen } = this

        return (
            <View style={{ flex: 1 }}>
                <WebView
                    source={{ uri: "https://www.acfun.cn/login/" }}
                    userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36"
                    style={{ display: "none" }}
                    injectedJavaScript={`
                        const postMessage = message => window.ReactNativeWebView.postMessage(JSON.stringify(message))
                        if (location.href === "https://www.acfun.cn/login/") {
                            const targetNode = document.getElementsByClassName("captcha-pic l")[0]
                            const config = { attributes: true }
                            const callback = function (m, o) {
                                postMessage({
                                    type: "code",
                                    data: targetNode.src
                                })
                            }
                            const observer = new MutationObserver(callback)
                            observer.observe(targetNode, config)
                            document.getElementById("login-switch").click()
                            document.addEventListener("message", e => {
                                const { account, password, code } = JSON.parse(e.data)
                                document.getElementById("ipt-account-login").value = account
                                document.getElementById("ipt-pwd-login").value = password
                                document.getElementById("ipt-check-login").value = code
                                document.getElementsByClassName("btn-login")[0].click()
                            })
                        }
                        else {
                            postMessage({
                                type: "cookie",
                                data: document.cookie
                            })
                        }
                    `}
                    ref={webview}
                    onMessage={listen}
                />
                <Pressable style={{ position: "absolute", left: 0, top: 0, width, height }}>
                    <View style={{ backgroundColor: "#FD4C5D", height: 220 * o }}>
                        <Image source={require("../images/login_bg.png")} style={{ width: 522 * o, height: 198 * o, position: "absolute", bottom: 0, left: 59 * o }} />
                    </View>
                    <View style={{ padding: 40 * o }}>

                        {
                            this.state.showInputCookie ?
                                <>
                                    <TextInput placeholder="请在此处粘贴你的 cookie，" style={{ fontSize: 32 * o }} onChangeText={text => this.cookie = text}></TextInput>
                                    <View style={{ height: 0.8 * o, backgroundColor: "#DDDDDD" }}></View>
                                    <Text style={{ fontSize: 30 * o }}>
                                        方法：先在PC网页端登录A站，按下键盘上的F12，在弹窗中点击左上角的【控制台】选项，然后在下方输入<Text style={{ color: "red", fontWeight: "700" }}>document.cookie</Text>，按下回车键，复制打印出来的字符串发送到手机上，在此处粘贴出来
                                    </Text>
                                </> :
                                <>
                                    <TextInput placeholder="手机号 / 邮箱" style={{ fontSize: 32 * o }} onChangeText={text => this.account = text}></TextInput>
                                    <View style={{ height: 0.8 * o, backgroundColor: "#DDDDDD" }}></View>
                                    <TextInput placeholder="密码" secureTextEntry={true} style={{ fontSize: 32 * o }} onChangeText={text => this.password = text}></TextInput>
                                    <View style={{ height: 0.8 * o, backgroundColor: "#DDDDDD" }}></View>
                                    {
                                        this.state.image === "" ? null : <View>
                                            <View style={{ flexDirection: "row" }}>
                                                <TextInput placeholder="验证码" style={{ fontSize: 32 * o, width: 290 * o }} onChangeText={text => this.code = text}></TextInput>
                                                <View style={{ height: 100 * o, width: 290 * o }}>
                                                    <Image source={{ uri: this.state.image }} style={{ height: 100 * o, width: 290 * o }} />
                                                </View>
                                            </View>
                                            <View style={{ height: 0.8 * o, backgroundColor: "#DDDDDD" }}></View>
                                        </View>
                                    }
                                    <Pressable onPress={() => this.setState({ showInputCookie: true })} style={{ padding: 10 * o }}><Text style={{ fontSize: 30 * o }}>无法登录？</Text></Pressable>
                                </>
                        }
                        <Pressable disabled={this.state.disabled} onPress={loginAccount} style={{ backgroundColor: this.state.color, alignItems: "center", marginTop: 32 * o, borderRadius: 32 * o }}>
                            <Text style={{ fontSize: 36 * o, lineHeight: 80 * o, color: "white" }}>{this.state.text}</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </View>
        )
    }
}