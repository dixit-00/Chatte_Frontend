import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/authContext";
import Header from "@/components/Header";
import BackBotton from "@/components/BackBotton";
import Avatar from "@/components/Avatar";
import * as Icons from "phosphor-react-native";
import { scale, verticalScale } from "@/utils/styling";
import { FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker";

import MessageItem from "@/components/MessageItem";
import Input from "@/components/Input";
import { Image } from "expo-image";
import Loading from "@/components/Loading";
import { uploadFileToCloudinary } from "@/services/imageService";
import { getMessages, newMessage } from "@/socket/socketEvents";
import { MessageProps, ResponseProps } from "@/types";

const Conversation = () => {
  const { user: currentUser } = useAuth();

  const {
    id: conversationId,
    name,
    participants: stringifiedParticipants,
    avatar,
    type,
  } = useLocalSearchParams();

  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<{ uri: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    if (!conversationId) return;

    newMessage(newMessageHandler);
    getMessages(messagesHandler);

    // Fetch messages for this conversation
    getMessages({ conversationId });

    return () => {
      newMessage(newMessageHandler, true);
      getMessages(messagesHandler, true);
    };
  }, [conversationId]);

  const newMessageHandler = (res: ResponseProps) => {
    setLoading(false);
    console.log("got new  message", res);
    if (res.success && res.data) {
      // Format the message to match our MessageProps type
      const newMsg = {
        id: res.data.id || res.data._id,
        sender: res.data.sender || {
          id: res.data.senderId?._id || res.data.senderId,
          name: res.data.senderId?.name || "",
          avatar: res.data.senderId?.avatar || null,
        },
        content: res.data.content || "",
        attachement: res.data.attachement || res.data.attachment || null,
        createdAt: res.data.createdAt || new Date().toISOString(),
      };

      // Add the new message to the messages array if not already present
      // Since the list is inverted, we prepend to show latest at bottom
      setMessages((prevMessages) => {
        // Check if message already exists to avoid duplicates
        const messageExists = prevMessages.some((msg) => msg.id === newMsg.id);
        if (messageExists) return prevMessages;
        return [newMsg, ...prevMessages];
      });
    }
  };

  const messagesHandler = (res: ResponseProps) => {
    if (res.success && res.data) {
      // Backend returns messages sorted by createdAt descending (newest first)
      // Since FlatList is inverted, we need to reverse them
      const formattedMessages = Array.isArray(res.data) 
        ? res.data.map((msg: any) => ({
            id: msg.id || msg._id,
            sender: msg.sender || {
              id: msg.senderId?._id || msg.senderId,
              name: msg.senderId?.name || "",
              avatar: msg.senderId?.avatar || null,
            },
            content: msg.content || "",
            attachement: msg.attachement || msg.attachment || null,
            createdAt: msg.createdAt || new Date().toISOString(),
          }))
        : [];
      setMessages(formattedMessages);
    }
  };

  const onPickFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 0.7, // Slightly better quality but still compressed
      allowsEditing: false, // Don't allow editing to speed up selection
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      // Store the full asset object with uri property
      setSelectedFile(result.assets[0]);
    }
  };

  const onSend = async () => {
    if (!message.trim() && !selectedFile) return;
    if (!currentUser) return;

    setLoading(true);

    try {
      let attachment = null;
      if (selectedFile) {
        console.log("Uploading image...", selectedFile);
        const uploadResult = await uploadFileToCloudinary(
          selectedFile,
          "message-attachements"
        );

        if (uploadResult.success && uploadResult.data) {
          attachment = uploadResult.data;
          console.log("Image uploaded successfully:", attachment);
        } else {
          setLoading(false);
          Alert.alert("Error", uploadResult.msg || "Failed to upload image");
          return;
        }
      }

      console.log("Sending message with attachment:", attachment);
      newMessage({
        conversationId,
        sender: {
          id: currentUser?.id,
          name: currentUser?.name,
          avatar: currentUser?.avatar,
        },
        content: message.trim(),
        attachments: attachment, // Backend expects 'attachments' (plural) or 'attachement'
        attachement: attachment, // Also send 'attachement' for backward compatibility
      });

      setMessage("");
      setSelectedFile(null);
      // Note: loading will be set to false in newMessageHandler when response is received
    } catch (error) {
      console.log("Error sending message:", error);
      Alert.alert("Error", "Failed to send message");
      setLoading(false);
    }
  };
  const participants = JSON.parse(stringifiedParticipants as string);

  let conversationAvatar = avatar;
  let isDirect = type == "direct";
  // Check both _id and id to handle different data formats
  // Convert to strings for reliable comparison
  const otherParticipants = isDirect
    ? participants.find((p: any) => {
        const participantId = String(p._id || p.id);
        const currentUserId = String(currentUser?.id || "");
        return participantId !== currentUserId;
      })
    : null;

  if (isDirect && otherParticipants) {
    conversationAvatar = otherParticipants.avatar;
  }

  // For direct conversations, show the other participant's name
  // For groups, show the conversation name
  let conversationName = isDirect 
    ? (otherParticipants?.name || "Unknown User") 
    : (name || "Group Chat");
  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.5}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Header
          style={styles.header}
          leftIcon={
            <View style={styles.leftHeader}>
              <BackBotton />
              <Avatar
                size={40}
                uri={conversationAvatar as string}
                isGroup={type == "group"}
              />
              <Typo color={colors.white} fontWeight={500} size={22}>
                {conversationName}
              </Typo>
            </View>
          }
          rightIcon={
            <TouchableOpacity>
              <Icons.DotsThreeOutlineVerticalIcon
                weight="fill"
                color={colors.white}
              />
            </TouchableOpacity>
          }
        />
        <View style={styles.content}>
          <FlatList
            data={messages}
            inverted={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.msgContent}
            renderItem={({ item }) => (
              <MessageItem item={item} isDirect={isDirect} />
            )}
            keyExtractor={(item) => item.id}
          />
          <View style={styles.footer}>
            <Input
              value={message}
              onChangeText={setMessage}
              containerStyle={{
                flex: 1, // 👈 IMPORTANT
                paddingLeft: spacingX._10,
                paddingRight: scale(65),
                borderWidth: 0,
              }}
              placeholder="Type Message"
              icon={
                <TouchableOpacity style={styles.inputIcon} onPress={onPickFile}>
                  <Icons.Plus
                    color={colors.black}
                    weight="bold"
                    size={verticalScale(22)}
                  />
                  {selectedFile && selectedFile.uri && (
                    <Image
                      source={selectedFile.uri}
                      style={styles.selectedFile}
                    />
                  )}
                </TouchableOpacity>
              }
            />

            <View style={styles.inputRightIcon}>
              <TouchableOpacity style={styles.inputIcon} onPress={onSend}>
                {loading ? (
                  <Loading size="small" color={colors.black} />
                ) : (
                  <Icons.PaperPlaneTilt
                    color={colors.black}
                    weight="fill"
                    size={verticalScale(22)}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacingX._15,
    paddingTop: spacingY._10,
    paddingBottom: spacingX._15,
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
  },
  inputRightIcon: {
    marginLeft: spacingX._10,
  },

  selectedFile: {
    position: "absolute",
    height: verticalScale(38),
    width: verticalScale(38),
    borderRadius: radius.full,
    alignSelf: "center",
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    overflow: "hidden",
    paddingHorizontal: spacingX._15,
  },
  inputIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 8,
  },
  msgContent: {
    paddingTop: spacingY._20,
    paddingBottom: spacingY._10,
    gap: spacingY._12,
  },
  messageContainer: {
    flex: 1,
  },

  plusIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacingY._7,
    paddingBottom: verticalScale(22),
  },
});
