interface Props {
  width?: number
  height?: number
}

const Spinner: React.FC<Props> = ({ width, height }) => {
  return (
    <div className="animate-pulse bg-white/30" 
    style={{
      width: width ?? 24,
      height: height ?? 6
    }}
    />
  );
}

export default Spinner;