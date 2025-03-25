import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import SearchBar from "@/components/Search";
import GroupCard from "@/components/Group";
import { useRouter } from "expo-router";
import ButtonSwitch from "@/components/ButtonSwitch";
import { useGroups } from "../groupprovider";
import { post, get } from "@/components/Api";
import { Image } from "expo-image";

const deviceWidthDp = Dimensions.get("screen").width;
const deviceHeightDp = Dimensions.get("screen").height;

export default function Circle() {
  const {
    groups,
    setGroups,
    filteredGroups,
    setFilteredGroups,
    user,
    flag,
    setFlag,
    isLogin,
    setIsLogin,
  } = useGroups();

  // 新增状态: 当前pn和加载状态
  const [pageNum, setPageNum] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreGroups, isMoreGroups] = useState<boolean>(true);

  // 原先的加载小组方法，增加参数page，用于请求不同页码
  const getGroupfirst = async (page: number) => {
    try {
      const response1 = await get(
        `http://8.129.3.142:8080/group/ten/?pn=${page}`,
        true
      );
      const result1 = await response1.json();
      const formattedGroups = result1.data.map((item: any) => ({
        groupId: item.id,
        groupName: item.name,
        groupDesc: item.description,
        groupAvatar: item.avatar,
        isJoined: false,
        messages: item.messages || [],
        members: item.members || [],
      }));
      if (result1.code === 400) {
        isMoreGroups(false);
      }
      const updatedGroups = await Promise.all(
        formattedGroups.map(async (group: any) => {
          try {
            const response2 = await post(
              "http://8.129.3.142:8080/group/check",
              { group_id: group.groupId, user_id: user },
              true
            );
            const result2 = await response2.json();
            const id = group.groupId;
            const response3 = await get(
              `http://8.129.3.142:8080/image/group/${id}`,
              true
            );
            const result3 = await response3.json();
            console.log(result3.data);

            return {
              ...group,
              isJoined: result2.code === 200,
              groupAvatar: result3.data,
            };
          } catch (e) {
            console.log(e);
            return group;
          }
        })
      );
      return updatedGroups;
    } catch (e) {
      return [];
    }
  };

  useEffect(() => {
    if (isLogin === false) {
      router.push("../(tabsin)/login");
    }
    if (isLogin === true) {
      const loadInitialGroups = async () => {
        const initialGroups = await getGroupfirst(0);
        if (!initialGroups) return;
        setGroups(initialGroups);
        setFilteredGroups(initialGroups);
      };
      loadInitialGroups();
    }
  }, []);

  // 下拉加载更多
  const loadMoreGroups = async () => {
    if (moreGroups === true) {
      if (loadingMore) return;
      setLoadingMore(true);
      const nextPage = pageNum + 10;
      const newGroups = await getGroupfirst(nextPage);
      if (newGroups.length > 0) {
        // 追加到已有小组数据中
        setGroups((prev) => [...prev, ...newGroups]);
        setFilteredGroups((prev) => [...prev, ...newGroups]);
        setPageNum(nextPage);
      }
      setLoadingMore(false);
    }
  };

  // 检测 ScrollView 是否滑动到底部，触发加载
  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 50) {
      // 滑到底部，触发加载更多
      loadMoreGroups();
    }
  };

  const [state, setState] = useState<string>("find");
  const [activeButton, setActiveButton] = useState<string | null>("button1");
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const router = useRouter();

  const handleSearch = (query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const result = groups.filter((group) =>
      group.groupName.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredGroups(result);
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      const toJoinGroup = {
        group_num: groupId,
        user_id: user,
      };
      await post("http://8.129.3.142:8080/group/member/add", toJoinGroup, true);
      setFilteredGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.groupId === groupId ? { ...group, isJoined: true } : group
        )
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handlePress1 = (buttonId: string) => {
    setActiveButton(buttonId);
    setState("find");
    setFilteredGroups(groups);
  };

  const handlePress2 = async (buttonId: string) => {
    try {
      const id = user;
      const response3 = await get(
        `http://8.129.3.142:8080/group/list/${id}`,
        true
      );
      const result3 = await response3.json();
      const formattedGroups = result3.data.groups.map((item: any) => ({
        groupId: item.id,
        groupName: item.name,
        groupDesc: item.description,
        groupAvatar: item.avatar,
        isJoined: true,
        messages: item.messages || [],
        members: item.members || [],
      }));
      const updatedGroups = await Promise.all(
        formattedGroups.map(async (group: any) => {
          try {
            const id = group.groupId;
            const response3 = await get(
              `http://8.129.3.142:8080/image/group/${id}`,
              true
            );
            const result3 = await response3.json();
            console.log(result3.data);

            return { ...group, groupAvatar: result3.data };
          } catch (e) {
            console.log(e);
            return group;
          }
        })
      );

      setActiveButton(buttonId);
      setState("mine");
      setFilteredGroups(updatedGroups);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCreateNewGroup = async () => {
    try {
      const toNewGroup = {
        description: newGroupDesc,
        name: newGroupName,
        execute_id: user,
        is_public: true,
        password: "1",
      };
      const response = await post(
        "http://8.129.3.142:8080/group/create",
        toNewGroup,
        true
      );
      const result = await response.json();
      const newGroup = {
        groupId: result.data.id,
        groupName: newGroupName,
        groupDesc: newGroupDesc,
        groupAvatar: "https://example.com/avatar.png",
        isJoined: true,
        messages: [],
        members: [
          {
            userId: "user1",
            userName: "当前用户",
            avatar: "https://example.com/user1-avatar.png",
          },
        ],
      };
      console.log(newGroup);
      setGroups((prevGroups) => [...prevGroups, newGroup]);
      setFilteredGroups((prevGroups) => [...prevGroups, newGroup]);
      setShowModal(false);
      setNewGroupName("");
      setNewGroupDesc("");
    } catch (e) {
      console.log(e);
    }
  };

  const handlerouter = (groupId: string) => {
    console.log(groupId);
    router.push({
      pathname: "/groupcom/[groupId]",
      params: {
        groupId: groupId,
        userId: user,
      },
    });
  };

  if (state === "find") {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <LinearGradient
          colors={["#D8F9C0", "#F2FFCF", "#FFFFFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 0.27, 0.79]}
          style={styles.container}
        >
          <View style={styles.headregion}>
            <Text style={styles.headertext}>同心圆</Text>
          </View>
          <View style={styles.forest}>
            <View style={styles.choice}>
              <Pressable
                onPress={() => handlePress1("button1")}
                style={styles.month}
              >
                <View style={styles.monthactive}>
                  <Image
                    style={{
                      width: deviceWidthDp * 0.18,
                      height: deviceHeightDp * 0.025,
                    }}
                    source={require("../../assets/images/寻找小组.png")}
                  />
                </View>
              </Pressable>
              <Pressable
                onPress={() => handlePress2("button2")}
                style={styles.year}
              >
                <Text style={styles.choicetext}>我的小组</Text>
              </Pressable>
            </View>
            <LinearGradient
              colors={["#EFFDDC", "#FAFFE9", "#FBFDDA", "#EFFEDC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              locations={[0.16, 0.36, 0.64, 0.75]}
              style={styles.functionregion}
            >
              <View style={styles.findregion}>
                <SearchBar onSearch={handleSearch} />
              </View>
              <ScrollView
                style={styles.contextregion}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                {filteredGroups.map((group) => (
                  <GroupCard
                    key={group.groupId}
                    groupName={group.groupName}
                    groupDesc={group.groupDesc}
                    groupAvatar={group.groupAvatar}
                    groupId={group.groupId}
                    isJoined={group.isJoined}
                    onJoinGroup={handleJoinGroup}
                    disabledButton={true}
                  />
                ))}
              </ScrollView>
            </LinearGradient>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }

  if (state === "mine") {
    const joinedGroups = filteredGroups.filter((group) => group.isJoined);
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <LinearGradient
          colors={["#D8F9C0", "#F2FFCF", "#FFFFFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 0.27, 0.79]}
          style={styles.container}
        >
          <View style={styles.headregion}>
            <Text style={styles.headertext}>同心圆</Text>
          </View>
          <View style={styles.forest}>
            <View style={styles.choice}>
              <Pressable
                onPress={() => handlePress1("button1")}
                style={styles.month}
              >
                <Text style={styles.choicetext}>寻找小组</Text>
              </Pressable>
              <Pressable
                onPress={() => handlePress2("button2")}
                style={styles.year}
              >
                <View style={styles.yearactive}>
                  <Image
                    style={{
                      width: deviceWidthDp * 0.18,
                      height: deviceHeightDp * 0.025,
                    }}
                    source={require("../../assets/images/我的小组.png")}
                  />
                </View>
              </Pressable>
            </View>
            <LinearGradient
              colors={["#EFFDDC", "#FAFFE9", "#FBFDDA", "#EFFEDC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              locations={[0.16, 0.36, 0.64, 0.75]}
              style={styles.functionregion}
            >
              <ScrollView style={styles.contextregion}>
                {joinedGroups.map((group) => (
                  <GroupCard
                    key={group.groupId}
                    groupName={group.groupName}
                    groupDesc={group.groupDesc}
                    groupAvatar={group.groupAvatar}
                    groupId={group.groupId}
                    isJoined={group.isJoined}
                    onJoinGroup={handleJoinGroup}
                    customButtonAction={() => handlerouter(group.groupId)}
                    disabledButton={false}
                    customButtonStyle={{
                      position: "absolute",
                      left: deviceWidthDp * 0.75,
                      top: deviceHeightDp * 0.025,
                      width: deviceWidthDp * 0.15,
                      backgroundColor: "#EFFFD0",
                      borderRadius: 20,
                      alignItems: "center",
                    }}
                    customButtonText={"mine"}
                  />
                ))}
              </ScrollView>
            </LinearGradient>
          </View>

          {/* Add Button only in "mine" state */}
          <Pressable
            style={styles.addButton}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>

          {/* Modal to create new group */}
          {showModal && (
            <KeyboardAvoidingView
              keyboardVerticalOffset={deviceHeightDp * 1}
              behavior="padding"
              style={{ flex: 1, maxHeight: deviceHeightDp * 0.8 }}
            >
              <Modal
                transparent={true}
                animationType="fade"
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
              >
                <View style={styles.modalContainer}>
                  <LinearGradient
                    colors={["#D8F9C0", "#F2FFCF", "#FFFFFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    locations={[0, 0.27, 0.79]}
                    style={styles.modalContent}
                  >
                    <Text style={styles.modalTitle}>新建小组</Text>
                    <TextInput
                      style={styles.input1}
                      placeholder="小组名称"
                      value={newGroupName}
                      onChangeText={setNewGroupName}
                    />
                    <TextInput
                      style={styles.input2}
                      placeholder="小组简介(少于三十字）"
                      value={newGroupDesc}
                      onChangeText={setNewGroupDesc}
                      multiline={true}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: deviceHeightDp * 0.04,
                      }}
                    >
                      <Text style={{ flex: 1 / 2 }}>是否公开</Text>
                      <View style={{ flex: 3 / 16 }} />
                      <ButtonSwitch style={{ flex: 1 / 4 }} />
                    </View>
                    <Pressable
                      style={styles.login}
                      onPress={handleCreateNewGroup}
                    >
                      <LinearGradient
                        colors={["#CDF3AA", "#E6FEA2"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.loginstyle}
                      >
                        <Text
                          style={{
                            fontSize: 17,
                            fontWeight: "700",
                            letterSpacing: 3,
                          }}
                        >
                          确认提交
                        </Text>
                      </LinearGradient>
                    </Pressable>
                    <Pressable
                      style={styles.login}
                      onPress={() => setShowModal(false)}
                    >
                      <LinearGradient
                        colors={["#CDF3AA", "#E6FEA2"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.loginstyle}
                      >
                        <Text
                          style={{
                            fontSize: 17,
                            fontWeight: "700",
                            letterSpacing: 3,
                          }}
                        >
                          取消
                        </Text>
                      </LinearGradient>
                    </Pressable>
                  </LinearGradient>
                </View>
              </Modal>
            </KeyboardAvoidingView>
          )}
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  functionregion: {
    flex: 14 / 15,
    alignItems: "center",
    justifyContent: "center",
  },
  month: {
    flex: 1 / 2,
  },
  year: {
    flex: 1 / 2,
  },
  choice: {
    flex: 1 / 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  choicetext: {
    textAlign: "center",
    color: "#BAC7B9",
    fontWeight: "800",
  },
  yearactive: {
    width: deviceWidthDp * 0.5,
    backgroundColor: "#EFFDDC",
    height: deviceHeightDp * 0.07,
    borderTopLeftRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 9,
  },
  monthactive: {
    width: deviceWidthDp * 0.5,
    backgroundColor: "#EFFDDC",
    height: deviceHeightDp * 0.07,
    borderTopRightRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 9,
  },
  forest: {
    flex: 33 / 36,
    backgroundColor: "#8B8179",
    width: deviceWidthDp,
    borderRadius: 25,
  },
  login: {
    width: deviceWidthDp * 0.7,
    height: deviceHeightDp * 0.06,
    marginTop: deviceHeightDp * 0.03,
  },
  loginstyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  button2: {
    width: deviceWidthDp * 0.425,
    height: deviceHeightDp * 0.05,
    backgroundColor: "white",
    justifyContent: "center",
    borderRadius: 9,
    elevation: 5,
  },
  button1: {
    width: deviceWidthDp * 0.425,
    height: deviceHeightDp * 0.05,
    backgroundColor: "white",
    elevation: 5,
    justifyContent: "center",
    borderRadius: 9,
  },
  buttonswitch: {
    backgroundColor: "#C6FF88",
  },
  headertext: {
    marginTop: deviceHeightDp * 0.02,
    color: "#444E38",
    fontWeight: "800",
    letterSpacing: 1.5,
    fontSize: deviceHeightDp * 0.02,
  },
  headregion: {
    flex: 3 / 32,
  },
  choiceregion: {
    flex: 1 / 16,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    width: deviceWidthDp,
  },
  findregion: {
    flex: 2 / 16,
  },
  unless2: {
    flex: 1 / 16,
  },
  contextregion: {
    flex: 1 / 16,
    width: deviceWidthDp,
    marginLeft: 10,
    marginTop: deviceHeightDp * 0.02,
  },
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
  test: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
  addButton: {
    position: "absolute",
    bottom: deviceHeightDp * 0.06,
    right: deviceWidthDp * 0.05,
    width: deviceWidthDp * 0.12,
    height: deviceWidthDp * 0.12,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: deviceWidthDp * 0.08,
    color: "black",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: deviceWidthDp * 0.9,
    height: deviceHeightDp * 0.9,
    backgroundColor: "white",
    padding: deviceWidthDp * 0.05,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "800",
    letterSpacing: 1.5,
    fontSize: deviceHeightDp * 0.02,
    marginTop: deviceHeightDp * 0.01,
    color: "#444E38",
  },
  input1: {
    width: deviceWidthDp * 0.8,
    height: deviceHeightDp * 0.045,
    backgroundColor: "white",
    textAlignVertical: "top",
    borderColor: "rgba(0,0,0,0.1)",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: deviceHeightDp * 0.02,
  },
  input2: {
    width: deviceWidthDp * 0.8,
    height: deviceHeightDp * 0.3,
    backgroundColor: "white",
    textAlignVertical: "top",
    borderColor: "rgba(0,0,0,0.1)",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginTop: deviceHeightDp * 0.02,
  },
});
