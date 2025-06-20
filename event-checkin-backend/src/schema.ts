import { gql } from "apollo-server-express";
import { PrismaClient } from "@prisma/client";

export const typeDefs = gql`
  type User {
    id: String!
    name: String!
    email: String!
  }

  type Event {
    id: String!
    name: String!
    location: String!
    startTime: String!
    attendees: [User!]!
  }

  type Query {
    events: [Event!]!
    me: User
    event(id: String!): Event
  }

  type Mutation {
    joinEvent(eventId: String!): Event
    createEvent(name: String!, location: String!, startTime: String!): Event
  }
`;

export const resolvers = {
  Query: {
    events: async (_: any, __: any, { prisma }: any) =>
      prisma.event.findMany({ include: { attendees: true } }),
    me: async (_: any, __: any, { user }: any) => user,
    event: async (_: any, { id }: any, { prisma }: any) =>
      prisma.event.findUnique({
        where: { id },
        include: { attendees: true },
      }),
  },

  Mutation: {
    joinEvent: async (_: any, { eventId }: any, { user, prisma, io }: any) => {
      if (!user) throw new Error("Not authenticated");

      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: user.id,
            name: user.name,
            email: user.email || `${user.id}@demo.com`,
          },
        });
      }

      await prisma.event.update({
        where: { id: eventId },
        data: { attendees: { connect: { id: user.id } } },
      });

      const updatedEvent = await prisma.event.findUnique({
        where: { id: eventId },
        include: { attendees: true },
      });

      io.emit("eventUpdate", updatedEvent);

      return updatedEvent;
    },

    // ✅ Add this below joinEvent
    createEvent: async (
      _: any,
      { name, location, startTime }: any,
      { prisma, io }: any
    ) => {
      const newEvent = await prisma.event.create({
        data: {
          name,
          location,
          startTime: new Date(startTime).toISOString(),
        },
        include: { attendees: true },
      });

      io.emit("eventUpdate", newEvent);

      return newEvent;
    },
  },
};
