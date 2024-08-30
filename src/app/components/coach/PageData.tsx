"use client";

import { useState } from "react";

interface PageDataProps {
  title: string;
  description: string;
  button_text: string;
  button_link: string;
  video: string;
}

export default function PageData({
  title,
  description,
  button_text,
  button_link,
  video,
}: PageDataProps) {
  const [activeButton, setActiveButton] = useState<string | null>('learnMore');

  const extractVideoId = (videoUrl: string) => {
    let videoId = '';

    if (videoUrl.includes('youtube.com')) {
      const urlParams = new URLSearchParams(new URL(videoUrl).search);
      videoId = urlParams.get('v') || '';
    } else if (videoUrl.includes('youtube')) {
      videoId = videoUrl.split('/').pop() || '';
    } else if (videoUrl.includes('wistia.com')) {
      videoId = videoUrl.split('/').pop() || '';
    }
    return videoId;
  };

  const videoId = extractVideoId(video);
  let iframeSrc = '';

  if (video.includes('youtube.com') || video.includes('youtu.be')) {
    iframeSrc = `https://www.youtube.com/embed/${videoId}`;
  } else if (video.includes('wistia.com')) {
    iframeSrc = `https://fast.wistia.com/embed/iframe/${videoId}?seo=true&videoFoam=false`;
  }

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <div className="page_info">
      <div className="page_info_head">
        <h3>{title}</h3>
        <div>
          <button
            className={activeButton === "learnMore" ? "active" : ""}
            onClick={() => handleButtonClick("learnMore")}
          >
            Learn More
          </button>
          <button
            className={activeButton === "chat" ? "active" : ""}
            onClick={() => handleButtonClick("chat")}
          >
            Chat
          </button>
        </div>
      </div>


      {activeButton && activeButton === "learnMore"  && (
        <>    
          <div className="video">
            {iframeSrc && (
              <iframe
                src={iframeSrc}
                allowFullScreen
              ></iframe>
            )}
          </div>

          <div className="description" dangerouslySetInnerHTML={{ __html: description }}  ></div>

          {button_link && (
            <div className="link_button">
              <a href={button_link}>{button_text}</a>
            </div>
          )}
        </>
      )}

      {activeButton && activeButton === "chat"  && (
        <>    
          <div className="video">
            <textarea style={{width: '100%', height: "300px"}} name="" id="" ></textarea>
          </div>


         
            <div className="link_button cursor-pointer">
              <a >Send</a>
            </div>
         
        </>
      )}
  


    </div>
  );
}
