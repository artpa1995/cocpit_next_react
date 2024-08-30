import React, { useState, ReactNode, MouseEvent } from 'react';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import SettingsIcon from '@mui/icons-material/Settings';

interface ResizableComponentProps {
  children: (props: { showPart: number }) => ReactNode;  // Изменяем тип для children
  initialWidth?: number;
  initialHeight?: number;
  settings?: boolean;
}

const ResizableComponent: React.FC<ResizableComponentProps> = ({
  children,
  initialWidth = 400,
  initialHeight = 300,
  settings = false,
}) => {
  const [width, setWidth] = useState<number>(initialWidth);
  const [height, setHeight] = useState<number>(initialHeight);
  const [openSettings, setOpenSettings] = useState(false);
  const [showPart, setShowPart] = useState<number>(3);

  const handleMouseDownWidth = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;

    const onMouseMove = (e: MouseEvent<Document>) => {
      const newWidth = startWidth + (e.clientX - startX);
      setWidth(newWidth > 300 ? newWidth : 300);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove as any);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove as any);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleMouseDownHeight = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = height;

    const onMouseMove = (e: MouseEvent<Document>) => {
      const newHeight = startHeight + (e.clientY - startY);
      setHeight(newHeight > 300 ? newHeight : 300);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove as any);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove as any);
    document.addEventListener('mouseup', onMouseUp);
  };

  const toggleSettings = () => {
    setOpenSettings((prevState) => !prevState);
  };

  return (
    <div
      className="page_content_block"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {settings && (
        <div className="settings">
          {openSettings && (
            <div className="settings_button_block">
              <button onClick={() => setShowPart(1)}>Show Left</button>
              <button onClick={() => setShowPart(2)}>Show Right</button>
              <button onClick={() => setShowPart(3)}>Show Both</button>
            </div>
          )}
          <button onClick={toggleSettings}>
            <SettingsIcon sx={{ color: '#B7B7B7', fontSize: '20px', background: 'white' }} />
          </button>
        </div>
      )}
      <div className="content">
        {typeof children === 'function' ? children({ showPart }) : children}  {/* Передаем showPart в дочерний элемент */}
      </div>
      <div className="resize" onMouseDown={handleMouseDownWidth}>
        <div>||</div>
      </div>
      <div className="resize_up_down" onMouseDown={handleMouseDownHeight}>
        <ExpandCircleDownOutlinedIcon sx={{ color: '#B7B7B7', fontSize: '30px', background: 'white' }} viewBox="0 0 24 8" />
      </div>
    </div>
  );
};

export default ResizableComponent;
