
export const shortenAddress = (address: string) => address.slice(0,4).concat("...").concat(address.slice(address.length-4))
