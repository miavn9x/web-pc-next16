"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/shared/lib/image";
import {
  Advertisement,
  AdvertisementPosition,
  getActiveAdvertisements,
} from "../services/ads.service";

const AdsDisplay = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted to enable client-only features
    setMounted(true);
    const fetchAds = async () => {
      const data = await getActiveAdvertisements();
      setAds(data);

      // Check if popup should be shown
      const popupData = localStorage.getItem("popupAdLastSeen");
      const now = Date.now();
      const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (!popupData) {
        // First time visiting, show popup
        setShowPopup(true);
      } else {
        const lastSeen = parseInt(popupData, 10);
        if (now - lastSeen > ONE_DAY) {
          // More than 24h since last shown, show again
          setShowPopup(true);
        }
      }
    };
    fetchAds();
  }, []);

  const leftAd = ads.find((ad) => ad.position === AdvertisementPosition.LEFT);
  const rightAd = ads.find((ad) => ad.position === AdvertisementPosition.RIGHT);
  const popupAd = ads.find((ad) => ad.position === AdvertisementPosition.POPUP);

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem("popupAdLastSeen", Date.now().toString());
  };

  if (ads.length === 0) return null;

  return (
    <>
      {/* Left Banner */}
      {leftAd && (
        <div
          className="fixed hidden 2xl:block"
          style={{
            left: `calc(${leftAd.offsetPercent || 45}% - 948px)`,
            top: `${leftAd.offsetTop || 40}%`,
            transform: "translateY(-50%)",
            zIndex: 40,
          }}
        >
          {leftAd.link ? (
            <Link href={leftAd.link} target="_blank">
              <div
                style={{ width: `${leftAd.width || 200}px`, maxHeight: "90vh" }}
              >
                <img
                  src={getImageUrl(leftAd.media.url)}
                  alt={leftAd.title}
                  className="w-full object-contain"
                  style={{ maxHeight: "90vh" }}
                />
              </div>
            </Link>
          ) : (
            <div
              style={{ width: `${leftAd.width || 200}px`, maxHeight: "90vh" }}
            >
              <img
                src={getImageUrl(leftAd.media.url)}
                alt={leftAd.title}
                className="w-full object-contain"
                style={{ maxHeight: "90vh" }}
              />
            </div>
          )}
        </div>
      )}

      {/* Right Banner */}
      {rightAd && (
        <div
          className="fixed hidden 2xl:block"
          style={{
            right: `calc(${rightAd.offsetPercent || 45}% - 948px)`,
            top: `${rightAd.offsetTop || 40}%`,
            transform: "translateY(-50%)",
            zIndex: 40,
          }}
        >
          {rightAd.link ? (
            <Link href={rightAd.link} target="_blank">
              <div
                className="relative"
                style={{
                  width: `${rightAd.width || 200}px`,
                  maxHeight: "90vh",
                }}
              >
                <Image
                  src={getImageUrl(rightAd.media.url)}
                  alt={rightAd.title}
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          ) : (
            <div
              className="relative"
              style={{
                width: `${rightAd.width || 200}px`,
                height: `${rightAd.height || 700}px`,
              }}
            >
              <Image
                src={getImageUrl(rightAd.media.url)}
                alt={rightAd.title}
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>
      )}

      {/* Popup Modal - Only render on client */}
      {mounted && popupAd && showPopup && (
        <div
          className="fixed inset-0 z-100 flex justify-center bg-black/50 p-4"
          style={{ paddingTop: `${(popupAd.offsetTop || 50) * 0.8}vh` }}
        >
          <div
            className="relative bg-transparent"
            style={{ width: `${popupAd.width || 500}px`, maxWidth: "90vw" }}
          >
            <button
              onClick={handleClosePopup}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white text-gray-800 rounded-full flex items-center justify-center font-bold shadow-lg hover:bg-gray-100 z-10"
            >
              ✕
            </button>
            {popupAd.link ? (
              <Link
                href={popupAd.link}
                target="_blank"
                onClick={handleClosePopup}
              >
                <div className="relative w-full aspect-4/5 sm:aspect-square">
                  <Image
                    src={getImageUrl(popupAd.media.url)}
                    alt={popupAd.title}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              </Link>
            ) : (
              <div className="relative w-full aspect-4/5 sm:aspect-square">
                <Image
                  src={getImageUrl(popupAd.media.url)}
                  alt={popupAd.title}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdsDisplay;
