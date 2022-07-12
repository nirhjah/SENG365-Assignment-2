import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import MenuItem from "@mui/material/MenuItem"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from "react"
import { fetchCategories, postAuction, uploadPhoto } from "../service/APIService"
import {CategoryType} from "../types/CategoryType";


const tommorow = (): Date => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return date
}

export const CreateAuction = ({ onClose, create}: any) => {
    const tommorowDate: Date = tommorow()

    const [reserve, setReserve] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [endDate, setEndDate] = useState(tommorow())
    const [categories, setCategories] = useState<CategoryType[] | []>([])
    const [category, setCategory] = useState<CategoryType | undefined>(undefined)
    const [categoryString, setCategoryString] = useState<string>("")
    const [error, setError] = useState("")
    const [todayString, setTodayString] = useState<string>(tommorowDate.toISOString().substring(0, tommorowDate.toISOString().length - 8))
    const [auctionPhoto, setAuctionPhoto] = useState(null)
    const [imageSrc, setImageSrc] = useState('')

    const categoryChange = (event: SelectChangeEvent) => {
        const value = event.target.value as string
        const category_ = categories.filter((category: CategoryType) => { return category.name === value})[0]
        setError("")
        setCategoryString(value);
        setCategory(category_)
    };

    const reserveAt1 = (e: any) => {
        const reserveNumber = parseInt(e.target.value)
        setReserve(Math.max(reserveNumber, 1).toString())
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
        }

        getCategories()
    }, [])

    const submitForm = async () => {
        const reserve_ = parseInt(reserve)

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
        if (reserve_ >= 1) {
            body = {
                title: title,
                description: description,
                endDate: formattedDate,
                categoryId: category?.categoryId,
                reserve: (reserve_ >= 1? reserve_ : null)
            }
        } else {
            body = {
                title: title,
                description: description,
                endDate: formattedDate,
                categoryId: category?.categoryId
            }
        }

        if (title.length <= 0) {setError("Title required"); return}
        if (description.length <= 0) {setError("description required"); return}
        if (category == undefined) {setError("category required"); return}

        let auctionId_;


        const response = await postAuction(body)
        if (response == undefined) return
        if (response.status !== 201) {
            console.log(response)
            setError("title already taken")
            return
        }
        auctionId_ = response.data.auctionId


        if (auctionPhoto !== undefined && auctionPhoto !== null) {
            const uploadImageResponse = await uploadPhoto(auctionPhoto, auctionId_)
            if (uploadImageResponse !== 200 && uploadImageResponse !== 201) {
                setError("Something went wrong")
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
        setImageSrc(src)
    }

    return (
        <Paper style={{overflow: 'hidden'}}>
            <Box component="form" sx={{margin: 5}}>
                <Grid container spacing={2} style={{width: '500px'}}>
                    <Typography variant="h3">Create Auction</Typography>

                    <Grid pb={3} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} item xs={12}>
                        <label htmlFor='file-input'>
                            <img style={{height: '200px', width: 'auto'}} src={imageSrc}></img>
                        </label>
                        <input type="file" accept=".jpg,.jpeg,.png,.gif" id='file-input' onChange={async (e) => await setImage(e)} />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography color='red' variant="body1">
                            {error}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
                        <TextField
                            required={create}
                            helperText={error}
                            label="Title"
                            variant="outlined"
                            value={title}
                            onChange={(e: any) => setTitle(e.target.value)}
                        />
                        <FormControl style={{display: 'flex', flexGrow: 1}}>
                            <InputLabel id="category">Category</InputLabel>
                            <Select
                                required={create}
                                labelId="category"
                                value={categoryString}
                                label="Category"
                                onChange={categoryChange}
                            >
                                {categories.length > 0? categories.map((category: CategoryType) => (
                                    <MenuItem key={category.categoryId} value={category.name}>{category.name}</MenuItem>
                                )) : <MenuItem>None</MenuItem>}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
                        <TextField
                            required={create}
                            fullWidth
                            helperText={error}
                            label="Description"
                            multiline
                            value={description}
                            onChange={(e: any) => setDescription(e.target.value)}
                        />
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
                            InputProps={{inputProps: { min: tommorowDate.toISOString().substring(0, tommorowDate.toISOString().length - 8)} }}
                            value={todayString}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e: any) => {updateEndDate(e)}}
                        />
                    </Grid>



                    <Grid item xs={12}>
                        <Button onClick={submitForm} variant='contained'>Add Auction</Button>
                        <Button onClick={onClose} variant='contained'>Cancel</Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
}

