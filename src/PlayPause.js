import { BsFillPlayFill } from "react-icons/bs";
function PlayPause(props) {
  const { hoveredVideo, playPauseVideo } = props;
  return (
    <div
      role="button"
      onClick={playPauseVideo}
      className={hoveredVideo ? "playButton playButton-hover" : "playButton"}
    >
      <BsFillPlayFill size="3rem" />
    </div>
  );
}
export default PlayPause;
