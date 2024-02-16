import kinesis from './kinesis';

const MAX_BATCH_RECORDS_ITEMS = 50;
const dispatch = async (pendingItems: string[], immediate = false): Promise<void> => {

    if (pendingItems.length !== 0 && (immediate || pendingItems.length >= MAX_BATCH_RECORDS_ITEMS)) {
        console.info('[Extension] Dispatch ', pendingItems.length);
        const items = JSON.parse(JSON.stringify(pendingItems));
        pendingItems.splice(0); 
        await kinesis.sendsToKinesis(items);
    }
}

export default { dispatch }
