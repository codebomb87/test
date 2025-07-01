import React from 'react';
import styled from 'styled-components';

const LegendContainer = styled.div`
  position: fixed;
  right: 24px;
  bottom: 32px;
  background: rgba(255,255,255,0.95);
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 16px 20px;
  z-index: 10000;
  min-width: 160px;
  @media (max-width: 600px) {
    right: 8px;
    bottom: 12px;
    padding: 10px 12px;
    min-width: 120px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 15px;
  &:last-child { margin-bottom: 0; }
  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

const ColorCircle = styled.span<{ color: string }>`
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${({ color }) => color};
  border: 1.5px solid #888;
  margin-right: 10px;
  @media (max-width: 600px) {
    width: 14px;
    height: 14px;
    margin-right: 6px;
  }
`;

const levels = [
  { label: '좋음', range: '0~30', color: '#4A90E2' },
  { label: '보통', range: '31~80', color: '#50E3C2' },
  { label: '나쁨', range: '81~150', color: '#F5A623' },
  { label: '매우나쁨', range: '151~', color: '#D0021B' },
];

const Legend: React.FC = () => (
  <LegendContainer>
    <div style={{ fontWeight: 'bold', marginBottom: 10 }}>PM10 등급 범례</div>
    {levels.map(l => (
      <Row key={l.label}>
        <ColorCircle color={l.color} />
        <span>{l.label}</span>
        <span style={{ marginLeft: 8, color: '#888', fontSize: 13 }}>({l.range})</span>
      </Row>
    ))}
  </LegendContainer>
);

export default Legend; 