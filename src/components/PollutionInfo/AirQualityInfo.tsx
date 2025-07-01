import React from 'react';
import styled from 'styled-components';
import { AirQualityData } from '../../types';

interface AirQualityInfoProps {
  data: AirQualityData;
}

const InfoContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  z-index: 1000;
`;

const Title = styled.h2`
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  color: #333;
`;

const InfoItem = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
`;

const Label = styled.span`
  color: #666;
`;

const Value = styled.span<{ value: number }>`
  font-weight: bold;
  color: ${({ value }) => {
    if (value <= 50) return '#00c853';
    if (value <= 100) return '#ffd600';
    if (value <= 150) return '#ff6d00';
    return '#d50000';
  }};
`;

const AirQualityInfo: React.FC<AirQualityInfoProps> = ({ data }) => {
  return (
    <InfoContainer>
      <Title>{data.stationName} 측정소</Title>
      <InfoItem>
        <Label>미세먼지(PM10)</Label>
        <Value value={Number(data.pm10Value)}>{data.pm10Value} ㎍/㎥</Value>
      </InfoItem>
      <InfoItem>
        <Label>초미세먼지(PM2.5)</Label>
        <Value value={Number(data.pm25Value)}>{data.pm25Value} ㎍/㎥</Value>
      </InfoItem>
      <InfoItem>
        <Label>오존(O3)</Label>
        <Value value={Number(data.o3Value) * 100}>{data.o3Value} ppm</Value>
      </InfoItem>
      <InfoItem>
        <Label>이산화질소(NO2)</Label>
        <Value value={Number(data.no2Value) * 100}>{data.no2Value} ppm</Value>
      </InfoItem>
      <InfoItem>
        <Label>일산화탄소(CO)</Label>
        <Value value={Number(data.coValue) * 10}>{data.coValue} ppm</Value>
      </InfoItem>
      <InfoItem>
        <Label>아황산가스(SO2)</Label>
        <Value value={Number(data.so2Value) * 100}>{data.so2Value} ppm</Value>
      </InfoItem>
      <InfoItem>
        <Label>측정시각</Label>
        <span>{data.dataTime}</span>
      </InfoItem>
    </InfoContainer>
  );
};

export default AirQualityInfo; 