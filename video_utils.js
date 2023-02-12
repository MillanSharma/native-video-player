const VideoUtils = module.exports;

VideoUtils.formatDuration = (duration) => {
  if (isNaN(duration)) return "00:00";

  let minutes = Math.floor(duration / 60);
  let seconds = Math.floor(duration % 60);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return minutes + ":" + seconds;
};

VideoUtils.handleSkip = (e, videoRef) => {
  const clickPosition = e.clientX;
  const progressBar = e.target.getBoundingClientRect();
  const newTime = (clickPosition - progressBar.left) / progressBar.width;
  videoRef.current.currentTime = newTime * videoRef.current.duration;
};

VideoUtils.handleToggleFullScreen = (props) => {
  const { isFullScreen, setIsFullScreen, containerRef } = props;
  if (isFullScreen) {
    document.exitFullscreen();
    setIsFullScreen(false);
  } else {
    containerRef.current.requestFullscreen();
    setIsFullScreen(true);
  }
};
