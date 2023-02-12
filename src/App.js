import "./styles.css";
import { useState, useRef, useEffect } from "react";
import PlayPauseIcon from "./PlayPause";
import VideoHeader from "./VideoHeader";
import Captions from "./captions.vtt";
import ProgressBar from "./ProgressBar";
import RenderCaptions from "./RenderCaptions";
import VideoUtils from "../video_utils";
export default function App() {
  const [playedTime, setPlayedTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVideoPaused, setIsVideoPaused] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [allCaptions, setAllCaptions] = useState([]);
  const [currentCaptions, setCurrentCaptions] = useState("");
  const [isCaptionOn, setIsCaptionOn] = useState(true);
  const [renderProgressAndHeader, setRenderProgressAndHeader] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);

  const videoRef = useRef();
  const containerRef = useRef();
  const totalDuration = videoRef.current?.duration;
  const currentDuration = videoRef.current?.currentTime;

  const parseVtt = (string) => {
    const chunk = string.split("\n").map((item) => item.trim());
    let finalCaptions = [];
    chunk.forEach((line, index) => {
      if (line.startsWith("00:")) {
        const [start, end] = line.split(" --> ");
        finalCaptions.push({
          start: start,
          end: end,
          text: chunk[index + 1] + "\n"
        });
      }
    });
    return finalCaptions;
  };

  const convertTimeToSeconds = (time) => {
    const match = time.match(/(\d+):(\d+)\.(\d+)/);
    return (
      parseInt(match[1], 10) * 60 +
      parseInt(match[2], 10) +
      parseInt(match[3], 10) / 1000
    );
  };

  useEffect(() => {
    const video = document.querySelector("video");
    setDuration(video.duration);
  }, []);

  useEffect(() => {
    fetch(Captions)
      .then((res) => res.text())
      .then((vttData) => {
        const parsedSubtitles = parseVtt(vttData);
        setAllCaptions(parsedSubtitles);
      });
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.ontimeupdate = () => {
        const currentTime = videoRef.current.currentTime;

        const subtitle = allCaptions.find(
          (cue) =>
            convertTimeToSeconds(cue.start) <= currentTime &&
            convertTimeToSeconds(cue.end) >= currentTime
        );

        if (subtitle) {
          setCurrentCaptions(subtitle.text);
        } else {
          setCurrentCaptions("");
        }
      };
    }
  }, [allCaptions, videoRef]);

  const playPauseVideo = () => {
    if (isVideoPaused) {
      if (isVideoMuted && videoRef.current.currentTime > 0) {
        videoRef.current.currentTime = 0;
        setIsVideoMuted(false);
        setRenderProgressAndHeader(false);
      }
      setIsVideoPaused(!isVideoPaused);
      videoRef.current.play();
      setIsVideoMuted(false);
      setRenderProgressAndHeader(true);
    } else {
      videoRef.current.pause();
      setIsVideoPaused(!isVideoPaused);
      setRenderProgressAndHeader(true);
    }
  };

  const handleIncreaseSpeed = () => {
    if (speed >= 2) {
      setSpeed(1);
      videoRef.current.playbackRate = 1;
      return;
    }

    setSpeed(speed + 0.5);
    videoRef.current.playbackRate = speed + 0.5;
  };

  const videoSource =
    "https://media.videoask.com/transcoded/dabd0292-cf99-40ba-a12a-245a279b31dc/video.mp4?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZWRpYV9pZCI6ImRhYmQwMjkyLWNmOTktNDBiYS1hMTJhLTI0NWEyNzliMzFkYyIsImV4cCI6MTY3NTc4OTkwNH0.aOYpLnsEkGkbn7NmuCDTFNOBG34Fd-rfbX0f4gV6Y5mzOHU7nMMm11S9W1n1A3YiGD3_T_uqwnE1WNvt3XMliesPwh5RCVUnmJ8ZNlLszN0QXutxuv69ImpGq6Vbvn0mbuScHreHPbd0ob1QM6BDRcZ521Lqx1Lf1xByuIj32Dl_P4I0bekilKCnI9BsuJAtH9ntRzCdok3-5BUXnAQ4586cNvn_8b5f5b6QSzGm3M3GvHIjpJnvYZkx8BxRFdJKooGaY66AbzV8bKui3rnOhn9GKhHwCOqIqiMeHJo_-VCyX3X0WmvEiAskWaw-HMt0Nx8z1olQy1340BDB1zJ5iD3CDMepndI6DmGkV-E_79a9gaZAzau1x-2ZwAhM-OEP32eAAz2O5F_iksyNUM0ImNKqeZQwe03yTmrZfaaeBGSXEZ_cenGGi6TnKNnVkkKie-_-FjO4oa7nczW1DnSErlVZfAtkh6RNokpLy_rBBaKTMgS8gz9p7fUVgmj9f-jvDh8rahHc_Dhrbml5flXhZ6ucW5ZHVzQTzCb7ThPDspMouJjOkjY8SAi_-yHfT-d8R3F8bY68HqrKvL-RgddefqL_vmRp6588jMl_6C_doGT2v2zV5apOl0nUgCrxorZQlR9kiZaBMTjKcp_ClWTs6yTQ53H-8Nj1Xb1gqL41BOI";

  return (
    <div
      className="App"
      height="100%"
      onMouseEnter={() => setIsVideoHovered(true)}
      onMouseLeave={() => setIsVideoHovered(false)}
      width="100%"
      ref={containerRef}
    >
      <ProgressBar
        currentTime={playedTime}
        totalDuration={totalDuration}
        handleSkip={(e) => VideoUtils.handleSkip(e, videoRef)}
        renderProgressAndHeader={renderProgressAndHeader}
      />
      <VideoHeader
        currentTime={currentDuration}
        totalDuration={totalDuration}
        isFullScreen={isFullScreen}
        isCaptionOn={isCaptionOn}
        speed={speed}
        setIsCaptionOn={setIsCaptionOn}
        handleIncreaseSpeed={() => handleIncreaseSpeed()}
        handleToggleFullScreen={() =>
          VideoUtils.handleToggleFullScreen({
            isFullScreen,
            setIsFullScreen,
            containerRef
          })
        }
        renderProgressAndHeader={renderProgressAndHeader}
      />
      {isVideoPaused ? (
        <PlayPauseIcon
          hoveredVideo={isVideoHovered}
          playPauseVideo={playPauseVideo}
        />
      ) : null}
      <video
        width="100%"
        height="100%"
        controls={false}
        autoPlay
        muted={isVideoMuted ? true : false}
        ref={videoRef}
        onClick={playPauseVideo}
        onEnded={() => setIsVideoPaused(true)}
        onTimeUpdate={() => {
          setPlayedTime(
            videoRef.current.currentTime / videoRef.current.duration
          );
          setDuration(videoRef.current.duration);
        }}
      >
        <source src={videoSource} type="video/mp4" />
      </video>
      {allCaptions && currentCaptions && isCaptionOn && (
        <RenderCaptions currentCaptions={currentCaptions} />
      )}
    </div>
  );
}
