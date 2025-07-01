import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import KakaoMap from './components/Map/KakaoMap';
import AirQualityInfo from './components/PollutionInfo/AirQualityInfo';
import { fetchAirQualityData } from './services/airQualityService';
import { AirQualityData, MapMarker } from './types';
import { tmToLatLng } from './utils/tmToLatLng';
import Legend from './components/Common/Legend';
import { FiRefreshCw } from 'react-icons/fi';

const AppContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  @media (max-width: 600px) {
    width: 100vw;
    height: 100dvh;
    min-height: 100dvh;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-size: 1.2rem;
  color: #333;
  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 0 10px;
  }
`;

const ErrorMessage = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff5252;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  z-index: 9999;
  @media (max-width: 600px) {
    top: 10px;
    padding: 7px 10px;
    font-size: 0.95rem;
  }
`;

const RefreshButton = styled.button`
  position: fixed;
  top: 24px;
  right: 28px;
  z-index: 10001;
  background: #4A90E2;
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #357ABD; }
  &:disabled { background: #BDBDBD; cursor: not-allowed; }
  @media (max-width: 600px) {
    top: 10px;
    right: 10px;
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
  }
`;

const GlobalStyle = createGlobalStyle`
  @keyframes spin {
    100% { transform: rotate(360deg); }
  }
`;

function App() {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedStation, setSelectedStation] = useState<AirQualityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchAirQualityData('전국');
      console.log('API 데이터:', data);
      if (data.length === 0) {
        setError('데이터를 불러올 수 없습니다. API 키를 확인해주세요.');
        return;
      }
      const markersData = data
        .filter(station => {
          const x = parseFloat(station.dmX);
          const y = parseFloat(station.dmY);
          const valid = !isNaN(x) && !isNaN(y);
          if (!valid) console.log('유효하지 않은 좌표:', station);
          return valid;
        })
        .map(station => {
          const x = parseFloat(station.dmX);
          const y = parseFloat(station.dmY);
          const { latitude, longitude } = tmToLatLng(x, y);
          return {
            position: {
              latitude,
              longitude
            },
            stationName: station.stationName,
            airQuality: station
          };
        });
      console.log('생성된 마커:', markersData);
      setMarkers(markersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedStation(marker.airQuality);
  };

  return (
    <AppContainer>
      <RefreshButton onClick={fetchData} disabled={isLoading} title="새로고침">
        <FiRefreshCw style={{ animation: isLoading ? 'spin 1s linear infinite' : undefined }} />
      </RefreshButton>
      <KakaoMap markers={markers} onMarkerClick={handleMarkerClick} selectedStation={selectedStation ? markers.find(m => m.airQuality === selectedStation) ?? null : null} setSelectedStation={marker => setSelectedStation(marker ? marker.airQuality : null)} />
      {selectedStation && <AirQualityInfo data={selectedStation} />}
      {isLoading && <LoadingOverlay>데이터를 불러오는 중입니다...</LoadingOverlay>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Legend />
      <GlobalStyle />
    </AppContainer>
  );
}

export default App;
