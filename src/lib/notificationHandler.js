import toast from "react-hot-toast"





export const notification = (message, options={}) => {
    

    toast.success(message, {
        ...options,
        icon: options.icon || '✅',
        duration: options.duration || 2500,
        position: "top-center"
      })
}