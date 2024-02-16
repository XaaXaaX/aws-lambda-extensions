import kinesis from './kinesis';

const MAX_BATCH_RECORDS_ITEMS = 5;
const dispatch = async (pendingItems: Record<string, any>[], immediate = false): Promise<void> => {

    console.debug('[Extension] Dispatching ', pendingItems.length);
    if (pendingItems.length !== 0 && (immediate || pendingItems.length >= MAX_BATCH_RECORDS_ITEMS)) {
        console.info('[Extension] Dispatch ', pendingItems.length);
        const items: Record<string, any>[] = JSON.parse(JSON.stringify(pendingItems));
        pendingItems.splice(0); 
        await kinesis.sendsToKinesis(items);
    }
}

export default { dispatch }
