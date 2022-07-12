import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {AuctionType} from "../types/AuctionType";
import {daysTillClosing} from "../pages/AuctionItem";
import Avatar from "@mui/material/Avatar";
import {fetchAuction, fetchImage, getProfilePhotoFor} from "../service/APIService";

export default function AuctionComponent({auctionId, category}: any) {
    const [auction, setAuction] = useState<AuctionType | undefined>(undefined)
    const [image, setImage] = useState<string | undefined>(undefined)
    const navigator = useNavigate()

    // Get Auction
    useEffect(() => {
        const getAuction = async () => {
            const response = await fetchAuction(auctionId)
            if (response.status == 200) setAuction(response.data)
            else {
                console.log(response)
                return
            }
            const image = await fetchImage(response.data.auctionId)
            setImage(image);

        }

        getAuction()
    }, [])

    if (auctionId == undefined || auctionId == null) return (<></>);
    if (auction == undefined) return (<></>)

    const openItem = () => {
        navigator(`/auction/${auction.auctionId}`)
    }

    return (

        <Card sx={{boxShadow: 8, width: '100%', maxWidth: 375, minWidth: 200}}>
            <CardActionArea onClick={openItem}>
                <CardMedia
                    component="img"
                    height="180"
                    image={image}
                    alt={auction.title}
                />
                <CardContent style={{paddingBottom: 0}}>

                        <Grid container spacing={12}>
                            <Grid item xs={8}>

                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                {category !== undefined? <p>{category.name}</p> : <></>}
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                {daysTillClosing(auction.endDate)}
                            </div>
                            </Grid>

                            <Grid item xs={4}>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>

                                <p>{auction.sellerFirstName} {auction.sellerLastName}</p>
                                </div>

                                <Avatar src={getProfilePhotoFor(auction.sellerId)} />


                            </Grid>
                        </Grid>


                    <Typography gutterBottom variant="h5" component="div">
                        {auction.title}
                    </Typography>

                    <Typography variant="body2" style={{maxHeight: 45, overflow: 'hidden'}}>
                        {auction.description}
                    </Typography>

                </CardContent>

                <CardActions>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <p style={{padding: 0, margin: 0, fontSize: 12}}>
                                {auction.highestBid !== null && auction.highestBid >= auction.reserve? "Reserve (met) $" : "Reserve (not met) $"}

                                {auction.reserve == null || auction.reserve == undefined? "0.00" : auction.reserve}

                            </p>


                        </div>


                        <div>
                            <p style={{padding: 0, margin: 0, fontSize: 12}}>
                                {auction.highestBid > 0? `Highest bid: $${auction.highestBid}` : "no bids yet"}
                            </p>

                        </div>


                    </div>
                </CardActions>

            </CardActionArea>
        </Card>
    );
}


