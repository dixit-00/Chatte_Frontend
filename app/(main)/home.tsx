import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import Typo from "../../components/typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import Button from "@/components/Botton";
import { testSocket } from "@/socket/socketEvents";
import * as Icons from "phosphor-react-native";
import { useRouter } from "expo-router";
import { verticalScale } from "@/utils/styling";
import { useState } from "react";
import ConversationsItems from "@/components/ConversationsItems";
import Loading from "@/components/Loading";
import Botton from "@/components/Botton";

const Home = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    testSocket(testSocketCallbackHandler);
    testSocket(null);

    return () => {
      testSocket(testSocketCallbackHandler, true);
    };
  }, []);

  const testSocketCallbackHandler = (data: any) => {
    console.log("got reponse  ", data);
  };
  console.log(user);
  const handleLogout = async () => {
    await signOut();
  };

  const conversations = [
    {
      name: "Alice",
      type: "direct",
      lastMessage: {
        senderName: "Alice",
        content: "Hey! Are we still on for tonight?",
        createdAt: "2025-06-22T18:45:00Z",
      },
    },
    {
      name: "Bob",
      type: "direct",
      lastMessage: {
        senderName: "You",
        content: "I'll send the files by evening.",
        createdAt: "2025-06-22T17:30:10Z",
      },
    },
    {
      name: "Charlie",
      type: "direct",
      lastMessage: {
        senderName: "Charlie",
        content: "Did you check the new update?",
        createdAt: "2025-06-22T16:12:45Z",
      },
    },
    {
      name: "Design Team",
      type: "group",
      lastMessage: {
        senderName: "Emma",
        content: "Logo draft is ready for review.",
        createdAt: "2025-06-22T15:40:20Z",
      },
    },
    {
      name: "David",
      type: "direct",
      lastMessage: {
        senderName: "David",
        content: "Let's catch up this weekend.",
        createdAt: "2025-06-22T14:05:55Z",
      },
    },
    {
      name: "Family Group",
      type: "group",
      lastMessage: {
        senderName: "Mom",
        content: "Dinner is at 8 PM today.",
        createdAt: "2025-06-22T13:20:00Z",
      },
    },
    {
      name: "Eva",
      type: "direct",
      lastMessage: {
        senderName: "You",
        content: "Thanks for the help today!",
        createdAt: "2025-06-22T12:10:30Z",
      },
    },
    {
      name: "Project Alpha",
      type: "group",
      lastMessage: {
        senderName: "Manager",
        content: "Deadline is moved to Friday.",
        createdAt: "2025-06-22T11:45:00Z",
      },
    },
    {
      name: "Frank",
      type: "direct",
      lastMessage: {
        senderName: "Frank",
        content: "Call me when you're free.",
        createdAt: "2025-06-22T10:25:40Z",
      },
    },
    {
      name: "Gym Buddies",
      type: "group",
      lastMessage: {
        senderName: "Alex",
        content: "Workout at 6 AM tomorrow 💪",
        createdAt: "2025-06-22T09:00:00Z",
      },
    },
  ];

  let directConversations = conversations
    .filter((item: any) => item.type == "direct")
    .sort((a: any, b: any) => {
      const aDate = a?.lastMessage?.createdAt || a.createdAt;
      const bDate = b?.lastMessage?.createdAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
  let groupConversations = conversations
    .filter((item: any) => item.type == "group")
    .sort((a: any, b: any) => {
      const aDate = a?.lastMessage?.createdAt || a.createdAt;
      const bDate = b?.lastMessage?.createdAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.5}>
      <View style={styles.container}>
        <View style={styles.Header}>
          <View style={{ flex: 1 }}>
            <Typo
              color={colors.neutral200}
              size={19}
              textProps={{ numberOfLines: 1 }}
            >
              Welcome back,
              <Typo size={20} color={colors.white} fontWeight={800}>
                {" "}
                {user?.name}
              </Typo>{" "}
              👍
            </Typo>
          </View>
          <TouchableOpacity
            style={styles.settingIcon}
            onPress={() => router.push("/(main)/Profilemodel")}
          >
            <Icons.GearSix
              color={colors.white}
              weight="fill"
              size={verticalScale(22)}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacingY._20 }}
          >
            <View style={styles.navbar}>
              <View style={styles.tabs}>
                <TouchableOpacity
                  onPress={() => setSelectedTab(0)}
                  style={[
                    styles.tabstyle,
                    selectedTab == 0 && styles.activeTabs,
                  ]}
                >
                  <Typo>Direct Messages</Typo>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedTab(1)}
                  style={[
                    styles.tabstyle,
                    selectedTab == 1 && styles.activeTabs,
                  ]}
                >
                  <Typo>Groups</Typo>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.conversationList}>
              {selectedTab == 0 &&
                directConversations.map((item: any, index) => {
                  return (
                    <ConversationsItems
                      item={item}
                      key={index}
                      router={router}
                      showDivider={directConversations.length != index + 1}
                    />
                  );
                })}
              {selectedTab == 1 &&
                groupConversations.map((item: any, index) => {
                  return (
                    <ConversationsItems
                      item={item}
                      key={index}
                      router={router}
                      showDivider={groupConversations.length != index + 1}
                    />
                  );
                })}
            </View>
            {!loading &&
              selectedTab == 0 &&
              directConversations.length == 0 && (
                <Typo style={{ textAlign: "center" }}>
                  {" "}
                  You don't have any messages{" "}
                </Typo>
              )}

            {!loading && selectedTab == 1 && groupConversations.length == 0 && (
              <Typo style={{ textAlign: "center" }}>
                {" "}
                You haven't joined any grouped yet{" "}
              </Typo>
            )}
            {loading && <Loading />}
          </ScrollView>
        </View>
      </View>
      <Botton
        style={styles.floatbutton}
        onPress={() =>
          router.push({
            pathname: "/(main)/NewConversation",
            params: { isGroup: selectedTab },
          })
        }
      >
        <Icons.Plus
          size={verticalScale(24)}
          color={colors.black}
          weight="bold"
        />
      </Botton>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  Header: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._15,
    paddingBottom: spacingY._25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",

    paddingHorizontal: spacingX._10,
    paddingTop: spacingY._20,
  },
  settingIcon: {
    padding: spacingY._10,
    backgroundColor: colors.neutral700,
    borderRadius: radius.full,
  },
  form: {
    gap: spacingY._15,
    marginTop: spacingY._20,
  },
  footer: {
    marginBottom: spacingY._30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._15,
    paddingHorizontal: spacingX._10,
  },
  tabs: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    justifyContent: "center",
    flex: 1,
  },
  tabstyle: {
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._20,
    backgroundColor: colors.neutral100,
  },
  activeTabs: {
    backgroundColor: colors.primaryLight,
  },
  conversationList: {
    paddingVertical: spacingY._20,
  },
  floatbutton: {
    position: "absolute",
    height: verticalScale(50),
    width: verticalScale(50),

    bottom: verticalScale(30),

    right: verticalScale(30),

    borderRadius: 100,
  },
});
