"use client";
import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as AR from "js-aruco";

// 定義要使用的aruco編碼和對應的圖像
const arucoCodes = [
  {
    id: 1,
    image:
      "https://www.thecompliancecenter.com/wp-content/uploads/cm/d/c/dc1_hi.gif",
  },
  {
    id: 2,
    image:
      "https://www.thecompliancecenter.com/wp-content/uploads/cm/d/c/dc1_hi.gif",
  },
  {
    id: 3,
    image:
      "https://www.thecompliancecenter.com/wp-content/uploads/cm/d/c/dc1_hi.gif",
  },
];

const ArucoDetector = () => {
  const webcamRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [arucoId, setArucoId] = useState(null);

  useEffect(() => {
    var AR = require("js-aruco").AR;
    const arucoDetector = new AR.Detector();

    const intervalId = setInterval(() => {
      // 確保Webcam已經打開
      // 確保stream和Webcam都已經初始化
      if (!webcamRef.current) {
        console.log("return");
        return;
      }

      // 拍攝當前帧並進行Aruco檢測
      const imageData = webcamRef.current.getScreenshot();
      if (!imageData) {
        console.log("no image detected");
        return;
      }
      const markerSize = 20; // aruco標記的大小
      const markers = arucoDetector.detect(imageData, markerSize);

      // 檢查是否檢測到任何已知的aruco標記
      for (const marker of markers) {
        const aruco = arucoCodes.find((code) => code.id === marker.id);
        if (aruco) {
          setArucoId(aruco.id);
          console.log(" detected");
          return;
        }
      }

      // 如果未檢測到任何aruco標記，則將arucoId設置為null
      setArucoId(null);
    }, 100);

    // 清理interval
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Webcam ref={webcamRef} mirrored screenshotFormat="image/jpeg" />
      {arucoId !== null && (
        <img src={arucoCodes[arucoId - 1].image} alt={`Aruco ${arucoId}`} />
      )}
      {/* <img src="https://www.thecompliancecenter.com/wp-content/uploads/cm/d/c/dc1_hi.gif" /> */}
    </>
  );
};

export default ArucoDetector;
