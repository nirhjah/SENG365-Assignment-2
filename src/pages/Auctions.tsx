import {AuctionType} from "../types/AuctionType";
import React, {useState} from "react";
import AuctionComponent from "../components/AuctionComponent";
import {
    Button,
    FormControl, Grid, InputLabel, MenuItem, Pagination, Paper, Select, SelectChangeEvent, Stack, TextField, Typography,
} from "@mui/material";
import {CategoryType} from "../types/CategoryType";

import {fetchAuctions, fetchCategories} from "../service/APIService";
import {daysTillClosing} from "./AuctionItem";

const Auctions = () => {

    const [auctions, setAuctions] = useState<AuctionType[] | []>([])
    const [categories, setCategories] = useState<CategoryType[] | []>([])
    const [categoryString, setCategoryString] = useState<string>("")

    const [query, setQuery] = useState("")
    const [pages, setPages] = useState(3)
    const [page, setPage] = useState(1)
    const [value, setValue] = useState("")
    const [categoryValue, setCategoryValue] = useState("")


    const getCategory = (categoryId: number) => {
        return categories.filter((category: CategoryType) => category.categoryId === categoryId)[0]
    }

    const getAuctions = async () => {

        setQuery('')
        setValue('')
        setCategoryValue('')

        const response = await fetchAuctions()

        setAuctions(response.data.auctions)

        setPages(Math.ceil(response.data.count / 10))


        const categoryResponse = await fetchCategories()
        setCategories(categoryResponse)

    }


    const closedAuctions = () => {

        const newItem = auctions.filter((newVal) => {
            return (daysTillClosing(newVal.endDate) == "Closed");
            // comparing category for displaying data
        });

        setAuctions(newItem);
    };

    const openAuctions = () => {

        const newItem = auctions.filter((newVal) => {
            return (daysTillClosing(newVal.endDate) !== "Closed");
            // comparing category for displaying data
        });

        setAuctions(newItem);
    };


    const sortAuctions = async (option: string) => {

        const titleAscending = [...auctions].sort((a, b) =>
            a.title > b.title ? 1 : -1,

        );

        const currBidAscending = [...auctions].sort((a, b) =>
            a.highestBid > b.highestBid ? 1 : -1,
        );

        const reserveAscending = [...auctions].sort((a, b) =>
            a.reserve > b.reserve ? 1 : -1,
        );


        const dateAscending = [...auctions].sort((a,b) =>
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime()

        );

        setValue(option)

        if (option === "ALPHABETICAL_ASC") { setAuctions(titleAscending)}
        else if (option === "ALPHABETICAL_DESC") { setAuctions(titleAscending.reverse())}
        else if (option === "BIDS_ASC") { setAuctions(currBidAscending)}
        else if (option === "BIDS_DESC") { setAuctions(currBidAscending.reverse())}
        else if (option === "RESERVE_ASC") { setAuctions(reserveAscending)}
        else if (option === "RESERVE_DESC") { setAuctions(reserveAscending.reverse())}
        else if (option === "CLOSING_SOON") { setAuctions(dateAscending)}
        else if (option === "CLOSING_LATE") { setAuctions(dateAscending.reverse())}

    };




    const filterItem =  (category: CategoryType) => {

        const newItem = auctions.filter((newVal) => {

            return newVal.categoryId === category.categoryId;
        });



        setAuctions(newItem);
    };


    const handleCategoryChange = (event: SelectChangeEvent) => {
        const value = event.target.value as string
        setCategoryString(value)
    };

/*
    const filterItem = (category: CategoryType) => {
        setCategoryValue(category.name)

        const newItem = auctions.filter((newVal) => {

            return newVal.categoryId === category.categoryId;
        });




        setAuctions(newItem);
    };


*/




    React.useEffect(() => {
        getAuctions()
    }, [])

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
       // update(value)
        setPage(value)
    };




    return (
        <>
                <Paper style={{padding: 5}}>


                <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={10}
                >
                    <Grid item xs={2}>
                        <TextField id="standard-basic" value={query} label="Search" variant="standard" onChange={event => setQuery(event.target.value)}/>
                    </Grid>



                    <Grid item xs={3}>

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Categories</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Sort"
                                value={categoryString}
                                onChange={handleCategoryChange}
                            >
                                <MenuItem  onClick={async () => await getAuctions()}>All</MenuItem>
                                   {categories.length > 0? categories.map((category: CategoryType) => (
                                       <MenuItem
                                           key={category.categoryId} onClick={ () => filterItem(category)}>{category.name}</MenuItem>
                    )) : <MenuItem>None</MenuItem>}

                            </Select>
                        </FormControl>






                    </Grid>



                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={value}
                                label="Sort">
                                <MenuItem value="CLOSING_SOON" onClick={async () => await sortAuctions("CLOSING_SOON")}>Closing soon</MenuItem>
                                <MenuItem value="ALPHABETICAL_ASC" onClick={async () => await sortAuctions("ALPHABETICAL_ASC")}>Title asc</MenuItem>
                                <MenuItem value="ALPHABETICAL_DESC" onClick={async () => await sortAuctions("ALPHABETICAL_DESC")}>Title desc</MenuItem>
                                <MenuItem value="BIDS_ASC" onClick={async () => await sortAuctions("BIDS_ASC")}>Bid asc</MenuItem>
                                <MenuItem value="BIDS_DESC" onClick={async () => await sortAuctions("BIDS_DESC")}>Bid desc</MenuItem>
                                <MenuItem value="RESERVE_ASC" onClick={async () => await sortAuctions("RESERVE_ASC")}>Reserve asc</MenuItem>
                                <MenuItem value="RESERVE_DESC" onClick={async () => await sortAuctions("RESERVE_DESC")}>Reserve desc</MenuItem>
                                <MenuItem value="CLOSING_LATE" onClick={async () => await sortAuctions("CLOSING_LATE")}>Closing late</MenuItem>





                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item spacing={3}>
                    <Button variant="contained" onClick={() => openAuctions()}>OPEN</Button>
                    <Button variant="contained" onClick={() => closedAuctions()}>CLOSED</Button>
                    <Button variant="contained" onClick={async () => await getAuctions() }>Reset Filters</Button>
                    </Grid>


                </Grid>
                </Paper>


            <div style={{display: 'flex', justifyContent: 'center', padding: 10}}>

                <Grid alignContent='center' alignItems='center' container
                      sx={{width: {xs: '100%', sm: '98%', md: '95%', lg: '95%'}, maxWidth: '1500px'}}>


                    <Grid item xs={12} container spacing={3} display='flex' justifyContent='start'>
                        {auctions.length > 0 ? (

                                auctions.filter(post => {
                                    if (query === '') {
                                        return post;
                                    } else if (post.title.toLowerCase().includes(query.toLowerCase())) {
                                        return post;
                                    }
                                }).map((auction) => {
                                return (
                                    <Grid key={auction.auctionId} item xs={12} md={6} lg={4} xl={3} display='flex'
                                          justifyContent='center'>
                                        {categories.length > 0 ? <AuctionComponent auctionId={auction.auctionId}
                                                                                   category={getCategory(auction.categoryId)}/> : <></>}
                                    </Grid>
                                );
                            })
                        ) : ""}
                    </Grid>

                    {auctions.length > 0? (
                        <Grid item xs={12} py={2} style={{display: 'flex', justifyContent: 'center'}}>
                            <Pagination size='large' count={pages} page={page} onChange={handleChange} />




                        </Grid>
                    ) : <></>}



                </Grid>
            </div>
        </>
    )
}
export default Auctions;




