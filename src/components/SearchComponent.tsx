//to include search bar, sorting and filter dropdowns and add auction button. to use in auctions page






import {useState} from "react";
import {AuctionType} from "../types/AuctionType";
import {useNavigate} from "react-router-dom";
import {FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";

export default function SearchComponent() {
    const [auction, setAuction] = useState<AuctionType | undefined>(undefined)
    const [image, setImage] = useState<string | undefined>(undefined)
    const navigator = useNavigate()

    const [query, setQuery] = useState("")


    return (
        <div style={{backgroundColor: '#f2f2f2'}}>

        <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center">
            <Grid item xs={2}>
                <TextField id="standard-basic" label="Search" variant="standard" onChange={event => setQuery(event.target.value)}/>
            </Grid>
            <Grid item xs={3}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={1}
                        label="Sort">
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </Grid>

</div>







    )

}

