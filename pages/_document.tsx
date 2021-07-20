import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { MY_SEO } from '../config'
import { GA_TRACKING_ID } from '../src/utils/gtag'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head >
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}></script>
          <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                
                  gtag('config', '${GA_TRACKING_ID}', {page_path: window.location.pathname});
                  `,
              }}
            />
          <meta
            key="description"
            name="description"
            content={MY_SEO.description}
          />
          <meta
            key="og:type"
            name="og:type"
            content={MY_SEO.openGraph.type}
          />
          <meta
            key="og:title"
            name="og:title"
            content={MY_SEO.openGraph.title}
          />
          <meta
            key="og:description"
            name="og:description"
            content={MY_SEO.openGraph.description}
          />
          <meta
            key="og:url"
            name="og:url"
            content={MY_SEO.openGraph.url}
          />
          {/* <meta
            key="og:image"
            name="og:image"
            content={MY_SEO.openGraph.image}
          /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
  