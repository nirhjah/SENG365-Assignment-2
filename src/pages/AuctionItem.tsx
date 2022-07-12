import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

import {AuctionType} from "../types/AuctionType";

import {
    Alert,
    AlertProps,
    Button,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    Paper,
    Snackbar,
    TextField
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';

import {CategoryType} from "../types/CategoryType";
import {
    deleteAuction,
    fetchAuction, fetchAuctions,
    fetchBids,
    fetchCategories, fetchImage,
    getProfilePhotoFor,
    getUserId,
    loggedIn,
    postBid
} from "../service/APIService";
import {BidType} from "../types/BidType";
import AuctionComponent from "../components/AuctionComponent";
import Backdrop from "@mui/material/Backdrop";
import {EditAuction} from "./EditAuction";

const AuctionItem = () => {
    let { auctionId } = useParams();
    const [auction, setAuction] = useState<AuctionType | undefined>(undefined)
    const [image, setImage] = useState<string | undefined>(undefined)
    const [userId, setUserId] = useState<number | undefined>(undefined)
    const [amount, setAmount] = useState<number>(1)
    const [modalOpen, setModalOpen] = useState(false)

    const [bids, setBids] = useState<BidType[] | []>([])

    const [categories, setCategories] = useState<CategoryType[] | []>([])

    const [similarAuctions, setSimilarAuctions] = useState<AuctionType[] | []>([])
    const [error, setError] = useState<string | undefined>(undefined)

    const [change, setChange] = useState(false)

    const navigate = useNavigate()



    const update = async () => {
        if (auctionId == undefined) return

        const auctionResponse = await fetchAuction(parseInt(auctionId))
        if (auctionResponse.status == 200) setAuction(auctionResponse.data)
        else console.log(auctionResponse)

        const image = await fetchImage(auctionResponse.data.auctionId)
        setImage(image);
        setUserId(getUserId())

        const categoryResponse = await fetchCategories()
        if (categoryResponse !== []) setCategories(categoryResponse)
        else console.log(categoryResponse)

        const bidResponse = await fetchBids(auctionResponse.data.auctionId)
        if (bidResponse.status == 200) setBids(bidResponse.data)
        else console.log(bidResponse)


        const similarAuctionsResponse = await fetchAuctions()
        if (similarAuctionsResponse.status == 200) {
            setSimilarAuctions(similarAuctionsResponse.data.auctions.filter((similarAuction: AuctionType) => (
                (similarAuction.auctionId != auctionResponse.data.auctionId) && similarAuction.sellerId == auctionResponse.data.sellerId || similarAuction.categoryId == auctionResponse.data.categoryId
            )))
        }
        else {console.log(similarAuctionsResponse)}

    }

    useEffect(() => {
        const setup = async () => {
            await update();
        }
        window.scrollTo(0, 0)

        setup()
    }, [auctionId, change, modalOpen])


    const getCategory = (categoryId: number) => {
        return categories.filter((category: CategoryType) => category.categoryId === categoryId)[0]
    }

    const getCategoryName = (categoryId: number): string => {
        const result = getCategory(categoryId)
        return result == undefined? "No category" : result.name
    }
    const [open, setOpen] = React.useState(false);



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


    const [openDialog, setOpenDialog] = React.useState(false);

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };




    if (auctionId == undefined) return (<h1>No Auction</h1>)
    if (auction == undefined) return (<h1>No Auction</h1>);

    const handleAmountChange = (e: any) => {
        const value = e.target.value
        setAmount(parseInt(value.toString().replaceAll(".", "").replaceAll("-", "").replaceAll(",", "")))
    }

    const chooseDeleteAuction = async () => {
        setOpen(true);


        if(auction.numBids > 0) setError("Auction has bids, cannot delete")


        const response = await deleteAuction(auction.auctionId)
        if (response == undefined || response.status !== 200) console.log(response)
        else { navigate('/auctions')
                setError('Auction deleted')
        }
    }


    const placeBid = async () => {

        setOpen(true);



        const amount_ = parseInt(amount.toString().replaceAll(".", "").replaceAll("-", "").replaceAll(",", ""))

        if (!loggedIn()) {setError("You must be logged in to bid")}
        else if (auction.highestBid !== null && amount <= auction.highestBid) setError("Bid must be higher than the current bid")
        else if (auction.highestBid !== null && amount <= 0) setError("Bid must be higher than 0")
        else if (daysTillClosing(auction.endDate) == "Closed!") { setError("Auction is closed") }
        else setError("Bid placed!")


        const response = await postBid(auction.auctionId, amount_)
        console.log(response)
        if (response !== undefined && response.status == 201) setChange(!change);
    }

    const openModal = () => {

        setModalOpen(true)
    }

    return (
        <>

            <Grid container spacing={2} paddingLeft={10}>

                <Grid item xs={8}>
                    <h1> {auction.title} </h1>

                    <Typography variant="h6"><strong>Category:</strong> {getCategoryName(auction.categoryId)}</Typography>

                    <Typography variant="h6">
                        <strong>Description:</strong> {auction.description}
                    </Typography>

                </Grid>

                <Grid item xs={2}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography variant="h6"><strong>Seller: </strong>{auction.sellerFirstName} {auction.sellerLastName}</Typography>
                    <Avatar src={getProfilePhotoFor(auction.sellerId)}/>
                </div>
                </Grid>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'left',
                            overflow: 'hidden',
                            maxHeight: '400px',
                            paddingTop: 15,
                            paddingLeft: 20,
                            paddingBottom: 15,

                        }}>
                            <img style={{maxWidth: '40%'}} src={image}>
                            </img>
                        </div>
            </Grid>




                    <Grid container spacing={2} paddingLeft={10}>


                        <Grid item xs={12}>


                    <Paper style={{padding: 10, width: '50%', display: 'flex', justifyContent: 'center'}}>
                    <Grid item xs={4}>
                        <Typography variant="h6"> <strong> {daysTillClosing(auction.endDate)} </strong> </Typography>
                    </Grid>

                        <Grid item xs={18} py={2} width={600}>
                            <Grid item xs={12} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <p style={{padding: 0, margin: 0, fontSize: 40}}>
                                    {"$"}
                                    {auction.highestBid !== null? (auction.highestBid) : "0.00"}
                                </p>

                            </Grid>
                            <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
                                <Typography variant="h6">
                                    <strong>Reserve:</strong> ${(auction.reserve)} ({auction.highestBid >= auction.reserve? "met" : "not met"})
                                </Typography>
                            </Grid>
                            {userId == undefined || userId !== auction.sellerId?
                                <Grid py={5} item xs={12} style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                                    <TextField
                                        label="Amount $"
                                        type="number"
                                        value={amount}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{ inputProps: { min: 0 } }}
                                        variant="outlined"
                                         onChange={handleAmountChange}
                                    />
                                    <Button onClick={placeBid} variant="contained">Place Bid</Button>
                                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                                        <Alert onClose={handleClose} severity={error == "Bid placed!"? "success" : "error"}
                                               sx={{ width: '100%' }}>
                                            {error}
                                        </Alert>
                                    </Snackbar>
                                </Grid>
                                : (<><Typography variant="body2">This is your auction</Typography><Button variant="contained" onClick={handleClickOpenDialog}> Delete Auction </Button>
                                    <Button variant="contained" onClick={openModal}>Edit Auction</Button>
                                    <Dialog
                                        open={openDialog}
                                        onClose={handleCloseDialog}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description">
                                        <DialogTitle id="alert-dialog-title">
                                            {"Delete Auction?"}
                                        </DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Are you sure you want to delete this auction?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleCloseDialog}>No</Button>
                                            <Button onClick={async () => await chooseDeleteAuction()} autoFocus>
                                                Yes
                                            </Button>
                                            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                                                <Alert onClose={handleClose} severity="error"
                                                       sx={{ width: '100%' }}>
                                                    {error}</Alert></Snackbar></DialogActions></Dialog></> )}
                            <Grid item xs={12} style={{display: 'flex', justifyContent: 'start'}}>
                                <Typography variant="h6">
                                    <strong>Bids:</strong> {auction.numBids}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>




                                <Paper style={{padding: 10, width: '50%', display: 'flex', justifyContent: 'center', maxHeight: 300, overflow: 'auto'}}>
                                    <Grid item container spacing={1} xs={14} style={{display: 'flex', justifyContent: 'center'}}>
                                        <Typography variant="h6"> <strong>Current Bids</strong> </Typography>
                                        {bids.map((bid: BidType, index: number) => (
                                            <Grid key={index} item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
                                                <Typography variant="h6"> <strong> ${bid.amount} </strong> </Typography>
                                                <Typography>&nbsp;</Typography>
                                                <Typography variant="h6"> by {bid.firstName + " " + bid.lastName} </Typography>
                                                <Avatar src={getProfilePhotoFor(bid.bidderId)} sx={{ width: 25, height: 25 }}/>
                                                <Typography>&nbsp;</Typography>
                                                <Typography variant="h6"> on {timestampToDate(bid.timestamp)} </Typography>
                                                <Typography>&nbsp;</Typography>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Paper>




                        </Grid>





</Grid>






            <div style={{display: 'flex', justifyContent: 'center'}}><h1> Similar Auctions: </h1>

                <Grid item container xs={12} style={{padding: '12px 40px'}} spacing={3} display='flex' justifyContent='start'>
                    {similarAuctions.map((similarAuction: AuctionType) => (
                        <Grid item xs={12} sm={6} md={4} xl={3} key={similarAuction.auctionId}>
                            <div style={{maxWidth: '350px'}}>
                                <AuctionComponent auctionId={similarAuction.auctionId}
                                                  category={getCategory(similarAuction.categoryId)}/>
                            </div>
                        </Grid>
                    ))}
                </Grid>

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
                    open={modalOpen}
                >
                    {modalOpen?
                        <EditAuction edit={true} auction={auction} onClose={() => {setModalOpen(false)}}/>
                        : <></>}
                </Backdrop>


            </div>
        </>


        )
}
export default AuctionItem



export const timestampToDate = (bidTimestamp: string) => {
    const dateNumber = Date.parse(bidTimestamp)
    const date = new Date(dateNumber)

    const ymdhm = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric" };

    // @ts-ignore
    const dateFinal = date.toLocaleDateString("en-NZ", ymdhm)

    return dateFinal;
}



export const daysTillClosing = (endDateString: string) => {

    const endDateNumber = Date.parse(endDateString)
    const endDate = new Date(endDateNumber)
    const dateNow = new Date()


    const monthsLeft = (endDate.getFullYear() - dateNow.getFullYear()) * 12;
    const weeksLeft = Math.floor((endDate.getTime() - dateNow.getTime()) / (1000*60*60*24*7))
    const daysLeft = Math.floor( (endDate.getTime() - dateNow.getTime()) / (1000*60*60*24));

    const hoursLeft = Math.floor((endDate.getTime() - dateNow.getTime()) / (1000*60*60))
    const minutesLeft = Math.floor((endDate.getTime() - dateNow.getTime()) / (1000*60))

    if (monthsLeft > 0) return `Closes in: ${monthsLeft} Months`
    if (weeksLeft > 0) return `Closes in: ${weeksLeft} Weeks`
    if (daysLeft > 0) return `Closes Soon`
    if (daysLeft > 1) return `Closes in: ${daysLeft} Days`
    if (hoursLeft > 0) return `Closes in ${hoursLeft} Hours`
    if (minutesLeft > 0) return `Closes in ${minutesLeft} Minutes`
    if (minutesLeft < 0) return `Closed!`

}
