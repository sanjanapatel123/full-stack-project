import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { GET_EVENTS, GET_ME } from "../graphql/queries";
import { JOIN_EVENT } from "../graphql/mutations";
import io from "socket.io-client";
import { useAuthStore } from "../store/authStore";
import { useNavigation } from "@react-navigation/native";

const SOCKET_URL = "http://192.168.0.102:4000";
const socket = io(SOCKET_URL);

export default function EventListScreen() {
  const { loading, error, data, refetch } = useQuery(GET_EVENTS);
  const { data: meData, loading: meLoading } = useQuery(GET_ME);
  const [joinEvent] = useMutation(JOIN_EVENT);
  const { logout } = useAuthStore();
  const navigation = useNavigation();

  useEffect(() => {
    socket.on("eventUpdate", (updatedEvent) => {
      console.log("🔁 Event Updated:", updatedEvent);
      refetch(); // re-fetch data to update UI
    });

    return () => {
      socket.off("eventUpdate");
    };
  }, []);

  const handleJoin = async (eventId: string) => {
    try {
      await joinEvent({ variables: { eventId } });
      Alert.alert("✅ Joined Event!");
    } catch (err) {
      Alert.alert("❌ Failed to join event");
      console.error(err);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;
  if (error) return <Text style={styles.error}>Error loading events 😓</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📋 Events</Text>

      {meLoading ? (
        <Text>Loading user...</Text>
      ) : (
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 16 }}>👋 Welcome, {meData?.me?.name}</Text>
          <Button title="Logout" onPress={logout} />
        </View>
      )}

      {/* ✅ Show Create Button Once, not per item */}
      <Button
        title="➕ Create Event"
        onPress={() => navigation.navigate("CreateEvent")}
      />

      <FlatList
        data={data.events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>📍 {item.location}</Text>
            <Text>
              🕒{" "}
              {new Date(Number(item.startTime)).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Text>
            <Text>👥 Attendees: {item.attendees.length}</Text>

            <Button title="Join" onPress={() => handleJoin(item.id)} />
            <View style={{ height: 8 }} />
            <Button
              title="View Details"
              onPress={() =>
                navigation.navigate("EventDetail", { eventId: item.id })
              }
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center" },
  error: { color: "red", textAlign: "center", marginTop: 20 },
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  title: { fontSize: 18, fontWeight: "bold" },
});
