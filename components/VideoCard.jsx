import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
  Button,
} from "react-native";
import { reportVideo, downloadVideo } from "../lib/appwrite"; // Asegúrate de ajustar la ruta
import { icons } from "../constants";

const VideoCard = ({ title, creator, avatar, thumbnail, video, videoId }) => {
  const [play, setPlay] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState("");

  // Función para manejar la descarga
  const handleDownload = async () => {
    try {
      await downloadVideo(video); // Descarga el video usando la URL
      Alert.alert("Success", "Video downloaded successfully");
      setOptionsModalVisible(false); // Cierra el modal de opciones
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleReport = async () => {
    try {
      await reportVideo(videoId, reportReason);
      Alert.alert("Success", "Video reported successfully");
      setReportReason("");
      setReportModalVisible(false); // Cierra el modal de reporte
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>

        <View className="pt-2 flex flex-row">
          {/* Botón de Menú */}
          <TouchableOpacity
            onPress={() => setOptionsModalVisible(true)}
            className="mr-4"
          >
            <Image
              source={icons.menu}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}

      {/* Modal de opciones */}
      <Modal
        visible={optionsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-gray-800 bg-opacity-70">
          <View className="bg-white p-6 rounded-lg w-80">
            <Button title="Download Video" onPress={handleDownload} />
            <Button
              title="Report Video"
              onPress={() => {
                setOptionsModalVisible(false);
                setReportModalVisible(true);
              }}
              color="blue"
            />
            <Button
              title="Cancel"
              onPress={() => setOptionsModalVisible(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>

      {/* Modal para reportar video */}
      <Modal
        visible={reportModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-gray-800 bg-opacity-70">
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-lg font-semibold mb-4">Report Video</Text>
            <TextInput
              placeholder="Enter report reason"
              value={reportReason}
              onChangeText={setReportReason}
              className="border border-gray-300 p-2 rounded mb-4"
              multiline
            />
            <Button title="Submit Report" onPress={handleReport} />
            <Button
              title="Cancel"
              onPress={() => setReportModalVisible(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VideoCard;
