import * as kinesis from '@aws-sdk/client-kinesis';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { Agent } from 'https';
import { Exception } from './types';

const shardCount = 1;
const partitionKeys = [ ...Array(shardCount).keys() ]
const stream = 'telemetry-kinesis-stream';

let kinesisClient: kinesis.KinesisClient | undefined;

const getKinesisClient = () => {
  if (!kinesisClient) {
    kinesisClient = new kinesis.KinesisClient({
      region: process.env.AWS_REGION,
      maxAttempts: 5,
      requestHandler:  new NodeHttpHandler({
        connectionTimeout: 500,
        socketTimeout: 500,
        httpsAgent: new Agent({
          keepAlive: true, 
          keepAliveMsecs: 5000,
          maxSockets: Infinity,
        }),
      }),
    })
  }
  return kinesisClient
}

const sendsToKinesis = async (datas: Record<string, any>[]) => {
  const params = {
    Records: datas.map(data => {
      return {
        Data: Buffer.from(JSON.stringify(data)),
        PartitionKey: 'a' + partitionKeys[Math.floor(Math.random() * partitionKeys.length)],
      }
    }),
    StreamName: stream,
  }

  try {
    const resp = await getKinesisClient().send(new kinesis.PutRecordsCommand(params))
    if ((resp.FailedRecordCount ?? 0) > 0) {
      console.warn('[Extension] Failed records to kinesis, count : ' + resp.FailedRecordCount)
      console.warn(resp.Records?.filter(record => record.ErrorMessage).map(record => record.ErrorMessage)[0])
      console.warn(resp.Records?.filter(record => record.SequenceNumber).map(record => record.SequenceNumber)[0])
      
    }
  } catch(e: Exception) {
    console.warn(`[Extension] Error sending logs to kinesis : ${e?.message}`)
  }
}

export default { sendsToKinesis };