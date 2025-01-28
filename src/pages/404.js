import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <h1>සිදුවූ අපහසුතාවයට කණගාටු වෙමු. </h1>
    <p>
      මෙම වෙබ් පද්ධතිය තවම සකසමින් පවතින බැවින් සුළු මොහොතකින් නැවත උත්සහ කරන්න.
    </p>
    <p>
      ඔබ මෙම පද්ධතිය භාවිතයේදී සිදුවිය යුතු වෙනස් කමක් දකින්නේ නම් කරැනාකර අපව
      (WhatsApp- 0715316597/0767531659) දැනුවත් කරන්න.{" "}
    </p>
  </Layout>
)

export const Head = () => <Seo title="404: Not Found" />

export default NotFoundPage
