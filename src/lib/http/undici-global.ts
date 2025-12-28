import 'server-only';
import dns from 'node:dns';
import { Agent, ProxyAgent, setGlobalDispatcher } from 'undici';

dns.setDefaultResultOrder('ipv4first');

const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;

const dispatcher = proxy
  ? new ProxyAgent(proxy)
  : new Agent({
      connect: {
        family: 4, // IPv4
        timeout: 30_000, // connect timeout
      },
      headersTimeout: 30_000,
      bodyTimeout: 30_000,
    });

setGlobalDispatcher(dispatcher);
