import aria2ProxyHandler from "./proxy";

const widget = {
  api: "{url}/jsonrpc",
  proxyHandler: aria2ProxyHandler,

  mappings: {
    "status": {
      endpoint: "statusServer",
    }
  }
}

export default widget;
