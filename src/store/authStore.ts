import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface AuthState {
  token: string | null
  role: string | null
  userId: string | null
  fullName: string | null
  onboardingStep: number
  subscriptionActive: boolean
  guestToken: string | null
  guestEventId: string | null
  setAuth: (token: string, role: string, userId: string, fullName: string, onboardingStep: number, subscriptionActive: boolean) => void
  setGuestAuth: (token: string, eventId: string) => void
  logout: () => void
  logoutGuest: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      userId: null,
      fullName: null,
      onboardingStep: 1,
      subscriptionActive: true,
      guestToken: null,
      guestEventId: null,

      setAuth: (token, role, userId, fullName, onboardingStep, subscriptionActive) => {
        set({ token, role, userId, fullName, onboardingStep, subscriptionActive })
      },

      setGuestAuth: (token, eventId) => {
        set({ guestToken: token, guestEventId: eventId })
      },

      logout: () => {
        set({ 
          token: null, 
          role: null, 
          userId: null, 
          fullName: null, 
          onboardingStep: 1, 
          subscriptionActive: true 
        })
      },

      logoutGuest: () => {
        set({ guestToken: null, guestEventId: null })
      },
    }),
    {
      name: 'snapmoment-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
