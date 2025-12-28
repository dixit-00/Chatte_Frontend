import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { spacingX, spacingY } from "@/constants/theme";
import Avatar from "./Avatar";
import Typo from "../components/typo";
import moment from "moment";
import { colors } from "@/constants/theme";
import { ConversationListItemProps } from "@/types";
import { useAuth } from "../context/authContext";

const ConversationsItems = ({
  item,
  showDivider,
  router,
}: ConversationListItemProps) => {
  const { user: currentUserId } = useAuth();
  const lastMessage: any = item?.lastMessage;
  const isDirect = item.type == "direct";

  let avatar = item.avatar;

  const otherParticipant = isDirect
    ? item.participants.find((p) => p._id != currentUserId?.id)
    : null;

  // For direct messages, use the other participant's avatar
  // For groups, use the conversation's avatar
  if (isDirect && otherParticipant) {
    avatar = otherParticipant.avatar;
  }
  const getLastMessageDate = () => {
    if (!lastMessage?.createdAt) return null;
    const messageDate = moment(lastMessage.createdAt);

    const today = moment();

    if (messageDate.isSame(today, "day")) {
      return messageDate.format("h:mm A");
    }
    if (messageDate.isSame(today, "year")) {
      return messageDate.format("MMM D");
    }

    return messageDate.format("MMM D, YYYY");
  };
  const getLastMessageContent = () => {
    if (!lastMessage) return "say hii 👍";
    return lastMessage?.attachement ? "Image" : lastMessage.content || "say hii 👍";
  };
  const openconversation = () => {
    router.push({
      pathname: "/(main)/conversation",
      params: {
        id: item._id,
        name: item.name,
        avatar: item.avatar,
        type: item.type,
        participants: JSON.stringify(item.participants),
      },
    });
  };
  return (
    <View>
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={openconversation}
      >
        <View>
          <Avatar uri={avatar} size={47} isGroup={item.type == "group"} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Typo size={17} fontWeight="600">
              {isDirect ? otherParticipant?.name : item.name}
            </Typo>
            {item.lastMessage && <Typo size={15}>{getLastMessageDate()}</Typo>}
          </View>
          <Typo
            size={15}
            color={colors.neutral600}
            textProps={{ numberOfLines: 1 }}
          >
            {getLastMessageContent()}
          </Typo>
        </View>
      </TouchableOpacity>
      {showDivider && <View style={styles.divider} />}
    </View>
  );
};

export default ConversationsItems;

const styles = StyleSheet.create({
  conversationItem: {
    gap: spacingX._10,
    marginVertical: spacingY._12,
    flexDirection: "row",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  divider: {
    height: 1,
    width: "95%",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.07)",
  },
});
