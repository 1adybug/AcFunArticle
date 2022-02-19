import React, { Component } from "react"
import { View, Text, ScrollView, Pressable } from "react-native"
import GestureRecognizer from "react-native-swipe-gestures"

export default class Test extends Component {


    onSwipeRight(gestureState) {
        console.log("右滑了")
    }

    onSwipeUp() {
        console.log("上滑了")
    }

    render() {

        const { onSwipeRight, onSwipeUp } = this

        return (
            <GestureRecognizer
                style={{ flex: 1, backgroundColor: "skyblue" }}
                onSwipeRight={onSwipeRight}
                onSwipeUp={onSwipeUp}
            >
                <ScrollView style={{ flex: 1 }}>
                    <Pressable style={{ height: 2000, backgroundColor: "pink" }} onPress={() => console.log("被按下了")}>
                        
                    </Pressable>
                </ScrollView>
            </GestureRecognizer>
        )
    }
}