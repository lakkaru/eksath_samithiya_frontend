import React from "react"
import Layout from "../components/layout"
import { Grid2, Typography } from "@mui/material"

export default function Index() {
  return (
    <Layout>
      <Grid2 container spacing={3}>
        <Typography variant="h4">
          විල්බාගෙදර එක්සත් අවමංගල්‍යාධාර සමිතියේ වෙබ් පිටුව වෙත ඔබව සාදරයෙන්
          පිළිගනිමු.
        </Typography>
        <Typography variant="h5">
          මෙම පද්ධතිය වෙත ඇතුළු වී, සාමාජික ඔබගේ තොරතුරු වල නිවැරදිතාවය
          පිරික්සන්න.
        </Typography>
      </Grid2>{" "}
    </Layout>
  )
}
