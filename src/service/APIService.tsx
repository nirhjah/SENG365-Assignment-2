import axios from "axios";
import Cookies from "js-cookie";

const apiURL = 'http://localhost:4941/api/v1/';

/**
 * REGISTER & LOG IN
 */

export const register = async (firstName: string, lastName: string, email: string, password: string) => {
    return await axios.post(apiURL + `users/register`, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    })
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            console.log(error)
            return error.response.status;
        })
}


export const login = async (email:string , password: string) => {
    return await axios.post(apiURL + `users/login`, {
        email: email,
        password: password
    })
        .then((response) => {
            Cookies.set('UserId', response.data.userId)
            Cookies.set('UserToken', response.data.token)
            return response.status;
        })
        .catch((error) => {
            console.log(error)
            return error.response.status;
        })
}

export const loggedIn = (): boolean => {
    const userId = Cookies.get('UserId')
    return userId !== undefined && userId !== null
}

export const getLoggedIn = async () => {
    if (!loggedIn()) return undefined
    const userId = parseInt(Cookies.get('UserId') as string || "") || undefined

    const config = {
        headers: {
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }

    const response = await axios.get(apiURL + `users/${userId}`, config)
    return response
}


export const logout = async () => {
    const config = {
        headers: {
            "content-type": "application/json",
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }

    return await axios.post(apiURL + `users/logout`, {}, config)
        .then((response) => {
            Cookies.remove('UserId')
            Cookies.remove('UserToken')
            return response.status;
        })
        .catch((error) => {
            console.log(error)
            return error.response.status;
        })
}


/**
 * AUCTION
 *
 */

export const fetchBids = async (auctionId: number) => {
    const response =  await axios.get(apiURL + `auctions/${auctionId}/bids`)
    return response;
}

export const fetchAuctions = async () => {
    const response =  await axios.get(apiURL + `auctions`)
    return response;
}

export const fetchImage = async (auctionId: number): Promise<string> => {
    return await axios.get(apiURL + `auctions/${auctionId}/image`)
        .then((response) => {
            return apiURL + `auctions/${auctionId}/image`
        })
        .catch((error) => {
            return require("../components/noimage.png")
        })
}

export const editAuction = async (body: any, auctionId: number) => {
    if (!loggedIn()) return

    const config = {
        headers: {
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }

    const response = await axios.patch(apiURL + `auctions/${auctionId}`, body, config)
        .catch((error) => {return undefined})
    return response
}

export const deleteAuction = async (auctionId: number) => {
    if (!loggedIn()) return

    const config = {
        headers: {
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }

    const response = await axios.delete(apiURL + `auctions/${auctionId}`, config)
    return response
}

export const uploadPhoto = async (image: any, auctionId: number) => {
    if (!loggedIn()) return

    let imageType = image.type
    if (imageType === 'image/jpg') imageType = 'image/jpeg'

    const config = {
        headers: {
            "content-type": imageType,
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }

    return await axios.put(apiURL + `auctions/${auctionId}/image`, image, config)
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            return error.response.status;
        })
}


export const postBid = async (auctionId: number, amount: number) => {
    if (!loggedIn()) return

    const config = {
        headers: {
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }

    const response = await axios.post(apiURL + `auctions/${auctionId}/bids`, {
        amount: amount
    }, config)
    return response
}

export const postAuction = async (body: any) => {
    if (!loggedIn()) return

    const config = {
        headers: {
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }

    const response = await axios.post(apiURL + `auctions`, body, config)
        .catch((error) => {return undefined})
    return response
}

export const fetchAuction = async (id: number) => {
    return await axios.get(apiURL + `auctions/${id}`)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        })
}


export const fetchCategories = async () => {
    const response = await axios.get(apiURL + `auctions/categories`)
    if (response.status !== 200) return []
    return response.data
}



/**
 * USER
 *
 */


export const getUserId = (): number | undefined => {
    let userId = Cookies.get('UserId')
    if (userId !== undefined) return parseInt(userId)
    return userId
}



export const uploadProfilePhoto = async (image: any) => {
    if (!loggedIn()) return

    const userId = parseInt(Cookies.get('UserId') as string || "") || undefined
    let imageType = image.type
    if (imageType === 'image/jpg') imageType = 'image/jpeg'

    const config = {
        headers: {
            "content-type": imageType,
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }

    return await axios.put(apiURL + `users/${userId}/image`, image, config)
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            return error.response.status;
        })
}

export const deleteProfilePhoto = async () => {
    if (!loggedIn()) return
    const userId = parseInt(Cookies.get('UserId') as string || "") || undefined

    const config = {
        headers: {
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }

    return await axios.delete(apiURL + `users/${userId}/image`, config)
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            return error.response.status;
        })
}

export const getProfilePhoto = () => {
    if (!loggedIn()) return ""
    const userId = parseInt(Cookies.get('UserId') as string || "") || undefined

    return apiURL + `users/${userId}/image`
}

export const getProfilePhotoFor = (id: number) => {
    return apiURL + `users/${id}/image`
}

export const editUser = async (firstName: string, lastName: string, email: string, password?: string, currentPassword?: string) => {
    if (!loggedIn()) return undefined
    const userId = parseInt(Cookies.get('UserId') as string || "") || undefined

    let body;
    if (password !== undefined && password.length > 0) {
        body = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            currentPassword: currentPassword
        }
    } else {
        body = {
            firstName: firstName,
            lastName: lastName,
            email: email,
        }
    }

    console.log(body)
    const config = {
        headers: {
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }

    return await axios.patch(apiURL + `users/${userId}`, body, config)
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            console.log(error)
            return error.response.status;
        })
}
