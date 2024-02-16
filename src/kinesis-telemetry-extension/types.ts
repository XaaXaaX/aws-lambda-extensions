export type telemetryLogModelRecord = {
  timestamp: string,
  level: string,
  requestId: string,
  message: Record<string, any>
};

export type telemetryLogModel = { 
  record: telemetryLogModelRecord,
  time: string,
  type: string
 };

export type Exception = any | unknown | Error;