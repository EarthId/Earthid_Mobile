import { useTheme } from "@react-navigation/native";
import React, { useRef } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { RNCamera } from "react-native-camera";

import Button from "../../components/Button";
import { LocalImages } from "../../constants/imageUrlConstants";
import { Screens } from "../../themes/index";
import DocumentMask from "../uploadDocuments/DocumentMask";

const UploadScreen = (props: any) => {
  const _handleBarCodeRead = (barCodeData: any) => {};
  const { colors } = useTheme();
  const camRef: any = useRef();

  const _takePicture = async () => {
    const options = { quality: 0.1, base64: true };
    const data = await camRef.current.takePictureAsync(options);
    if (data) {
      let extension = data.uri.substring(data.uri.lastIndexOf(".") + 1);
      props.navigation.navigate("DocumentPreviewScreen", { fileUri: data });
    }
  };
  return (
    <View style={styles.sectionContainer}>
      <View style={{ position: "absolute", top: 20, right: 20, zIndex: 100 }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image
            resizeMode="contain"
            style={[styles.logoContainer]}
            source={LocalImages.closeImage}
          ></Image>
        </TouchableOpacity>
      </View>

      <RNCamera
        ref={camRef}
        style={styles.preview}
        androidCameraPermissionOptions={null}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
        onBarCodeRead={(data) => _handleBarCodeRead(data)}
      >
        <DocumentMask />
      </RNCamera>
      <Text
        style={{
          textAlign: "center",
          paddingVertical: 5,
          fontWeight: "bold",
          fontSize: 16,
          color: "#fff",
        }}
      >
        Capture
      </Text>
      <Text style={{ textAlign: "center", paddingVertical: 5, color: "#fff" }}>
        Place the document inside the box and Capture!
      </Text>
      <TouchableOpacity onPress={_takePicture}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: colors.primary,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderColor: "#fff",
              borderWidth: 1,
              borderRadius: 25,
              backgroundColor: "transparent",
            }}
          ></View>
        </View>
      </TouchableOpacity>
      <Text
        style={{
          textAlign: "center",
          paddingVertical: 5,
          fontWeight: "bold",
          fontSize: 18,
          color: "#fff",
        }}
      >
        OR
      </Text>
      <Button
        leftIcon={LocalImages.upload}
        style={{
          buttonContainer: {
            elevation: 5,
          },
          text: {
            color: Screens.pureWhite,
          },
          iconStyle: {
            tintColor: Screens.pureWhite,
          },
        }}
        title={"upload from gallery"}
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: Screens.black,
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logoContainer: {
    width: 15,
    height: 15,
    tintColor: "#fff",
  },
});

export default UploadScreen;
