import express from 'express';
import cors from "cors";
import helmet from "helmet";
import * as fs from "fs";
import {App} from "octokit";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Get private key (temporary from file)
const privateKeyPath = '/Users/frank/projects/codeint/githubapp/ruby/meinegithubapp1.2021-09-14.private-key.pem' // TODO: Put into environment
const privateKey = fs.readFileSync(privateKeyPath, 'utf-8')

app.get('/', (req: express.Request, res: express.Response) => {
    handleWebHook(req, res)
})

app.post('/', (req: express.Request, res: express.Response) => {
    handleWebHook(req, res)
})

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})

export interface WebHookRequest {
    action: string;
    starred_at: string
    installation: Installation;
}

export interface Installation {
    id: number;
    node_id: string;
}

async function handleWebHook(req: express.Request, res: express.Response) {
    console.log('Request received')
    res.status(200).send('OK!')

    // After the 'res.send' above the request is already finished. The caller (browser, github) can
    // terminate the network connection! We can do "async" processing after this line.

    console.log('Response send ')
    // console.log(JSON.stringify(req.body))

    // Get installation id from WebHook-Request
    const webHookRequest = req.body as WebHookRequest
    const installationId = webHookRequest?.installation?.id
    console.log(`Installation-Id ${installationId}`)


    if (webHookRequest.action != "created" || webHookRequest.starred_at == undefined) {
        console.log(webHookRequest.action + " / " + webHookRequest.starred_at)
        return
    }

    const appId = 138103 // TODO: Put into environment

    const app = new App({appId, privateKey});
    const {data: slug} = await app.octokit.rest.apps.getAuthenticated();
    const octokit = await app.getInstallationOctokit(installationId);
    await octokit.rest.issues.create({
        owner: "frank-engelen",
        repo: "propertypath",
        title: "New Version Issue " + Date.now(),
    });

    console.log("done!")
}




