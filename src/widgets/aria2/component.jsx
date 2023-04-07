import { useTranslation } from 'next-i18next'

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;
  const { data: aria2Data, error: aria2Error } = useWidgetAPI(widget, "status");

  if (aria2Error) {
    return <Container error={aria2Error} />;
  }

  if (!aria2Data) {
    return (
      <Container service={service}>
        <Block label="aria2.speed" />
        <Block label="aria2.active" />
        <Block label="aria2.queue" />
      </Container>
    );
  }

  return (
    <Container service={service}>
      <Block label="aria2.speed" value={t("common.byterate", { value: parseInt(aria2Data.result.downloadSpeed, 10) })} />
      <Block label="aria2.active" value={t("common.number", { value: aria2Data.result.numActive })} />
      <Block label="aria2.queue" value={t("common.number", { value: aria2Data.result.numWaiting })} />
    </Container>
  );
}
