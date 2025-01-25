import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function RootLayout() {
  return  (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="(tabsin)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabsindex)" options={{headerShown:false}}/>
        <Stack.Screen name="(reallyTabs)" options={{headerShown:false}}/>
        
      </Stack>
   
    </>
  );
}
