import { gql } from "@apollo/client";

export const JOIN_EVENT = gql`
  mutation JoinEvent($eventId: String!) {
    joinEvent(eventId: $eventId) {
      id
      name
      attendees {
        id
        name
      }
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent(
    $name: String!
    $location: String!
    $startTime: String!
  ) {
    createEvent(name: $name, location: $location, startTime: $startTime) {
      id
      name
      location
      startTime
    }
  }
`;
