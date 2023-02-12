function ProgressBar(props) {
  const { currentTime, renderProgressAndHeader, handleSkip } = props;
  console.log(props);
  if (!renderProgressAndHeader) {
    return null;
  }
  return (
    <div onClick={(event) => handleSkip(event)} className="outterDiv">
      <div
        className="innerDiv"
        style={{
          width: `${currentTime * 100}%`
        }}
      ></div>
    </div>
  );
}
export default ProgressBar;
