import {
  createIntegration,
  createComponent,
  RuntimeEnvironment,
  RuntimeContext,
} from '@gitbook/runtime';

import { fetchHowdyGoOEmbedData, parseEmbedHtml } from './howdygo';


type HowdyGoRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {}
    >
>;

/**
* Component to render the block when embeding an HowdyGo URL.
*/
const embedBlock = createComponent<{
  url: string;
}>({
  componentId: 'embed',

  async action(element, action) {
      switch (action.action) {
          case '@link.unfurl': {
              const { url } = action;

              return {
                  props: {
                      url,
                  },
              };
          }
      }

      return element;
  },

  async render(element, context) {
      const { environment } = context;
      const { url } = element.props;

      if (!url) {
          return (
              <block>
                  <card
                      title={'HowdyGo'}
                      onPress={{
                          action: '@ui.url.open',
                          url,
                      }}
                      icon={
                          <image
                              source={{
                                  url: environment.integration.urls.icon,
                              }}
                              aspectRatio={1}
                          />
                      }
                  />
              </block>
          );
      }

      const embedData = await fetchHowdyGoOEmbedData(url);
      const { embedUrl } = parseEmbedHtml(embedData.html);

      const aspectRatio = embedData.width / embedData.height;

      return (
          <block> 
              <webframe
                  source={{
                      url: embedUrl,
                  }}
                  aspectRatio={aspectRatio}
              />
          </block>
      );
  },
});

export default createIntegration<HowdyGoRuntimeContext>({
  components: [embedBlock],
});