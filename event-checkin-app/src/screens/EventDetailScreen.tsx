import React from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery, gql } from "@apollo/client";
import { GET_ME } from "../graphql/queries";

const GET_EVENT = gql`
  query GetEvent($eventId: String!) {
    event(id: $eventId) {
      id
      name
      location
      startTime
      attendees {
        id
        name
        email
      }
    }
  }
`;

export default function EventDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { data: meData } = useQuery(GET_ME);

  const { eventId } = route.params as { eventId: string };

  const { data, loading, error } = useQuery(GET_EVENT, {
    variables: { eventId },
  });

  if (loading) return <Text>Loading event...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const event = data.event;
  return (
    <View style={styles.container}>
      {/* <Button title="← Back to Events" onPress={() => navigation.goBack()} /> */}
      <Text style={styles.heading}>{event.name}</Text>
      <Text style={styles.sub}>📍 {event.location}</Text>
      <Text style={styles.sub}>
        🕒{" "}
        {new Date(Number(event.startTime)).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </Text>

      {event.attendees.some((a) => a.id === meData?.me?.id) && (
        <Text style={{ color: "green", fontWeight: "bold", marginVertical: 8 }}>
          ✅ You already joined this event!
        </Text>
      )}

      <Text style={styles.sub}>👥 Attendees:</Text>

      <FlatList
        data={event.attendees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.attendeeRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name[0]}</Text>
            </View>
            <View>
              <Text style={styles.attendeeName}>{item.name}</Text>
              <Text style={styles.attendeeEmail}>{item.email}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  sub: { fontSize: 16, marginVertical: 4 },
  attendee: { fontSize: 14, marginVertical: 2 },
  attendeeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6200ee",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  attendeeName: {
    fontSize: 16,
    fontWeight: "600",
  },
  attendeeEmail: {
    fontSize: 14,
    color: "#555",
  },
});
