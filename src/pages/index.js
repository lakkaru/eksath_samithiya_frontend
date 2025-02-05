import React from "react"
import Layout from "../components/layout"
import { Grid2, Link, Typography } from "@mui/material"

export default function Index() {
  return (
    <Layout>
      <Grid2 container spacing={3}>
        <Typography sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}>
          විල්බාගෙදර එක්සත් අවමංගල්‍යාධාර සමිතියේ වෙබ් පද්ධතිය වෙත ඔබව සාදරයෙන්
          පිළිගනිමු.
        </Typography>
        <Typography sx={{ fontSize: { xs: ".8rem", sm: "1rem" } }}>
          මෙම පද්ධතිය වෙත
          <Link
            href="/login/user-login"
            underline="hover"
            sx={{ cursor: "pointer", color: "primary.main" }}
          >
            {" "}
            ඇතුළු වී,
          </Link>{" "}
          සාමාජික ඔබගේ තොරතුරු වල නිවැරදිතාවය පිරික්සන්න.
        </Typography>
        <Typography sx={{ fontSize: { xs: ".8rem", sm: "1rem" } }}>
          ඔබ මෙම පද්ධතිය භාවිතයේදී සිදුවිය යුතු වෙනස් කමක් දකින්නේ නම් කරුණාකර
          අපව{" "}
          <Link
            href="https://wa.me/94715316597"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            color="primary"
          >
            (WhatsApp- 0715316597)
          </Link>{" "}
          දැනුවත් කරන්න.{" "}
        </Typography>
      </Grid2>{" "}
    </Layout>
  )
}
