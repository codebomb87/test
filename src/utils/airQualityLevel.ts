// PM10 농도값에 따라 등급/색상 반환

export function getPM10LevelAndColor(pm10Value: string): { level: string; color: string } {
  const value = parseInt(pm10Value, 10);
  if (isNaN(value)) return { level: '정보없음', color: '#BDBDBD' };
  if (value <= 30) return { level: '좋음', color: '#4A90E2' };
  if (value <= 80) return { level: '보통', color: '#50E3C2' };
  if (value <= 150) return { level: '나쁨', color: '#F5A623' };
  return { level: '매우나쁨', color: '#D0021B' };
} 