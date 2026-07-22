type BottomBarProps = {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
};

function BottomBar({
  left,
  center,
  right,
}: BottomBarProps) {
  return (
    <div className="absolute bottom-6 left-1/2 z-30 w-[900px] max-w-[calc(100%-48px)] -translate-x-1/2">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-3xl">
        <div className="flex justify-end">
          {left}
        </div>

        <div className="flex justify-center">
          {center}
        </div>

        <div className="flex justify-start">
          {right}
        </div>
      </div>
    </div>
  );
}

export default BottomBar;