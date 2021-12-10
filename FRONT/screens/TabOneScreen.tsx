import { Box, NativeBaseProvider, Text } from "native-base";
import React from "react";
import SignIn from "./SignIn";

export default function App() {
  return (
    <NativeBaseProvider>
      <SignIn />
    </NativeBaseProvider>
  );
}