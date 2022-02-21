import * as React from 'react';
import { Button, Image, StyleSheet, Text, View,PermissionsAndroid } from 'react-native';
import DocumentPicker,{types} from 'react-native-document-picker';
import PdfThumbnail, { ThumbnailResult } from 'react-native-pdf-thumbnail';


import { Dirs, FileSystem } from 'react-native-file-access';


const requestReadPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: "Cool Photo App Camera Permission",
        message:
          "Cool Photo App needs access to your camera " +
          "so you can take awesome pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can read");
    } else {
      console.log("read permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};

const requestWritePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Cool Photo App Camera Permission",
        message:
          "Cool Photo App needs access to your camera " +
          "so you can take awesome pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can write");
    } else {
      console.log("write permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};

export default function App() {
  const [thumbnail, setThumbnail] = React.useState();
  const [error, setError] = React.useState();

 
  const onPress = async () => {
    try {
      //1
      // const { uri } = await DocumentPicker.pick({
      //   type: [DocumentPicker.types.pdf],
      // });

      //2
      // let uri;
      // DocumentPicker.pick({
      //   type: types.pdf,
      // })
      //   .then((data)=>{uri=data[0].uri;console.log(data);console.log(getPath(uri));})
      //   .catch((e)=>{console.log(e);})

      const temp1= await requestReadPermission();
      const temp2= await requestWritePermission();
      const result = await PdfThumbnail.generate("file:///storage/emulated/0/Download/jay.pdf", 0);
      console.log(result.uri);
      await FileSystem.cp(result.uri,"file:///storage/emulated/0/Download/hello.jpg");
      setThumbnail(result);
      setError(undefined);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        setThumbnail(undefined);
        setError(err);
      }
    }
  };

  const thumbnailResult = thumbnail ? (
    <>
      <Image
        source={thumbnail}
        resizeMode="contain"
        style={styles.thumbnailImage}
      />
      <Text style={styles.thumbnailInfo}>uri: {thumbnail.uri}</Text>
      <Text style={styles.thumbnailInfo}>width: {thumbnail.width}</Text>
      <Text style={styles.thumbnailInfo}>height: {thumbnail.height}</Text>
    </>
  ) : null;

  const thumbnailError = error ? (
    <>
      <Text style={styles.thumbnailError}>Error code: {error.code}</Text>
      <Text style={styles.thumbnailError}>Error message: {error.message}</Text>
    </>
  ) : null;

  return (
    <View style={styles.container}>
      <View style={styles.thumbnailPreview}>
        {thumbnailResult}
        {thumbnailError}
      </View>
      <Button onPress={onPress} title="Pick PDF File" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  thumbnailPreview: {
    padding: 20,
    alignItems: 'center',
  },
  thumbnailImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  thumbnailInfo: {
    color: 'darkblue',
  },
  thumbnailError: {
    color: 'crimson',
  },
});
