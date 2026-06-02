export interface GeoLabelItem {
  name: string;
  lon: number;
  lat: number;
  height?: number;
}

export interface OceanCurrentItem {
  lon: number;
  lat: number;
  u: number;
  v: number;
}

export const mockGeoLabels: GeoLabelItem[] = [
  { name: "东海", lon: 126.5, lat: 28.5 },
  { name: "南海", lon: 114.5, lat: 14.5 },
  { name: "太平洋", lon: 145.0, lat: 20.0 },
  { name: "台湾海峡", lon: 120.0, lat: 24.0 },
  { name: "菲律宾海", lon: 134.0, lat: 17.0 },
  { name: "中国", lon: 112.0, lat: 32.0 },
  { name: "台湾", lon: 121.0, lat: 23.8 },
  { name: "日本", lon: 138.0, lat: 36.0 },
  { name: "菲律宾", lon: 122.0, lat: 12.5 },
  { name: "越南", lon: 108.0, lat: 16.0 },
];

export const mockOceanCurrentData: OceanCurrentItem[] = [
  { lon: 112, lat: 20, u: 3, v: 1 },
  { lon: 116, lat: 21, u: 2, v: -1 },
  { lon: 120, lat: 22, u: 3, v: 2 },
  { lon: 124, lat: 23, u: -2, v: 1 },
  { lon: 128, lat: 25, u: -1, v: 2 },
];
