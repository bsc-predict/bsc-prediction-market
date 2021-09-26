import axios from "axios"
import { Urls } from "../constants"

export const fetchBnbPrice = async () => {
  const url = Urls.bnbPrice
  const res = await axios.get(url)
  return res.data.price as number
}