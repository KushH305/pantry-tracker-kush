'use client'
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {
    AppBar,
    Toolbar,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
  } from '@mui/material';

  import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
  import StarIcon from '@mui/icons-material/Star';
  import CameraIcon from '@mui/icons-material/Camera';

// Auth Sign In
import { useState, useEffect } from 'react'
import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth} from '@/firebase'
import { useRouter } from 'next/navigation'


const defaultTheme = createTheme();

export default function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth)

    const handleSignIn = async () => {
        try {
            const res = await signInWithEmailAndPassword(email, password)
            console.log({res})
            if(res && res.user){
                setEmail('')
                setPassword('')
                router.push('/')
            } else {
                console.log("Failed to sign in")
            }

        } catch (e) {
            console.error(e)
        }
    }
    

    return (
        <ThemeProvider theme={defaultTheme}>
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#f5f5f5',
            }}
          >
            <AppBar position="static" color="transparent" elevation={0}>
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#333' }}>
                  Pantry Tracker
                </Typography>
              </Toolbar>
            </AppBar>
      
            <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h3" component="h1" gutterBottom>
                    Welcome Back!
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Sign in to access your personalized pantry inventory. Keep track of your items, manage expiration dates, and streamline your grocery shopping experience.
                  </Typography>
                  <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Did You Know?
                    </Typography>
                    <Typography variant="body2">
                      Users of Pantry Tracker report reducing their food waste by up to 30% and saving time on grocery shopping!
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                      <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                      Sign in
                    </Typography>
                    <Box component="form" onSubmit={(e) => {e.preventDefault(); handleSignIn();}} noValidate sx={{ mt: 1, width: '100%' }}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Sign In
                      </Button>
                      <Grid container>
                        <Grid item>
                          <Link href="/sign-up" variant="body2">
                            {"Don't have an account? Sign Up"}
                          </Link>
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </ThemeProvider>
      );
}
