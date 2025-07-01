export interface AirQualityData {
  stationName: string;
  sidoName: string;
  pm10Value: string;
  pm25Value: string;
  o3Value: string;
  no2Value: string;
  coValue: string;
  so2Value: string;
  dataTime: string;
  dmX: string;
  dmY: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MapMarker {
  position: Coordinates;
  stationName: string;
  airQuality: AirQualityData;
}

export interface AirQualityLevel {
  level: string;
  color: string;
  description: string;
} 