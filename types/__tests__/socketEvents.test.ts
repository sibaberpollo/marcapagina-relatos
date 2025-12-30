/**
 * Type validation tests for socket events
 * This file ensures our TypeScript definitions are correct
 */

import type {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketEventHandler,
  ServerEventPayload,
  ClientEventPayload,
  isUserJoinedPayload,
  isSegmentSubmittedPayload,
  isStatusUpdatedPayload,
} from '../types/socketEvents'

// Test type extraction
type TestUserJoinedPayload = ServerEventPayload<'user-joined'>
type TestSubmitSegmentPayload = ClientEventPayload<'submit-segment'>

// Test event handler types
const testUserJoinedHandler: SocketEventHandler<TestUserJoinedPayload> = (payload) => {
  console.log(payload.userId, payload.user.name)
}

// Test type guards
const testPayload = { userId: '123', user: { id: '123', name: 'Test' } }
if (isUserJoinedPayload(testPayload)) {
  console.log('Valid UserJoinedPayload:', testPayload.userId)
}

// Test that types are properly exported and usable
export type {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketEventHandler,
}