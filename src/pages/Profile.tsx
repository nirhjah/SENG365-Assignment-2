import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {UserType} from "../types/UserType";
import {getLoggedIn, getProfilePhoto, loggedIn, logout} from "../service/APIService";

const imageSize = '120px'

export const Profile =  () => {
    const navigate = useNavigate()
    const [user, setUser] = useState<UserType | undefined>(undefined)


    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    useEffect(() => {
        const update = async () => {
            if (!loggedIn()) {navigate('/login'); return}

            const response = await getLoggedIn()
            if (response == undefined || response.status !== 200) {navigate('/login'); return}
            setUser(response.data)
        }

        update()
    }, [])

    return (
        <Grid container style={{padding: '16px', height: '100%'}} xs={12} display='flex' alignItems='center' justifyContent='center'>
            <Grid xs={10} sm={8} md={6} style={centerCSS} mt='10vh'>
                <Paper style={{width: '100%', maxWidth: '400px', padding: '16px'}}>
                    <Grid container xs={12} spacing={2}>
                        <Grid item xs={12} style={centerCSS}>
                            <Avatar style={{height: imageSize, width: imageSize}} src={getProfilePhoto()} />
                        </Grid>
                        <Grid item xs={12} style={centerCSS}>
                            <Typography variant="h6">
                                Name: {user?.firstName + " " + user?.lastName}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} style={centerCSS}>
                            <Typography variant="h6">
                                Email: {user?.email}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} style={centerCSS}>
                            <Button variant='contained' onClick={() => navigate('/edit-user')}>Edit</Button>
                            <Button variant='contained' onClick={async () => await handleLogout()}>Logout</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Profile;


const centerCSS = {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px'
}


