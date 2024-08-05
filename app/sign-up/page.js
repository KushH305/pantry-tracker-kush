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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
  } from '@mui/material';
  import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
  import StarIcon from '@mui/icons-material/Star';
  import CameraIcon from '@mui/icons-material/Camera';


// Auth
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth} from '@/firebase'
import { useState, useEffect } from 'react'


const defaultTheme = createTheme();

export default function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [openDialog, setOpenDialog] = useState(false)

    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth)

    const handleSignUp = async () => {
        try {
            const res = await createUserWithEmailAndPassword(email, password)
            console.log("Email: ", email)
            console.log(res)
            if(res && res.user){
                console.log("User created successfully", res.user)
                setEmail('')
                setPassword('')
                setOpenDialog(true)
            } else {
                console.log("Failed to create user")
            }
        } catch(e){
            console.error("Error creating user", e)
        }
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
    }
    
//     const handleSubmit = (event) => {
//     event.preventDefault();
//     const data = new FormData(event.currentTarget);
//     console.log({
//       email: data.get('email'),
//       password: data.get('password'),
//     });
//   };

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
                Welcome to Your Pantry Tracker!
              </Typography>
              <Typography variant="body1" paragraph>
                Effortlessly manage your pantry inventory, track expiration dates, and never run out of essentials again. Our intuitive app helps you stay organized and reduce food waste.
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Upcoming Features
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><StarIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="AI Recommendations" secondary="Get personalized suggestions based on your inventory and habits" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CameraIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Picture Recognition" secondary="Add items to your inventory by simply taking a photo" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={(e) => {e.preventDefault(); handleSignUp();}} sx={{ mt: 3, width: '100%' }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign Up
                  </Button>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Link href="/sign-in" variant="body2">
                        Already have an account? Sign in
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Account Created Successfully!"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Great job on creating your account! Please proceed to the sign-in page and log in with the account you just created.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} color="primary" autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    </ThemeProvider>
  );
}
