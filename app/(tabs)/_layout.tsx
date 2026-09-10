import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useApp } from '@/context/AppContext';

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index"><NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} /><NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="create"><NativeTabs.Trigger.Icon sf={{ default: 'plus', selected: 'plus.circle.fill' }} /><NativeTabs.Trigger.Label>Create</NativeTabs.Trigger.Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="scan"><NativeTabs.Trigger.Icon sf={{ default: 'qrcode.viewfinder', selected: 'qrcode.viewfinder' }} /><NativeTabs.Trigger.Label>Scan</NativeTabs.Trigger.Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="history"><NativeTabs.Trigger.Icon sf={{ default: 'clock', selected: 'clock.fill' }} /><NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings"><NativeTabs.Trigger.Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} /><NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label></NativeTabs.Trigger>
    </NativeTabs>
  );
}

export default function TabLayout() {
  const { colors, t } = useApp();
  if (isLiquidGlassAvailable()) return <NativeTabLayout />;
  const tab = (name: keyof typeof Feather.glyphMap) => ({ color }: { color: any }) => <Feather name={name} size={21} color={color} />;
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.mutedForeground, tabBarStyle: { height: 78, paddingTop: 8, backgroundColor: colors.background, borderTopColor: colors.border, borderTopWidth: 1 }, tabBarBackground: () => Platform.OS === 'ios' ? <BlurView intensity={85} tint="light" style={StyleSheet.absoluteFill} /> : <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} /> }}>
    <Tabs.Screen name="index" options={{ title: t('home'), tabBarIcon: tab('home') }} />
    <Tabs.Screen name="create" options={{ title: t('create'), tabBarIcon: tab('plus') }} />
    <Tabs.Screen name="scan" options={{ title: t('scan'), tabBarIcon: tab('camera') }} />
    <Tabs.Screen name="history" options={{ title: t('history'), tabBarIcon: tab('clock') }} />
    <Tabs.Screen name="settings" options={{ title: t('settings'), tabBarIcon: tab('settings') }} />
  </Tabs>;
}