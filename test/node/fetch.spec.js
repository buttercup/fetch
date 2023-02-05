import http from "http";
import jsonServer from "json-server";
import { expect } from "chai";
import joinURL from "url-join";
import { fetch, Headers, Response } from "../../dist/index.node.js";

const SERVER_URL = "http://localhost:3001"

const TEST_ROUTES = {
    "items": [
        { "id": 1, "name": "Test Item" }
    ]
};

describe("fetch", function() {
    beforeEach(async function() {
        this.server = jsonServer.create();
        const router = jsonServer.router(TEST_ROUTES);
        this.server.use(jsonServer.bodyParser);
        this.server.use(router);
        this.httpServer = http.createServer(this.server);
        await new Promise(resolve => {
            this.httpServer.listen(3001, resolve);
        });
    });

    afterEach(function() {
        this.httpServer.close();
    });

    it("can make simple requests", async function() {
        const res = await fetch(joinURL(SERVER_URL, "items/1"));
        expect(res.ok).to.equal(true);
        const result = await res.json();
        expect(result).to.have.property("id", 1);
    });

    it("fetches headers", async function() {
        const res = await fetch(joinURL(SERVER_URL, "items/1"));
        expect(res.headers.get("content-type")).to.match(/application\/json/);
        expect(res.headers).to.be.an.instanceOf(Headers);
    });

    it("returns a response", async function() {
        const res = await fetch(joinURL(SERVER_URL, "items/1"));
        expect(res).to.be.an.instanceOf(Response);
    });
});
