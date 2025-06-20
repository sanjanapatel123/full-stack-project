import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { useMutation } from "@apollo/client";
import { CREATE_EVENT } from "../graphql/mutations";

export default function CreateEventScreen() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState(""); // e.g. 2025-06-22T15:00

  const [createEvent] = useMutation(CREATE_EVENT);

  const handleCreate = async () => {
    try {
      await createEvent({
        variables: { name, location, startTime },
      });
      Alert.alert("✅ Event created!");
      setName("");
      setLocation("");
      setStartTime("");
    } catch (err) {
      console.error(err);
      Alert.alert("❌ Failed to create event");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🆕 Create Event</Text>
      <TextInput
        placeholder="Event name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />
      <TextInput
        placeholder="Start Time (YYYY-MM-DDTHH:MM)"
        value={startTime}
        onChangeText={setStartTime}
        style={styles.input}
      />
      <Button title="Create Event" onPress={handleCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
});
