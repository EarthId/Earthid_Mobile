import { StackActions } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  View,
} from "react-native";
import TouchID from "react-native-touch-id";
import { useAppSelector } from "../../hooks/hooks";
import SplashScreen from "react-native-splash-screen";

interface ILoadingScreen {
  navigation: any;
}
const optionalConfigObject = {
  title: "Authentication Required", // Android
  imageColor: "#2AA2DE", // Android
  imageErrorColor: "#ff0000", // Android
  sensorDescription: "Touch sensor", // Android
  sensorErrorDescription: "Failed", // Android
  cancelText: "Cancel", // Android
  fallbackLabel: "Show Passcode", // iOS (if empty, then label is hidden)
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
};
const LoadingScreen = ({ navigation }: ILoadingScreen) => {
  const userDetails = useAppSelector((state) => state.account);
  const aunthenticateBioMetricInfo = () => {
    TouchID.isSupported(optionalConfigObject)
      .then(async (biometryType) => {
        // Success code
        if (biometryType === "FaceID") {
          console.log("FaceID is supported.");
        } else {
          TouchID.authenticate("", optionalConfigObject)
            .then(async (success: any) => {
              console.log("success", success);
              const getItem = await AsyncStorage.getItem("passcode");
              if (getItem) {
                navigation.dispatch(StackActions.replace("PasswordCheck"));
              } else {
                navigation.dispatch(StackActions.replace("DrawerNavigator"));
              }
            })
            .catch((e: any) => {
              aunthenticateBioMetricInfo();
            });
          console.log("TouchID is supported.");
        }
      })
      .catch((error) => {
        // Failure code
        console.log(error);
      });
  };
  const checkAuth = async () => {
    const fingerPrint = await AsyncStorage.getItem("fingerprint");
    console.log("fingerPrint", fingerPrint);
    const getItem = await AsyncStorage.getItem("passcode");

    console.log("getItem", getItem);
    if (fingerPrint) {
      aunthenticateBioMetricInfo();
    } else if (getItem) {
      navigation.dispatch(StackActions.replace("PasswordCheck"));
    } else {
      navigation.dispatch(StackActions.replace("AuthStack"));
    }
  };
  console.log("userDetails", userDetails);
  useEffect(() => {
    if (userDetails?.responseData) {
      checkAuth();
    } else {
      navigation.dispatch(StackActions.replace("AuthStack"));
    }
  }, [userDetails]);
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default LoadingScreen;
