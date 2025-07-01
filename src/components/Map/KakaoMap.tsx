import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { MapMarker } from '../../types';
import { getPM10LevelAndColor } from '../../utils/airQualityLevel';

interface KakaoMapProps {
  markers: MapMarker[];
  onMarkerClick: (marker: MapMarker) => void;
  selectedStation: MapMarker | null;
  setSelectedStation: (marker: MapMarker | null) => void;
}

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
`;

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap: React.FC<KakaoMapProps> = ({ markers, onMarkerClick, selectedStation, setSelectedStation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapRef = useRef<any>(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current || !window.kakao?.maps) return;

      const options = {
        center: new window.kakao.maps.LatLng(36.5, 127.5),
        level: 13
      };

      const map = new window.kakao.maps.Map(mapRef.current, options);
      kakaoMapRef.current = map;
    };

    if (window.kakao?.maps) {
      initializeMap();
    } else {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_KEY}&libraries=services,clusterer`;
      script.async = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!kakaoMapRef.current || !window.kakao?.maps) return;

    // 기존 마커/클러스터러 제거를 위한 참조
    let markerInstances: any[] = [];
    let clusterer: any = null;

    // 마커 생성
    markerInstances = markers.map(marker => {
      if (!marker.position.latitude || !marker.position.longitude) return null;
      const position = new window.kakao.maps.LatLng(
        marker.position.latitude,
        marker.position.longitude
      );
      const { color } = getPM10LevelAndColor(marker.airQuality.pm10Value);
      const markerImageSrc = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><circle cx='16' cy='16' r='12' fill='${encodeURIComponent(color)}' stroke='black' stroke-width='2'/></svg>`;
      const markerImage = new window.kakao.maps.MarkerImage(
        markerImageSrc,
        new window.kakao.maps.Size(32, 32),
        { offset: new window.kakao.maps.Point(16, 16) }
      );
      const markerInstance = new window.kakao.maps.Marker({
        position,
        image: markerImage
      });
      window.kakao.maps.event.addListener(markerInstance, 'click', () => {
        onMarkerClick(marker);
      });
      return markerInstance;
    }).filter(Boolean);

    // 클러스터러 생성 및 마커 추가
    clusterer = new window.kakao.maps.MarkerClusterer({
      map: kakaoMapRef.current,
      averageCenter: true,
      minLevel: 8,
      disableClickZoom: false
    });
    clusterer.addMarkers(markerInstances);

    // CustomOverlay로 상세 정보 표시
    let overlay: any = null;
    if (selectedStation) {
      const pos = new window.kakao.maps.LatLng(
        selectedStation.position.latitude,
        selectedStation.position.longitude
      );
      const overlayContent = document.createElement('div');
      overlayContent.style.background = 'white';
      overlayContent.style.border = '1px solid #888';
      overlayContent.style.borderRadius = '8px';
      overlayContent.style.padding = '12px 16px';
      overlayContent.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
      overlayContent.style.minWidth = '180px';
      overlayContent.innerHTML = `
        <div style="font-weight:bold; margin-bottom:4px;">${selectedStation.stationName}</div>
        <div>PM10: <b>${selectedStation.airQuality.pm10Value}</b></div>
        <div>PM2.5: <b>${selectedStation.airQuality.pm25Value}</b></div>
        <div style="font-size:12px; color:#888; margin-top:4px;">${selectedStation.airQuality.dataTime}</div>
        <button id="closeOverlayBtn" style="margin-top:8px; padding:2px 8px; border:none; background:#4A90E2; color:white; border-radius:4px; cursor:pointer;">닫기</button>
      `;
      overlay = new window.kakao.maps.CustomOverlay({
        position: pos,
        content: overlayContent,
        yAnchor: 1.2
      });
      overlay.setMap(kakaoMapRef.current);
      const closeBtn = overlayContent.querySelector('#closeOverlayBtn') as HTMLButtonElement | null;
      if (closeBtn) {
        closeBtn.onclick = () => {
          setSelectedStation(null);
          overlay.setMap(null);
        };
      }
      kakaoMapRef.current.setCenter(pos);
    }

    // 정리(cleanup): 마커, 클러스터러, 오버레이 제거
    return () => {
      if (clusterer) clusterer.setMap(null);
      markerInstances.forEach(m => m && m.setMap(null));
      if (overlay) overlay.setMap(null);
    };
  }, [markers, onMarkerClick, selectedStation, setSelectedStation]);

  return <MapContainer ref={mapRef} />;
};

export default KakaoMap; 