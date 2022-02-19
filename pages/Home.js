import React, { useEffect, Component } from "react"
import { View, Text, Button } from "react-native"
import RNFS from "react-native-fs"
import { launchImageLibrary } from "react-native-image-picker"
import { Buffer } from "buffer"
import FormData from "form-data"
import axios from "axios"

export default class Home extends Component {

    pick = async e => {
        const result = await launchImageLibrary()
        console.log(result)
        console.log(result.assets[0].uri.slice(7))
        // console.log(RNFS.CachesDirectoryPath)
        // console.log(Buffer.from(await RNFS.readFile(result.assets[0].uri.slice(7), "base64"), "base64"))
        // const formData = new FormData()
        // // console.log(formData.getHeaders)
        // formData.append("file", {
        //     name: result.assets[0].fileName,
        //     type: result.assets[0].type,
        //     uri: result.assets[0].uri.slice(7)
        // })
        // axios({
        //     url: "http://192.168.31.217:9876/upload",
        //     method: "post",
        //     data: formData
        // }).then(res => {
        //     console.log(res.data)
        // }).catch(err => {
        //     console.log(err)
        // })
        const files = [{
            name: "file",
            filename: result.assets[0].fileName,
            filepath: result.assets[0].uri.slice(7),
            filetype: result.assets[0].type
        }]

        RNFS.uploadFiles({
            toUrl: "http://192.168.31.217:9876/upload",
            files,
            method: "POST"
        })
    }

    render() {
        return (
            <View>
                <Button onPress={this.pick} title="测试一下"/>
            </View>
        )
    }
}