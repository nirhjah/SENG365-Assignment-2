import Grid from "@mui/material/Grid"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import {AuctionType} from "../types/AuctionType";
import {CategoryType} from "../types/CategoryType";
import {
    fetchAuctions,
    fetchCategories,
    getLoggedIn,
    getUserId,
    loggedIn
} from "../service/APIService";
import AuctionComponent from "../components/AuctionComponent";
import {CreateAuction} from "./CreateAuction";


export const MyAuctions = () => {

    const [auctions, setAuctions] = useState<AuctionType[] | []>([])
    const [categories, setCategories] = useState<CategoryType[] | []>([])
    const [modalOpen, setModalOpen] = useState(false)

    const navigate = useNavigate()
    let userId: number | undefined = undefined


    const getAuctions = async () => {

        const userResponse = await getLoggedIn()
        if (userResponse == undefined || userResponse.status !== 200) return //navigate("/login")
        userId = getUserId()





        const myAuctionsResponse = await fetchAuctions()
        if (myAuctionsResponse.status == 200) {
            setAuctions(myAuctionsResponse.data.auctions.filter((similarAuction: AuctionType) => (
                similarAuction.sellerId == userId
            )))
        }
        else {console.log(myAuctionsResponse)}



        const categoryResponse = await fetchCategories()
        setCategories(categoryResponse)
    }

    const update = () => {
        getAuctions()
    }

    useEffect(() => {
        if (!loggedIn()) navigate('/login')
        update()
    }, [modalOpen])

    const getCategory = (categoryId: number) => {
        return categories.filter((category: CategoryType) => category.categoryId === categoryId)[0]
    }

    const openModal = () => {
        setModalOpen(true)
    }

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>


            <Grid alignContent='center' alignItems='center' container sx={{width: {xs: '100%', sm: '98%', md: '95%', lg: '95%'}, maxWidth: '1500px'}}>
                <Button variant="contained" onClick={openModal}>Add Auction</Button>
                <Grid item xs={12} container spacing={3} display='flex' justifyContent='start'>
                    {auctions.length > 0? (
                        auctions.map((auction) => {
                            return (
                                <Grid key={auction.auctionId} item xs={12} md={6} lg={4} xl={3} display='flex' justifyContent='center'>
                                    {categories.length > 0? <AuctionComponent auctionId={auction.auctionId} category={getCategory(auction.categoryId)}/> : <></>}
                                </Grid>
                            )
                        })
                    ) : ""}
                </Grid>


            </Grid>

            <Backdrop
                sx={{ color: '#fff'}}
                open={modalOpen}
            >
                {modalOpen?
                    <CreateAuction open={modalOpen} create={true} onClose={() => setModalOpen(false)}/>
                    : <></>}
            </Backdrop>


        </div>
    )
}
