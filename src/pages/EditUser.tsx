import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {AlertProps, Paper, Snackbar, Stack} from '@mui/material';
import {
    deleteProfilePhoto, editUser,
    getLoggedIn,
    getProfilePhoto,
    uploadProfilePhoto
} from "../service/APIService";
import MuiAlert from '@mui/material/Alert';


export default function EditUser() {
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [profilePhoto, setProfilePhoto] = useState(null)
    const [imageSrc, setImageSrc] = useState('')
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const navigate = useNavigate()
    const [open, setOpen] = React.useState(false);

    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });




    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {





        const data = new FormData(event.currentTarget);
        const email: string = data.get('email') as string || ""
        const password: string = data.get('password') as string || ""
        const currentPassword: string = data.get('oldPassword') as string || ""
        const firstName: string = data.get('firstName') as string || ""
        const lastName: string = data.get('lastName') as string || ""

        const emailValid = validateEmail(email)
        const fNameValid = validateFirstName(firstName)
        const lNameValid = validateLastName(lastName)
        let passwordValid = true
        if (password.length > 0 && currentPassword.length < 1) {
            setError("Password required")
            passwordValid = validatePassword(password)
            return
        } else {
            setError("")
        }

        const formValid = fNameValid && lNameValid && passwordValid && emailValid;

        if (!formValid) return;

        setOpen(true);


        let updateResponse;
        if (password.length > 0 && currentPassword.length > 0) {
            updateResponse = await editUser(firstName, lastName, email, password, currentPassword)
        } else {
            console.log("Correct")
            updateResponse = await editUser(firstName, lastName, email)
        }

        if (updateResponse === 400) {
            setError("Incorrect password")
            return
        }
        if (updateResponse === 500) {
            setError("Email already taken")
            return
        }
        if (updateResponse !== 200) {
            setError("Something went wrong")
            return
        }


        if (profilePhoto !== null && profilePhoto !== undefined) {
            const uploadImageResponse = await uploadProfilePhoto(profilePhoto)
            if (uploadImageResponse !== 200 && uploadImageResponse !== 201) {
                setError("Something went wrong")
            }
        } else {
            const uploadImageResponse = await deleteProfilePhoto()
            if (uploadImageResponse !== 200 && uploadImageResponse !== 201) {
                setError("Something went wrong")
            }

        }


        navigate('/profile')



    };

    // Validate functions
    const validateEmail = (email: any) => {
        setEmail(email)
        if (email == '') {
            setError("Email required")
        } else if (/.+@.+\.[A-Za-z]+$/.test(email)) {
            setError("")
            return true;
        } else {
            setError("Email not foramtted correct")
        }

        return false;
    }

    const validatePassword = (password: any) => {
        if (password.length === 0 || password.length >= 6) {
            setError("")
            return true;
        } else {
            setError("Password needs to be at least 6 characters or longer")
            return false;
        }
    }

    const validateFirstName = (fName: any) => {
        setFirstName(fName)

        if (fName !== '') {
            setError("")
            return true;
        } else {
            setError("First name required")
            return false;
        }
    }

    const validateLastName = (lName: any) => {
        setLastName(lName)

        if (lName !== '') {
            setError("")
            setLastName(lName)
            return true;
        } else {
            setError("Last name required")
            return false;
        }
    }

    const changeProfile = async (e: any) => {
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

    React.useEffect(() => {
        const update = async () => {
            const response = await getLoggedIn()
            if (response == undefined || response.status !== 200){navigate('/login'); return}

            setFirstName(response.data.firstName)
            setLastName(response.data.lastName)
            setEmail(response.data.email)

            if (imageSrc == "") setImageSrc(getProfilePhoto())
        }

        update()
    }, [])

    const removeProfileImage = () => {
        setImageSrc("none")
        setProfilePhoto(null)
    }

    return (


        <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Paper style={{width: '100%', maxWidth: '400px', padding: '16px'}}>

                    <Box component="form" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => await handleSubmit(e)} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} item xs={12}>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    badgeContent={
                                        <DeleteForeverIcon onClick={removeProfileImage} color='primary' />
                                    }>
                                    <label htmlFor='file-input'>
                                        <Avatar sx={{height: 100, width: 100}} src={imageSrc} />
                                    </label>
                                    <input hidden type="file" accept=".jpg,.jpeg,.png,.gif" id='file-input' onChange={async (e) => await changeProfile(e)}/>
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
                                    value={firstName}
                                    onChange={(e) => validateFirstName(e.target.value)}
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
                                    value={lastName}
                                    onChange={(e) => validateLastName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => validateEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>New password</Typography>
                                <FormControl fullWidth variant="outlined">
                                    <OutlinedInput
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={(e) => {validatePassword(e.target.value)}}
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
                                        label="Password"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>Current password</Typography>

                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="password">Current Password</InputLabel>
                                    <OutlinedInput
                                        id="oldPassword"
                                        name="oldPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={() => {setError("")}}
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
                                        label="Current Password"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item container xs={12} mt={2} columnSpacing={1} style={{display: 'flex', justifyContent: 'center'}}>
                                <Stack direction="row" spacing={2}>
                                    <Button type="submit" variant="contained">Save</Button>
                                    <Button variant="contained" onClick={() => navigate('/profile')}>Cancel</Button>

                                </Stack>

                            </Grid>
                        </Grid>
                    </Box>

                        <Snackbar open={open} autoHideDuration={30000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                                Profile Edited!
                            </Alert>
                        </Snackbar>

                    </Paper>
                </Box>
        </Container>
    );
}

