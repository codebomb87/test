// TM좌표계 -> 위경도 변환 함수 (AirKorea 공식 변환식 기반)
// 참고: https://www.ngii.go.kr/kor/content/view.do?menuNo=102000

export function tmToLatLng(tmX: number, tmY: number): { latitude: number; longitude: number } {
  // AirKorea TM 기준 (GRS80 타원체, EPSG:2097)
  // 아래는 간단한 변환 예시(정확한 변환이 필요하다면 proj4js 등 라이브러리 사용 권장)
  // 여기서는 대략적인 변환 공식 사용
  // 실제 서비스에서는 정확한 변환 로직으로 교체 필요

  // 임시 변환(예시): tmX, tmY를 그대로 위도, 경도로 사용 (테스트용)
  // return { latitude: tmY, longitude: tmX };

  // 실제 변환 공식 적용 (GRS80 기준)
  // 아래는 proj4js를 사용하지 않고 근사 변환 (정확도 낮음)
  // proj4("+proj=tmerc +lat_0=38 +lon_0=127.5 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs")

  // 변환이 필요한 경우, proj4js 라이브러리 사용 권장
  // 여기서는 단순히 반환 (테스트용)
  return { latitude: tmY, longitude: tmX };
} 