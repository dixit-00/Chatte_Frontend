import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Header from "@/components/Header";
import BackBotton from "@/components/BackBotton";
import Avatar from "@/components/Avatar";
import * as ImagePicker from "expo-image-picker";
import Input from "@/components/Input";
import Typo from "../../components/typo";
import { useAuth } from "@/context/authContext";
import { Alert } from "react-native";
import { Button } from "@react-navigation/elements";
import Loading from "@/components/Loading";
import Botton from "@/components/Botton";

const NewConversation = () => {
  const { isGroup } = useLocalSearchParams();
  const isGroupMode = isGroup == "1";
  const router = useRouter();
  const [groupAvatar, setGroupAvatar] = useState<{ uri: string } | null>(null);
  const [groupName, setGroupName] = useState("");
  const [selectParticipants, setSelectParticipants] = useState<string[]>([]);
  const { user: currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const toggleParticipant = (user: any) => {
    setSelectParticipants((prev: any) => {
      if (prev.includes(user.id)) {
        return prev.filter((id: string) => id !== user.id);
      } else {
        return [...prev, user.id];
      }
    });
  };
  const onSelectUser = (user: any) => {
    if (!currentUser) {
      Alert.alert("Authentication", "Please login to start the conversation");
      return;
    }
    if (isGroupMode) {
      toggleParticipant(user);
    }
  };

  const createGroup = async () => {
    if (!groupName.trim() || !currentUser || selectParticipants.length >= 2);
    return;
  };
  const contacts = [
    {
      id: "1",
      name: "Olivia Moore",
      avatar: "https://i.pravatar.cc/150?img=14",
    },
    {
      id: "2",
      name: "James Anderson",
      avatar: "https://i.pravatar.cc/150?img=15",
    },
    {
      id: "3",
      name: "Ava Thomas",
      avatar: "https://i.pravatar.cc/150?img=16",
    },
  ];
  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 0.5,
    });
    console.log("Image picker result", result);

    if (!result.canceled && result.assets && result.assets[0]) {
      // Store the full asset object with uri property
      setGroupAvatar(result.assets[0]);
    }
  };
  return (
    <ScreenWrapper isModal={true}>
      <View style={styles.container}>
        <Header
          title={isGroupMode ? "New Group" : "Select User"}
          leftIcon={<BackBotton color={colors.black} />}
        />
        {isGroupMode && (
          <View style={styles.groupInfocontainer}>
            <View style={styles.avatarcontainer}>
              <TouchableOpacity onPress={onPickImage}>
                <Avatar
                  uri={groupAvatar?.uri || null}
                  size={100}
                  isGroup={true}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.groupNameContainer}>
              <Input
                placeholder="Group Name"
                value={groupName}
                onChangeText={setGroupName}
              />
            </View>
          </View>
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.containerList}
        >
          {contacts.map((user: any, index) => {
            const isSelected = selectParticipants.includes(user.id);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.contactRow,
                  isSelected && styles.selectedContact,
                ]}
                onPress={() => onSelectUser(user)}
              >
                <Avatar size={45} uri={user.avatar} />
                <Typo fontWeight={"500"}>{user.name}</Typo>
                {isGroupMode && (
                  <View style={styles.selectionIdicatior}>
                    <View
                      style={[styles.checkBox, isSelected && styles.checked]}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {isGroupMode && selectParticipants.length >= 2 && (
          <View style={styles.createGroupButton}>
            <Botton
              onPress={createGroup}
              disabled={!groupName.trim()}
              loading={isLoading}
            >
              <Typo fontWeight={"bold"} size={17}>
                {" "}
                Create Group
              </Typo>
            </Botton>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default NewConversation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: spacingX._15,
  },
  groupInfocontainer: {
    marginTop: spacingY._10,
    alignItems: "center",
  },
  avatarcontainer: {
    marginBottom: spacingY._10,
  },
  groupNameContainer: {
    width: "100%",
  },
  containerList: {
    gap: spacingY._12,
    marginTop: spacingY._10,
    paddingTop: spacingY._10,
    paddingBottom: spacingY._20,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    paddingVertical: spacingY._5,
  },
  selectionIdicatior: {
    marginLeft: "auto",
    marginRight: spacingY._10,
  },
  checked: {
    backgroundColor: colors.primary,
  },
  checkBox: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  selectedContact: {
    backgroundColor: colors.neutral100,
    borderRadius: radius._15,
  },
  createGroupButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacingX._15,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
  },
});
