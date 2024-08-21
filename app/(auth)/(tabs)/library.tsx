import { getResourceSubscriptions } from "@/firebaseConfig";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Button, H2, ScrollView, Separator, Spinner, Text } from "tamagui";
import { useRouter } from "expo-router";
import { ResourceSubscription } from "@/types/ResourceSubscription";
import SubscriptionCard from "../_components/SubscriptionCard";
import QuizModal from "../_components/QuizModal";

export default function Library() {
  const router = useRouter();

  const { user } = useUser();

  const [subscriptions, setSubscriptions] = useState<ResourceSubscription[]>(
    []
  );
  const [fetching, setFetching] = useState<boolean>(true);

  const [quizData, setQuizData] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    getResourceSubscriptions(user.id)
      .then((subscriptions) => {
        setSubscriptions(subscriptions);
        setFetching(false);
      })
      .catch((e) => console.error(e));
  }, [user]);

  if (!user) {
    router.replace("/auth");
    return;
  }

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <ScrollView>
        <View
          style={{
            flex: 1,
            paddingVertical: 50,
            paddingHorizontal: 30,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <H2>Library</H2>
          <Separator />
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {fetching ? (
              <View
                style={{
                  marginTop: 10,
                  justifyContent: "center",
                  gap: 10,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "gray",
                    textAlign: "center",
                  }}
                >
                  Fetching subscriptions...
                </Text>
                <Spinner size="small" color="green" />
              </View>
            ) : subscriptions.length > 0 ? (
              subscriptions.map((sub) => {
                return (
                  <SubscriptionCard
                    key={sub.id}
                    sub={sub}
                    setSubscriptions={setSubscriptions}
                    setQuizData={setQuizData}
                  />
                );
              })
            ) : (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: "gray",
                    textAlign: "center",
                  }}
                >
                  You haven't subscribed to any books yet... 🥺 Visit the home
                  page to browse our catalog!
                </Text>
                <Button
                  theme={"green"}
                  onPress={() => {
                    router.push("/");
                  }}
                >
                  <Text>Go to Home</Text>
                </Button>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {quizData && <QuizModal quizData={quizData} setQuizData={setQuizData} />}
    </View>
  );
}
