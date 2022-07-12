import {useNavigate} from "react-router-dom";
import {Alert, Box, Button, Stack} from "@mui/material";
import {loggedIn} from "../service/APIService";

export default function ButtonsComponent() {


    const navigate = useNavigate();

/*    const handleAddAuctionButton = async () => {
        if (!loggedIn()) {
            navigate('/login');
            return}
        navigate('/create-auction');
    }*/

    return (

        <>

            <Stack direction="row" spacing={2} paddingBottom={2}>


            <Button variant="contained" onClick={() => navigate("/auctions")}>Auctions</Button>
            <Button variant="contained" onClick={() => navigate("/my-auctions")}>My Auctions</Button>
            <Button variant="contained" onClick={() => navigate("/profile")}>Profile</Button>

            </Stack>
        </>



)

}