import { Stack } from "@mui/material"
import { useState, useRef } from "react"




const Carousel = () => {
  const data = [
    {
      img: 'https://binmile.com/wp-content/uploads/2021/10/unique-tools-for-getting-superb-performance-testing-outcome.jpg'
    },
    {
      img: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      img: 'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=600'
    },

  ]
  const [current, setCurrent] = useState(data[0]?.img)
  const ref = useRef(null)




  const desired = e => {
    setCurrent((e))
  }




  return (
    <>
      <img src={current} style={{ width: '100%', height: '292px', borderRadius: '24px' }} />


      <Stack direction='row' gap={2} justifyContent='center'>
        {data?.map((num => (
          <div
            key={num}
            style={{ width: '50px', height: '4px', background: num.img === current ? "#B46228" : 'white', borderRadius: '8px', cursor: 'pointer' }}
            onClick={() => desired(num.img)}
            id={num}

          />
        )))}

      </Stack>
    </>

  )
}

export default Carousel;