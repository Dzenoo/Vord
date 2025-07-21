"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { UserTypes } from "@/types/users";
import { FadeLoader } from "react-spinners";
import { useRouter } from "next/navigation";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
  user: UserTypes;
}

const MediaRoom: React.FC<MediaRoomProps> = ({
  chatId,
  video,
  audio,
  user,
}) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user) return;

    const name = `${user?.name}`;

    (async () => {
      try {
        const response = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [user?.name, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col justify-center items-center">
        <FadeLoader />
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default MediaRoom;
