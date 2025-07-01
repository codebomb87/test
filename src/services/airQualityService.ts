import axios from 'axios';
import { AirQualityData } from '../types';

const AIRKOREA_API_URL = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc';
const AIRKOREA_KEY = process.env.REACT_APP_AIRKOREA_KEY;

export const fetchAirQualityData = async (sido: string): Promise<AirQualityData[]> => {
  try {
    const response = await axios.get(`${AIRKOREA_API_URL}/getCtprvnRltmMesureDnsty`, {
      params: {
        serviceKey: AIRKOREA_KEY,
        returnType: 'json',
        numOfRows: 100,
        pageNo: 1,
        sidoName: sido,
        ver: '1.0',
      },
    });

    if (response.data.response && response.data.response.body) {
      const items: AirQualityData[] = response.data.response.body.items;
      // 유효한 좌표 데이터가 없으면 Mock 데이터로 대체
      const validItems = items.filter(st => !isNaN(parseFloat(st.dmX)) && !isNaN(parseFloat(st.dmY)));
      if (validItems.length === 0) {
        console.warn('유효한 좌표가 없는 API 응답, Mock 데이터 사용');
        return [
          {
            stationName: '서울시청', sidoName: '서울', pm10Value: '45', pm25Value: '22',
            o3Value: '0.03', no2Value: '0.02', coValue: '0.4', so2Value: '0.005',
            dataTime: new Date().toISOString(), dmX: '126.9780', dmY: '37.5665'
          },
          {
            stationName: '부산대교', sidoName: '부산', pm10Value: '55', pm25Value: '30',
            o3Value: '0.04', no2Value: '0.03', coValue: '0.5', so2Value: '0.006',
            dataTime: new Date().toISOString(), dmX: '129.0756', dmY: '35.1796'
          },
          {
            stationName: '제주국제공항', sidoName: '제주', pm10Value: '25', pm25Value: '15',
            o3Value: '0.02', no2Value: '0.01', coValue: '0.3', so2Value: '0.004',
            dataTime: new Date().toISOString(), dmX: '126.4924', dmY: '33.5102'
          }
        ];
      }
      return items;
    }
    return [];
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    return [];
  }
};

export const fetchNearbyStations = async (latitude: number, longitude: number): Promise<AirQualityData[]> => {
  try {
    const response = await axios.get(`${AIRKOREA_API_URL}/getNearbyMsrstnList`, {
      params: {
        serviceKey: AIRKOREA_KEY,
        returnType: 'json',
        tmX: longitude,
        tmY: latitude,
        ver: '1.0',
      },
    });

    if (response.data.response && response.data.response.body) {
      return response.data.response.body.items;
    }
    return [];
  } catch (error) {
    console.error('Error fetching nearby stations:', error);
    return [];
  }
}; 