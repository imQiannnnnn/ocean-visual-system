export interface DatasetVariableOption {
  label: string;
  value: "temperature" | "salinity";
}

export const datasetPanelMock = {
  dateRange: {
    start: "1900-01",
    end: "2024-12",
  },
  title: "EN4温盐格点数据(C14)",
  variables: [
    { label: "temper...", value: "temperature" },
    { label: "salinity", value: "salinity" },
  ] satisfies DatasetVariableOption[],
  scaleTicks: ["-1.00", "-0.67", "-0.33", "0.00", "0.33", "0.67", "1.00"],
};
