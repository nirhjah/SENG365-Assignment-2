import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';

import {register, uploadProfilePhoto, login} from '../service/APIService';
import {Snackbar, Stack} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";


export default function Register() {
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [profilePhoto, setProfilePhoto] = useState(null)
    const [imageSrc, setImageSrc] = useState('')
    const navigate = useNavigate()




    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
       // event.preventDefault();

        const data = new FormData(event.currentTarget);
        const email: string = data.get('email') as string || ""
        const password: string = data.get('password') as string || ""
        const firstName: string = data.get('firstName') as string || ""
        const lastName: string = data.get('lastName') as string || ""

        const emailValid = validEmail(email)
        const passwordValid = validPass(password)
        const firstNameValid = validfName(firstName)
        const lastNameValid = validlName(lastName)
        const formValid = firstNameValid && lastNameValid && passwordValid && emailValid;

        if (!formValid) return;


        const registerResponse = await register(firstName, lastName, email, password)

        if (registerResponse === 500) {
            setError("Email is already taken please use another")
            return
        }

        const loginResponse = await login(email, password)

        if (loginResponse !== 200) {
            setError("something went wrong")
            return
        }

        if (profilePhoto !== null && profilePhoto !== undefined) {
            const uploadImageResponse = await uploadProfilePhoto(profilePhoto)
            if (uploadImageResponse !== 200 && uploadImageResponse !== 201) {
                setError("something went wrong")
            }
        }

        navigate('/auctions')
    };

    const validEmail = (email: any) => {
        if (email == '') {
            setError("Email is required")
        } else if (/.+@.+\.[A-Za-z]+$/.test(email)) {
            setError("")
            return true;
        } else {
            setError("Use a valid email")
        }

        return false;
    }

    const validPass = (password: any) => {
        if (password == '') {
            setError("Please enter a password")
        } else if (password.length >= 6) {
            setError("")
            return true;
        } else {
            setError("Password needs to be 6 characters or more")
            return false;
        }
    }

    const validfName = (fName: any) => {
        if (fName !== '') {
            setError("")
            return true;
        } else {
            setError("Please enter your first name")
            return false;
        }
    }

    const validlName = (lName: any) => {
        if (lName !== '') {
            setError("")
            return true;
        } else {
            setError("Please enter your last name")
            return false;
        }
    }

    const setProfile = async (e: any) => {
        const file = e.target.files[0]
        setProfilePhoto(file)
        console.log(file)
        if (file == undefined) {
            setImageSrc("")
            return
        }
        if (!['image/png', 'image/jpg', 'image/jpeg', 'image/gif'].includes(file.type)) {
            setImageSrc("")
            return
        }

        const src = URL.createObjectURL(file)
        setImageSrc(src)
    }

    return (
            <Container component="main" maxWidth="sm">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box component="form" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => await handleSubmit(e)} sx={{ mt: 3 }}>

                        <Grid container spacing={2}>
                            <Grid sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} item xs={12}>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    badgeContent={
                                        <>
                                            <label htmlFor='file-input'>
                                                <AddAPhotoIcon color='primary' />
                                            </label>
                                            <input hidden type="file" accept=".jpg,.jpeg,.png,.gif" id='file-input' onChange={async (e) => await setProfile(e)}/>
                                        </>
                                    }>
                                    <Avatar sx={{height: 50, width: 50}} alt="User" src={imageSrc} />
                                </Badge>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography color='red' variant="body1">
                                    {error}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    onChange={(e) => validfName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"

                                    onChange={(e) => validlName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    type="email"
                                    onChange={(e) => validEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <OutlinedInput
                                        required
                                        id="password"
                                        name="password"
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={(e) => {validPass(e.target.value)}}
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
                            </Grid>
                        </Grid>


                        <Stack direction="row" spacing={44}>

                            <Button variant='contained' onClick={() => navigate('/login')}>Sign In</Button>

                            <Button type="submit" variant="contained"> Register </Button>

                        </Stack>

                    </Box>
                </Box>
            </Container>
    );
}


