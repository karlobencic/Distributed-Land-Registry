import bodyParser = require('body-parser');
import cors = require('cors');
import express = require('express');

const port = 8081;
const app = express();

app.use(cors({origin: true, credentials: true}));
app.options('*', cors());
app.use(bodyParser.json());

// Setting for Hyperledger Fabric
import { FileSystemWallet, Gateway } from 'fabric-network';
import * as path from 'path';

const ccpPath = path.resolve(__dirname, '..', '..', '..', 'first-network', 'connection-org1.json');

const initWallet = () => {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    return wallet;
};

const createGateway = async (wallet) => {
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: 'Karlo', discovery: { enabled: true, asLocalhost: true } });
    return gateway;
};

const getContract = async (gateway) => {
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    return network.getContract('land-registry');
};

app.get('/api/query-all', async (req, res) => {
    try {

        const wallet = initWallet();

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('Karlo');
        if (!userExists) {
            console.log('An identity for the user "Karlo" does not exist in the wallet');
            console.log('Run the registerUser.ts application before retrying');
            return;
        }

        const gateway = await createGateway(wallet);
        const contract = await getContract(gateway);

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('queryAllLands');

        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error});
    }
});

app.get('/api/query/:land_id', async (req, res) => {
    try {

        const wallet = initWallet();

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('Karlo');
        if (!userExists) {
            console.log('An identity for the user "Karlo" does not exist in the wallet');
            console.log('Run the registerUser.ts application before retrying');
            return;
        }

        const gateway = await createGateway(wallet);
        const contract = await getContract(gateway);

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('queryLand', req.params.land_id);

        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error});
    }
});

app.post('/api/add', async (req, res) => {
    try {

        const wallet = initWallet();

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('Karlo');
        if (!userExists) {
            console.log('An identity for the user "Karlo" does not exist in the wallet');
            console.log('Run the registerUser.ts application before retrying');
            return;
        }

        const gateway = await createGateway(wallet);
        const contract = await getContract(gateway);

        // Submit the specified transaction.
        await contract.submitTransaction('createLand', req.body.land_id, req.body.coordinates, 'Karlo');

        console.log('Transaction has been submitted');
        res.send('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).json({error});
    }
});

app.post('/api/change-owner/:land_id', async (req, res) => {
    try {

        const wallet = initWallet();

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('Karlo');
        if (!userExists) {
            console.log('An identity for the user "Karlo" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        const gateway = await createGateway(wallet);
        const contract = await getContract(gateway);

        // Submit the specified transaction.
        await contract.submitTransaction('changeLandOwner', req.params.land_id, 'Karlo', req.body.owner);

        console.log('Transaction has been submitted');
        res.send('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).json({error});
    }
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
