import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GroupProvider } from "./groupprovider";

export default function RootLayout() {
  return  (
    <GroupProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="(tabsin)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabsindex)" options={{headerShown:false}}/>
        <Stack.Screen name="(reallyTabs)" options={{headerShown:false}}/>
        <Stack.Screen name="(reallyTabsin)" options={{headerShown:false}}/>
        <Stack.Screen name="(reallyTabsin2)" options={{headerShown:false}}/>
        <Stack.Screen name="groupcom" options={{headerShown:false}}/>
        <Stack.Screen name="(groupsettings)" options={{headerShown:false}}/>
        <Stack.Screen name="(calender)" options={{headerShown:false}}/>
        <Stack.Screen name="(AI)" options={{headerShown:false}}/>

      </Stack>
   
    </GroupProvider>
  );
}
