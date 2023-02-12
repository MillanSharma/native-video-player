import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import VideoUtils from "../video_utils";
function VideoHeader(props) {
  const {
    currentTime,
    totalDuration,
    isFullScreen,
    isCaptionOn,
    speed,
    setIsCaptionOn,
    handleIncreaseSpeed,
    handleToggleFullScreen,
    renderProgressAndHeader
  } = props;

  if (!renderProgressAndHeader) {
    return null;
  }

  const getDynamicStyle = () => {
    if (speed === 1) {
      return "speed1";
    }
    if (speed === 1.5 || speed === 2) {
      return "speed2";
    }
  };

  return (
    <div className="videoHeader">
      <h5 className="durationText">
        {VideoUtils.formatDuration(currentTime)} /{" "}
        {VideoUtils.formatDuration(totalDuration)}{" "}
      </h5>
      <div
        onClick={() => setIsCaptionOn(!isCaptionOn)}
        className={isCaptionOn ? "closedCaptions-on" : "closeCaptions-off"}
      >
        CC
      </div>
      <div
        role="button"
        onClick={() => handleIncreaseSpeed(speed)}
        className={getDynamicStyle()}
      >
        {speed}x
      </div>
      {isFullScreen ? (
        <MdFullscreenExit onClick={handleToggleFullScreen} size="3rem" />
      ) : (
        <MdFullscreen
          onClick={handleToggleFullScreen}
          size="2rem"
          color="white"
        />
      )}
    </div>
  );
}
export default VideoHeader;
