import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Button, Box, Grid, Paper, Avatar } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import PaymentIcon from '@mui/icons-material/Payment';

export default function LandingPage() {
  return (
    <Box component="main" sx={{ pb: 6 }}>
      <Container maxWidth="lg" sx={{ pt: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="h1" gutterBottom>
              SplitApp — share, track, settle
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Create groups, add expenses, and let SplitApp calculate who owes whom. Clean UI, JWT authentication, and simple integrations.
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button component={RouterLink} to="/register" variant="contained" size="large">
                Get Started
              </Button>
              <Button component={RouterLink} to="/login" variant="outlined" size="large">
                Sign In
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Quick Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Avatar sx={{ bgcolor: 'primary.main', mb: 1 }}>
                    <GroupIcon />
                  </Avatar>
                  <Typography variant="body2">Create & manage groups</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Avatar sx={{ bgcolor: 'success.main', mb: 1 }}>
                    <PaymentIcon />
                  </Avatar>
                  <Typography variant="body2">Add & split expenses</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Avatar sx={{ bgcolor: 'warning.main', mb: 1 }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Typography variant="body2">Visualize spending</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">Equal & custom splits</Typography>
              <Typography variant="body2" color="text.secondary">Split expenses equally or customize each member's share.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">JWT authentication</Typography>
              <Typography variant="body2" color="text.secondary">Secure routes using JSON Web Tokens and middleware validation.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">Responsive dashboard</Typography>
              <Typography variant="body2" color="text.secondary">Charts and summaries built with Chart.js and Material UI.</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
