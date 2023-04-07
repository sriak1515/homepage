import getServiceWidget from 'utils/config/service-helpers';
import { formatApiCall } from 'utils/proxy/api-helpers';
import widgets from 'widgets/widgets';
import createLogger from 'utils/logger';
import { httpProxy } from 'utils/proxy/http';

const proxyName = 'aria2ProxyHandler';
const logger = createLogger(proxyName);

async function fetchFromAria2API(url, token) {
  const options = {
    body: JSON.stringify({
      "jsonrpc": '2.0',
      "method": 'aria2.getGlobalStat',
      "params": [`token:${token}`],
      "id": 'qwe'
    }),
    method: 'POST',
    headers: {
      "content-type": "application/json",
      }
  };

  // eslint-disable-next-line no-unused-vars
  const [status, contentType, data, responseHeaders] = await httpProxy(url, options);
  let returnData;
  try {
    returnData = JSON.parse(Buffer.from(data).toString());
  } catch (e) {
    logger.error(`Error logging into aria2 API: ${JSON.stringify(data)}`);
    returnData = data;
  }
  return [status, returnData, responseHeaders];
}

export default async function aria2ProxyHandler(req, res) {
  const { group, service, endpoint } = req.query;

  try {
    if (group && service) {
      const widget = await getServiceWidget(group, service);

      if (widget) {
        const url = new URL(formatApiCall(widgets[widget.type].api, { endpoint, ...widget }));
        const [status, data] = await fetchFromAria2API(url, widget.token);

        if (data?.error || status !== 200) {
          try {
            return res.status(status).send({ error: { message: "HTTP error communicating with Aria2 API", data: Buffer.from(data).toString() } });
          } catch (e) {
            return res.status(status).send({ error: { message: "HTTP error communicating with Aria2 API", data } });
          }
        }

        return res.json(data);
      }
    }
  } catch (e) {
    logger.error(e);
    return res.status(500).send({ error: { message: `Error communicating with Aria2 API: ${e.toString()}` } });
  }

  return res.status(400).json({ error: 'Invalid proxy service type' });
}
