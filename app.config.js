module.exports = {
  name: "expo-recall",
  scheme: "https",
  version: "1.0.0",
  extra: {
    clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    projectId: process.env.EXPO_PROJECT_ID,
  },
};
