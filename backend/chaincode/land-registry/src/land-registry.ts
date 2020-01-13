import { Context, Contract } from 'fabric-contract-api';
import { Coordinates } from './coords';
import { Land } from './land';
import { lands } from './mock';

export class LandRegistry extends Contract {

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');

        for (const key of Object.keys(lands)) {
            const value = lands[key];

            await ctx.stub.putState(key, Buffer.from(JSON.stringify(value)));
            console.info('Added <--> ', value);
        }

        console.info('============= END : Initialize Ledger ===========');
    }

    public async queryLand(ctx: Context, landNumber: string): Promise<string> {
        const landAsBytes = await ctx.stub.getState(landNumber); // get the land from chaincode state
        if (!landAsBytes || landAsBytes.length === 0) {
            throw new Error(`${landNumber} does not exist`);
        }
        console.log(landAsBytes.toString());
        return landAsBytes.toString();
    }

    public async createLand(ctx: Context, landNumber: string, coordinates: string, owner: string) {
        console.info('============= START : Create Land ===========');

        const coords: Coordinates[] = JSON.parse(coordinates);
        const car: Land = {
            coordinates: coords,
            owner,
        };

        await ctx.stub.putState(landNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Land ===========');
    }

    public async queryAllLands(ctx: Context): Promise<string> {
        const startKey = '0';
        const endKey = '9999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    public async changeLandOwner(ctx: Context, landNumber: string, newOwner: string) {
        console.info('============= START : changeLandOwner ===========');

        const landAsBytes = await ctx.stub.getState(landNumber); // get the land from chaincode state
        if (!landAsBytes || landAsBytes.length === 0) {
            throw new Error(`${landNumber} does not exist`);
        }
        const land: Land = JSON.parse(landAsBytes.toString());
        land.owner = newOwner;

        await ctx.stub.putState(landNumber, Buffer.from(JSON.stringify(land)));
        console.info('============= END : changeLandOwner ===========');
    }

}
