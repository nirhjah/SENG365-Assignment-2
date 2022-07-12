import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from "@mui/material/MenuItem"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from "react"
import { fetchCategories, fetchImage, editAuction, uploadPhoto } from "../service/APIService"
import {CategoryType} from "../types/CategoryType";

const tomorrowDate = (): Date => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return date
}

export const EditAuction = ({ onClose, auction, create, edit}: any) => {
    const dateTomorrow: Date = tomorrowDate()

    const [reserve, setReserve] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [categories, setCategories] = useState<CategoryType[] | []>([])
    const [category, setCategory] = useState<CategoryType | undefined>(undefined)
    const [categoryString, setCategoryString] = useState<string>("")
    const [endDate, setEndDate] = useState(tomorrowDate())
    const [todayString, setTodayString] = useState<string>(dateTomorrow.toISOString().substring(0, dateTomorrow.toISOString().length - 8))
    const [error, setError] = useState("")
    const [auctionPhoto, setAuctionPhoto] = useState(null)
    const [imgString, setImgString] = useState('')

    const handleChange = (event: SelectChangeEvent) => {
        const value = event.target.value as string
        const category_ = categories.filter((category: CategoryType) => {
            return category.name === value})[0]
        setError("")
        setCategoryString(value);
        setCategory(category_)
    };

    const reserveAt1 = (e: any) => {
        setReserve(Math.max(parseInt(e.target.value), 1).toString())
    }

    const updateEndDate = (e: any) => {
        const date = new Date(e.target.value)
        setEndDate(date)
        setTodayString(date.toISOString().substring(0, date.toISOString().length - 8))
    }

    useEffect(() => {
        const getCategories = async () => {
            const categoryResponse = await fetchCategories()
            setCategories(categoryResponse)

            setTitle(auction.title)
            setDescription(auction.description)
            setReserve(auction.reserve.toString())

            const endDate_ = new Date(auction.endDate)
            setEndDate(endDate_)
            setTodayString(endDate_.toISOString().substring(0, endDate_.toISOString().length - 8))

            const category_: CategoryType = categoryResponse.filter((cat: CategoryType) => {
                return cat.categoryId === auction.categoryId
                })[0]
                setCategory(category_)
                setCategoryString(category_.name)

                const image = await fetchImage(auction.auctionId)
            setImgString(image);

        }

        getCategories()
    }, [])

    const submitForm = async () => {
        const reserveNumber = parseInt(reserve)

        function GetFormattedDate(date: Date) {
            var month = ("0" + (date.getMonth() + 1)).slice(-2);
            var day  = ("0" + (date.getDate())).slice(-2);
            var year = date.getFullYear();
            var hour =  ("0" + (date.getHours())).slice(-2);
            var min =  ("0" + (date.getMinutes())).slice(-2);
            var seg = ("0" + (date.getSeconds())).slice(-2);
            var mill = ("00" + (date.getMilliseconds())).slice(-3);
            return year + "-" + month + "-" + day + " " + hour + ":" +  min + ":" + seg + "." + mill;
        }

        const formattedDate = GetFormattedDate(endDate);

        let body;
        if (reserveNumber >= 1) {
            body = {
                title: title,
                description: description,
                endDate: formattedDate,
                categoryId: category?.categoryId,
                reserve: (reserveNumber >= 1? reserveNumber : null)
            }
        } else {
            body = {
                title: title,
                description: description,
                endDate: formattedDate,
                categoryId: category?.categoryId
            }
        }

        if (title.length <= 0) {setError("title required"); return}
        if (description.length <= 0) {setError("description required"); return}
        if (category == undefined) {setError("category required"); return}

        let auctionId_;


        const editAuctionResponse = await editAuction(body, auction.auctionId)
        if (editAuctionResponse == undefined || editAuctionResponse.status !== 200) {
            console.log(editAuctionResponse)
            setError("title taken")
            return
        }
        auctionId_ = auction.auctionId



        if (auctionPhoto !== null && auctionPhoto !== undefined) {
            const uploadImageResponse = await uploadPhoto(auctionPhoto, auctionId_)
            if (uploadImageResponse !== 200 && uploadImageResponse !== 201) {
                setError("something went wrong")
                return
            }
        } else {
            onClose()
            return
        }

    }

    const setImage = async (e: any) => {
        const file = e.target.files[0]
        setAuctionPhoto(file)

        if (file == undefined) {
            return
        }
        if (!['image/png', 'image/jpg', 'image/jpeg', 'image/gif'].includes(file.type)) {
            return
        }

        const src = URL.createObjectURL(file)
        setImgString(src)
    }

    return (
        <Paper style={{overflow: 'hidden'}}>
            <Box
                component="form"
                sx={{margin: 1}}>
                <Grid container spacing={2} style={{width: '500px'}}>
                        <Typography variant="h3">Edit Auction</Typography>

                    <Grid pb={3} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} item xs={12}>
                        <label htmlFor='file-input'>
                            <img style={{height: '200px', width: 'auto'}} src={imgString}></img>
                        </label>
                        <input
                               type="file"
                               accept=".jpg,.jpeg,.png,.gif"
                               id='file-input'
                               onChange={async (e) => await setImage(e)} />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography color='red' variant="body1">
                            {error}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
                        <TextField
                            required={create}
                            label="Title"
                            variant="outlined"
                            value={title}
                            onChange={(e: any) => setTitle(e.target.value)}
                        />
                        <FormControl style={{display: 'flex'}}>
                            <InputLabel id="category">Category</InputLabel>
                            <Select
                                required={create}
                                labelId="category"
                                value={categoryString}
                                label="Category"
                                onChange={handleChange}
                            >
                                {categories.length > 0? categories.map((category: CategoryType) => (
                                    <MenuItem key={category.categoryId} value={category.name}>{category.name}</MenuItem>
                                )) : <MenuItem>None</MenuItem>}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
                        <TextField
                            label="Reserve"
                            value={reserve}
                            type="number"
                            onChange={reserveAt1}
                        />
                        <TextField
                            required={create}
                            label="End Date"
                            type="datetime-local"
                            InputProps={{inputProps: { min: dateTomorrow.toISOString().substring(0, dateTomorrow.toISOString().length - 8)} }}
                            value={todayString}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e: any) => {updateEndDate(e)}}
                        />
                    </Grid>

                    <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
                        <TextField
                            required={create}
                            fullWidth
                            label="Description"
                            multiline
                            value={description}
                            onChange={(e: any) => setDescription(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
                        <Button onClick={submitForm} variant='contained'>Edit Auction</Button>
                        <Button onClick={onClose} variant='contained'>Cancel</Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
}

