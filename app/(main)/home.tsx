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
import {
  getConversations,
  newConversation,
  testSocket,
} from "@/socket/socketEvents";
import * as Icons from "phosphor-react-native";
import { useRouter } from "expo-router";
import { verticalScale } from "@/utils/styling";
import { useState } from "react";
import ConversationsItems from "@/components/ConversationsItems";
import Loading from "@/components/Loading";
import Botton from "@/components/Botton";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { ConversationProps, ResponseProps } from "@/types";

const Home = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationProps[]>([]);

  useEffect(() => {
    testSocket(testSocketCallbackHandler);
    testSocket(null);

    return () => {
      testSocket(testSocketCallbackHandler, true);
    };
  }, []);

  useEffect(() => {
    getConversations(processConversations);
    newConversation(newConversationCallbackHandler);
    getConversations(null);

    return () => {
      getConversations(processConversations, true);
      newConversation(newConversationCallbackHandler, true);
    };
  }, []);

  const newConversationCallbackHandler = (res: ResponseProps) => {
    if (res.success) {
      setConversations((prev) => [res.data, ...prev]);
    }
  };

  const processConversations = (res: ResponseProps) => {
    if (res.success) {
      setConversations(res.data);
    }
  };

  const testSocketCallbackHandler = (data: any) => {
    console.log("got reponse  ", data);
  };
  console.log(user);
  const handleLogout = async () => {
    await signOut();
  };

  let directConversations = conversations
    .filter((item: ConversationProps) => item.type == "direct")
    .sort((a: ConversationProps, b: ConversationProps) => {
      const aDate = a?.lastMessage?.createdAt || a?.createdAt || new Date(0).toISOString();
      const bDate = b?.lastMessage?.createdAt || b?.createdAt || new Date(0).toISOString();
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
  let groupConversations = conversations
    .filter((item: ConversationProps) => item.type == "group")
    .sort((a: ConversationProps, b: ConversationProps) => {
      const aDate = a?.lastMessage?.createdAt || a?.createdAt || new Date(0).toISOString();
      const bDate = b?.lastMessage?.createdAt || b?.createdAt || new Date(0).toISOString();
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
                directConversations.map((item: ConversationProps, index) => {
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
                groupConversations.map((item: ConversationProps, index) => {
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
