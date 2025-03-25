import { Text, View, StyleSheet, Dimensions, Pressable } from "react-native";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { post, get } from "@/components/Api";

const deviceWidthDp = Dimensions.get("screen").width;
const deviceHeightDp = Dimensions.get("screen").height;

const isSmallScreen = deviceWidthDp < 400;

const smallScreenLand = {
  bottom: deviceHeightDp * 0.305,
  left: deviceWidthDp * 0.055,
  width: deviceWidthDp * 0.85,
  height: deviceHeightDp * 0.28,
};

const mediumScreenLand = {
  bottom: deviceHeightDp * 0.32,
  width: deviceWidthDp * 0.93,
  height: deviceHeightDp * 0.3,
};
const smallScreenLandSmall = {
  bottom: -deviceHeightDp * 0.15,
  left: deviceWidthDp * 0.025,
  width: deviceWidthDp * 0.3,
  height: deviceHeightDp * 0.11,
};

const mediumScreenLandSmall = {
  bottom: -deviceHeightDp * 0.155,
  width: deviceWidthDp * 0.36,
  height: deviceHeightDp * 0.12,
  left: -deviceWidthDp * 0.004,
};

// 定义类型
interface Task {
  task_id: string;
  title: string;
  details: string;
  completed: boolean;
}

interface TasksData {
  [date: string]: Task[];
}

interface MonthData {
  name: string;
  trees: number;
}

interface ForestYearData {
  year: number;
  months: MonthData[];
}

interface MonthTreeCounts {
  [year: string]: {
    [month: string]: number;
  };
}

// 初始化假数据（格式与原代码一致）
const initialForestData: ForestYearData[] = [
  {
    year: 2024,
    months: [
      { name: "1月", trees: 5 },
      { name: "2月", trees: 10 },
      { name: "3月", trees: 15 },
      { name: "4月", trees: 20 },
      { name: "5月", trees: 25 },
      { name: "6月", trees: 30 },
      { name: "7月", trees: 18 },
      { name: "8月", trees: 12 },
      { name: "9月", trees: 8 },
      { name: "10月", trees: 22 },
      { name: "11月", trees: 14 },
      { name: "12月", trees: 7 },
    ],
  },
  {
    year: 2025,
    months: [
      { name: "1月", trees: 6 },
      { name: "2月", trees: 11 },
      { name: "3月", trees: 16 },
      { name: "4月", trees: 21 },
      { name: "5月", trees: 26 },
      { name: "6月", trees: 31 },
      { name: "7月", trees: 19 },
      { name: "8月", trees: 13 },
      { name: "9月", trees: 9 },
      { name: "10月", trees: 23 },
      { name: "11月", trees: 15 },
      { name: "12月", trees: 8 },
    ],
  },
];

export default function MainPage() {
  const [buttonState, setButtonState] = useState("month");
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYearIndex, setCurrentYearIndex] = useState(0);
  const [forestData, setForestData] = useState<ForestYearData[]>(initialForestData);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const response = await get("http://8.129.3.142:8080/goal/HistoricalGoal", true);
        const result = await response.json();
        const taskData: TasksData = result.data;
        console.log("后端任务数据：", taskData);

        // 遍历任务数据，统计每个年月中当天完成任务数量超过2的天数
        const monthTreeCounts: MonthTreeCounts = {};
        Object.keys(taskData).forEach((dateStr) => {
          // dateStr 格式："YYYY-MM-DD"
          const [year, month] = dateStr.split("-");
          const completedCount: number = taskData[dateStr].filter(task => task.completed).length;
          if (completedCount > 1) {
            if (!monthTreeCounts[year]) {
              monthTreeCounts[year] = {};
            }
            if (!monthTreeCounts[year][month]) {
              monthTreeCounts[year][month] = 0;
            }
            monthTreeCounts[year][month] += 1;
          }
        });
        console.log("统计后的每月种树天数：", monthTreeCounts);

        // 根据统计结果更新初始的 forestData
        const updatedForestData: ForestYearData[] = forestData.map((yearData) => {
          const yearStr = yearData.year.toString();
          const updatedMonths = yearData.months.map((monthData, index) => {
            // 月份转为两位字符串：如 1 -> "01"
            const monthKey = (index + 1).toString().padStart(2, "0");
            // 如果后端有统计数据，则用统计的天数作为树的数量，否则为 0
            const trees = monthTreeCounts[yearStr]?.[monthKey] ?? 0;
            return { ...monthData, trees };
          });
          return { ...yearData, months: updatedMonths };
        });
        console.log("更新后的森林数据：", updatedForestData);
        setForestData(updatedForestData);
      } catch (e) {
        alert("获取失败");
        console.error(e);
      }
    };
    getEvents();
  }, []);

  const handlebuttonYear = () => setButtonState("year");
  const handlebuttonMonth = () => setButtonState("month");

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 11) {
        setCurrentYearIndex((prevYearIndex) => (prevYearIndex + 1) % forestData.length);
        return 0;
      } else {
        return prevMonth + 1;
      }
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 0) {
        setCurrentYearIndex((prevYearIndex) => (prevYearIndex - 1 + forestData.length) % forestData.length);
        return 11;
      } else {
        return prevMonth - 1;
      }
    });
  };

  const handleNextYear = () => {
    setCurrentYearIndex((prev) => (prev + 1) % forestData.length);
  };

  const handlePrevYear = () => {
    setCurrentYearIndex((prev) => (prev - 1 + forestData.length) % forestData.length);
  };

  // 在数据未加载完成时（例如 forestData 为空时）可显示 loading
  if (!forestData || forestData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#FFF" }}>加载中...</Text>
      </View>
    );
  }

  if (buttonState === "month") {
    // 月度森林页面：使用当前年份和当前月份的数据
    const currentMonthData = forestData[currentYearIndex].months[currentMonth];
    return (
      <LinearGradient
        colors={["#D8F9C0", "#F2FFCF", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.27, 0.79]}
        style={styles.container}
      >
        <View style={styles.head}>
          <Text style={styles.headertext}>森林</Text>
        </View>
        <View style={styles.forest}>
          <View style={styles.choice}>
            <Pressable onPress={handlebuttonMonth} style={styles.month}>
              {buttonState === "month" ? (
                <View style={styles.monthactive}>
                  <Image
                    style={{
                      width: deviceWidthDp * 0.2,
                      height: deviceHeightDp * 0.0255,
                    }}
                    source={require("../../assets/images/月度森林.png")}
                  />
                </View>
              ) : (
                <Text style={styles.choicetext}>月度森林</Text>
              )}
            </Pressable>
            <Pressable onPress={handlebuttonYear} style={styles.year}>
              <Text style={styles.choicetext}>年度森林</Text>
            </Pressable>
          </View>
          <LinearGradient
            colors={["#EFFDDC", "#FAFFE9", "#FBFDDA", "#EFFEDC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0.16, 0.36, 0.64, 0.75]}
            style={styles.functionregion}
          >
            <Image
              style={styles.land}
              source={require("../../assets/images/土地.png")}
            />
            <View style={styles.treesContainer}>
              {Array.from({ length: currentMonthData.trees }).map((_, index) => {
                const row = Math.floor(index / 5);
                const col = index % 5;
                const treeWidth = deviceWidthDp * 0.1;
                const treeHeight = deviceHeightDp * 0.02;
                const horizontalOffset = treeWidth * 0.75;
                const verticalOffset = treeHeight * 0.68;
                const leftShiftPerRow = deviceWidthDp * 0.06;
                const upShiftPerRow = deviceWidthDp * 0.03;
                const left = col * horizontalOffset - row * leftShiftPerRow;
                const top = row * (treeHeight + 6) - row * upShiftPerRow + col * verticalOffset;
                return (
                  <Image
                    key={index}
                    source={require("../../assets/images/树.png")}
                    style={[styles.tree, { position: "absolute", left, top }]}
                  />
                );
              })}
            </View>
            <View style={styles.monthSwitcher}>
              <Pressable onPress={handlePrevMonth} style={styles.arrow}>
                <Image
                  style={{
                    width: deviceWidthDp * 0.05,
                    height: deviceHeightDp * 0.03,
                  }}
                  source={require("../../assets/images/左移动.png")}
                />
              </Pressable>
              <Text style={styles.monthText}>
                {currentMonthData.name} ({forestData[currentYearIndex].year})
              </Text>
              <Pressable onPress={handleNextMonth} style={styles.arrow}>
                <Image
                  style={{
                    width: deviceWidthDp * 0.05,
                    height: deviceHeightDp * 0.03,
                  }}
                  source={require("../../assets/images/右移动.png")}
                />
              </Pressable>
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>
    );
  }

  if (buttonState === "year") {
    // 年度森林页面：显示当前年份所有月份的网格，每个单元显示当月种树数量
    const currentYearData = forestData[currentYearIndex];
    return (
      <LinearGradient
        colors={["#D8F9C0", "#F2FFCF", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.27, 0.79]}
        style={styles.container}
      >
        <View style={styles.head}>
          <Text style={styles.headertext}>森林</Text>
        </View>
        <View style={styles.forest}>
          <View style={styles.choice}>
            <Pressable onPress={handlebuttonMonth} style={styles.month}>
              <Text style={styles.choicetext}>月度森林</Text>
            </Pressable>
            <Pressable onPress={handlebuttonYear} style={styles.year}>
              <View style={styles.yearactive}>
                <Image
                  style={{
                    width: deviceWidthDp * 0.18,
                    height: deviceHeightDp * 0.025,
                  }}
                  source={require("../../assets/images/年度森林.png")}
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
            <View style={styles.yearGrid}>
              {currentYearData.months.map((month, index) => (
                <View key={index} style={styles.yearCell}>
                  <Text style={styles.yearMonthText}>{month.name}</Text>
                  <Image
                    style={styles.landSmall}
                    source={require("../../assets/images/土地.png")}
                  />
                  <View style={styles.treesContainerSmall}>
                    {Array.from({ length: month.trees }).map((_, treeIndex) => {
                      const row = Math.floor(treeIndex / 5);
                      const col = treeIndex % 5;
                      const treeWidth = deviceWidthDp * 0.01;
                      const treeHeight = deviceHeightDp * 0.002;
                      const horizontalOffset = treeWidth * 2.5;
                      const verticalOffset = treeHeight * 2.3;
                      const leftShiftPerRow = deviceWidthDp * 0.019;
                      const upShiftPerRow = deviceWidthDp * 0.0085;
                      const left = col * horizontalOffset - row * leftShiftPerRow;
                      const top = row * (treeHeight + 6) - row * upShiftPerRow + col * verticalOffset;
                      return (
                        <Image
                          key={treeIndex}
                          source={require("../../assets/images/树.png")}
                          style={[styles.treeSmall, { position: "absolute", left, top }]}
                        />
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.yearSwitcher}>
              <Pressable onPress={handlePrevYear} style={styles.arrow}>
                <Image
                  style={styles.arrowImage}
                  source={require("../../assets/images/左移动.png")}
                />
              </Pressable>
              <Text style={styles.monthText}>{currentYearData.year}</Text>
              <Pressable onPress={handleNextYear} style={styles.arrow}>
                <Image
                  style={styles.arrowImage}
                  source={require("../../assets/images/右移动.png")}
                />
              </Pressable>
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  arrowImage: {
    padding: 10,
    width: deviceWidthDp * 0.05,
    height: deviceHeightDp * 0.03,
  },
  yearGrid: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: deviceHeightDp * 0.4,
    marginTop: deviceHeightDp * 0.02,
  },
  yearCell: {
    width: "40%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  landSmall: {
    position: "absolute",
    resizeMode: "center",
    ...(isSmallScreen ? smallScreenLandSmall : mediumScreenLandSmall),
  },
  treesContainerSmall: {
    position: "absolute",
    top: deviceHeightDp * 0.132,
    left: deviceWidthDp * 0.136,
    width: "90%",
    height: "40%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  treeSmall: {
    width: "15%",
    height: "30%",
    resizeMode: "center",
  },
  yearMonthText: {
    position: "absolute",
    top: deviceHeightDp * 0.12,
    fontSize: deviceWidthDp * 0.03,
    fontWeight: "bold",
  },
  yearSwitcher: {
    position: "absolute",
    bottom: deviceHeightDp * 0.1,
    flexDirection: "row",
    alignItems: "center",
  },
  arrow: {
    padding: 10,
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
  choicetext: {
    textAlign: "center",
    color: "#BAC7B9",
    fontWeight: "800",
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
  functionregion: {
    flex: 14 / 15,
    alignItems: "center",
    justifyContent: "center",
  },
  headertext: {
    marginTop: deviceHeightDp * 0.07,
    color: "#444E38",
    fontWeight: "800",
    letterSpacing: 1.5,
    fontSize: deviceHeightDp * 0.02,
  },
  head: {
    flex: 1 / 8,
  },
  forest: {
    flex: 7 / 8,
    backgroundColor: "#8B8179",
    width: deviceWidthDp,
    borderRadius: 25,
  },
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  land: {
    position: "absolute",
    ...(isSmallScreen ? smallScreenLand : mediumScreenLand),
  },
  treesContainer: {
    position: "absolute",
    top: deviceHeightDp * 0.17,
    left: deviceWidthDp * 0.4,
    width: deviceWidthDp * 0.8,
    height: deviceHeightDp * 0.25,
  },
  tree: {
    width: deviceWidthDp * 0.1,
    height: deviceHeightDp * 0.08,
    resizeMode: "center",
  },
  monthSwitcher: {
    position: "absolute",
    bottom: deviceHeightDp * 0.2,
    flexDirection: "row",
    alignItems: "center",
  },
  monthText: {
    color: "#444E38",
    fontWeight: "800",
    letterSpacing: 1.5,
    fontSize: deviceHeightDp * 0.02,
  },
});
