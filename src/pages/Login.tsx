import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

import {AlertProps, Paper, Snackbar, Stack} from "@mui/material";
import {loggedIn, login} from "../service/APIService";
import MuiAlert from "@mui/material/Alert";


export default function Login({setImage}: any) {

    const [errors, setErrors] = useState<string | undefined>(undefined)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const [open, setOpen] = React.useState(false);


    useEffect(() => {
        const update = async () => {
            if (loggedIn()) {navigate('/profile'); return}


        }

        update()
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setOpen(true);

        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email: string = data.get('email') as string || ""
        const password: string = data.get('password') as string || ""

        const response = await login(email, password)


         if (response !== 200) {
            setErrors("Incorrect email/password")
            return;
        }

        navigate('/auctions')



    };


    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });



    return (


        <Container component="main" maxWidth="xs">
            <Paper style={{padding: 10, width: '100%', display: 'flex', justifyContent: 'center'}}>

            <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Login to Auction App
                    </Typography>
                    <Box component="form" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => await handleSubmit(e)} sx={{ mt: 1 }}>

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus


                        />
                        <FormControl fullWidth variant="outlined">
                            <OutlinedInput
                                required
                                id="password"
                                name="password"
                                label="Password"

                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            onMouseDown={(event) => event.preventDefault()}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>

                        <Stack direction="row" spacing={25}>

                            <Button variant='contained' onClick={() => navigate('/register')}>Register</Button>

                            <Button type="submit" variant="contained"> Sign In </Button>
                            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                                <Alert onClose={handleClose} severity="error"
                                       sx={{ width: '100%' }}>
                                    {errors}
                                </Alert>
                            </Snackbar>
                        </Stack>

                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

