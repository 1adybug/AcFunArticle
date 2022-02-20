import React, { Component } from "react"
import { View, Text, Image, Pressable, Dimensions } from "react-native"

export default class Loading extends Component {

    static options = {
        topBar: {
            visible: false
        }
    }

    render() {

        const width = Dimensions.get("window").width

        return (
            <View style={{ flex: 1, backgroundColor: "#FD4C5D" }}>
                <Image source={require("../images/splash.png")} style={{ width: 0.33 * width, height: 0.225 * width, position: "absolute", left: 0.335 * width, top: 0.6 * width }} />
                <Image source={require("../images/logo.png")} style={{ width: 0.2585 * width, height: 0.0825 * width, position: "absolute", left: 0.37075 * width, bottom: 0.2 * width }} />
            </View>
        )
    }
}