import React from "react"
import Layout from "../components/layout"
import { Box, Paper, Link, Typography } from "@mui/material"
import HomeIcon from '@mui/icons-material/Home';

export default function Index() {
  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' }}>
        <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, maxWidth: 500, width: '95%', mx: 'auto', textAlign: 'center', bgcolor: 'white' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Box sx={{ bgcolor: '#1976d2', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <HomeIcon sx={{ color: 'white', fontSize: 36 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
              විල්බාගෙදර එක්සත් අවමංගල්‍යාධාර සමිතියේ වෙබ් පද්ධතිය වෙත ඔබව සාදරයෙන් පිළිගනිමු.
            </Typography>
          </Box>
          <Typography sx={{ fontSize: { xs: '.95rem', sm: '1.1rem' }, mb: 2, color: '#444' }}>
            මෙම පද්ධතිය වෙත
            <Link href="/login/user-login" underline="hover" sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 'bold' }}>
              ඇතුළු වී
            </Link>
            , සාමාජික ඔබගේ තොරතුරු වල නිවැරදිතාවය පිරික්සන්න.
          </Typography>
          <Typography sx={{ fontSize: { xs: '.9rem', sm: '1rem' }, mb: 2, color: '#444' }}>
            ඔබ මෙම පද්ධතිය භාවිතයේදී සිදුවිය යුතු වෙනස් කමක් දකින්නේ නම් කරුණාකර අපව
            <Link href="https://wa.me/94715316597" target="_blank" rel="noopener noreferrer" underline="hover" color="primary" sx={{ fontWeight: 'bold' }}>
              (WhatsApp- 0715316597)
            </Link>
            දැනුවත් කරන්න.
          </Typography>
          <Link href="https://docs.google.com/document/d/1W7AZcMk_7kmMhI2NpcIBDO3Dy-2W65rIqXK2i2y-4vk/edit?usp=sharing" target="_blank" rel="noopener noreferrer" underline="hover" sx={{ fontSize: { xs: '.9rem', sm: '1rem' }, color: 'secondary.main', fontWeight: 'bold' }}>
            සමිති ව්‍යවස්ථාව
          </Link>
        </Paper>
      </Box>
    </Layout>
  )
}
