import React from "react";
import {
  ApolloProvider,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  ApolloClient,
} from "@apollo/client";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuthStore } from "./src/store/authStore";
import LoginScreen from "./src/screens/LoginScreen";
import EventListScreen from "./src/screens/EventListScreen";
import EventDetailScreen from "./src/screens/EventDetailScreen"; // 👈 new screen
import CreateEventScreen from "./src/screens/CreateEventScreen";

const Stack = createNativeStackNavigator();

function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  console.log("🔑 Token from Zustand:", token);

  const httpLink = new HttpLink({
    uri: "http://192.168.0.102:4000/graphql",
  });

  const authLink = new ApolloLink((operation, forward) => {
    if (token) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    }
    return forward(operation);
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export default function App() {
  const { token } = useAuthStore();
  console.log("📤 Setting headers:", token);

  return (
    <ApolloWrapper>
      {token ? (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Events" component={EventListScreen} />
            <Stack.Screen name="EventDetail" component={EventDetailScreen} />
            <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <LoginScreen onLogin={() => {}} />
      )}
    </ApolloWrapper>
  );
}
