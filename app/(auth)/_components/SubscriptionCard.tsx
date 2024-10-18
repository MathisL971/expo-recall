import { View, Text, Switch } from "react-native";
import React, { useEffect } from "react";
import TrashIcon from "../../../assets/svgs/trash";
import QuestionIcon from "../../../assets/svgs/question";

import { Button, Card, H4, Slider, Spinner } from "tamagui";
import { useState } from "react";
import {
  deleteResourceSubscriptionById,
  updateResourceSubscription,
} from "../../../firebaseConfig";
import { ResourceSubscription } from "@/types/ResourceSubscription";
import axios, { AxiosError, AxiosResponse } from "axios";

type SubscriptionCardProps = {
  sub: ResourceSubscription;
  setSubscriptions: React.Dispatch<
    React.SetStateAction<ResourceSubscription[]>
  >;
  setQuizData: React.Dispatch<React.SetStateAction<any>>;
};

const SubscriptionCard = (props: SubscriptionCardProps) => {
  const { sub, setSubscriptions, setQuizData } = props;

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pageEnd, setPageEnd] = useState(sub.maxPage);

  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    if (updateCount === 0) return;

    updateResourceSubscription(sub.id, {
      maxPage: pageEnd,
    }).catch((error) => {
      console.error(error);
    });
  }, [updateCount]);

  return (
    <Card
      key={sub.id}
      elevate
      size="$4"
      bordered
      width={"fit-content"}
      height={"fit-content"}
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
    >
      <Card.Header
        padded
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <H4 fontSize={20}>{sub.resource.title}</H4>
        <Text
          style={{
            fontSize: 17,
            color: "gray",
          }}
        >
          {sub.resource.author}
        </Text>
      </Card.Header>
      <Card.Footer
        padded
        paddingTop={0}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Slider
            max={sub.resource.numPages}
            min={0}
            step={1}
            dir="ltr"
            width={"80%"}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexGrow: 1,
            }}
            value={[0, pageEnd]}
            onValueChange={(value) => {
              setPageEnd(value[1]);
            }}
            onSlideEnd={() => {
              setUpdateCount(updateCount + 1);
            }}
          >
            <Slider.Track
              style={{
                height: 5,
                borderRadius: 5,
                backgroundColor: "gray",
              }}
            >
              <Slider.TrackActive
                style={{
                  backgroundColor: "green",
                }}
              />
            </Slider.Track>
            <Slider.Thumb size="$2" index={1} circular />
          </Slider>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "15%",
              flexGrow: 1,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
              }}
            >
              {pageEnd}
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 10,
            marginBottom: "auto",
          }}
        >
          <Button
            size={"$3"}
            theme={"green_active"}
            width={"$5.5"}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={async () => {
              try {
                setLoading(true);
                const response: AxiosResponse = await axios.post(
                  `https://7f12-2a01-cb20-c00f-9f00-6196-813e-e76-b303.ngrok-free.app/create-question`,
                  {
                    subscriptionId: sub.id,
                  }
                );

                setLoading(false);
                setQuizData({
                  subscription: sub,
                  initialQuestion: response.data,
                });
              } catch (error) {
                if (axios.isAxiosError(error)) {
                  const axiosError: AxiosError = error;
                  console.error(axiosError.response);
                } else {
                  console.error(error);
                }
                setLoading(false);
              }
            }}
          >
            <Text>
              {loading ? (
                <Spinner
                  size="small"
                  color="$green10"
                  style={{ marginTop: 3, paddingTop: 5 }}
                />
              ) : (
                <View style={{ paddingTop: 5 }}>
                  <QuestionIcon />
                </View>
              )}
            </Text>
          </Button>
          {/* <Switch
            value={sub.shouldQuiz}
            onValueChange={async () => {
              try {
                updateResourceSubscription(sub.id, {
                  shouldQuiz: !sub.shouldQuiz,
                });
                setSubscriptions((subs) =>
                  subs.map((s) =>
                    s.id === sub.id
                      ? { ...sub, shouldQuiz: !sub.shouldQuiz }
                      : s
                  )
                );
              } catch (error) {
                console.error(error);
              }
            }}
          /> */}
          <Button
            size={"$3"}
            theme={"red"}
            width={"$5"}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            onTouchStart={async () => {
              if (deleting) return;

              setDeleting(true);
              try {
                await deleteResourceSubscriptionById(sub.id);
                setSubscriptions((subs) => subs.filter((s) => s.id !== sub.id));
                setDeleting(false);
              } catch (error) {
                console.error(error);
                setDeleting(false);
              }
            }}
          >
            {deleting ? (
              <Spinner size="small" color="$red10" style={{ marginTop: 3 }} />
            ) : (
              <TrashIcon />
            )}
          </Button>
        </View>
      </Card.Footer>
    </Card>
  );
};

export default SubscriptionCard;
