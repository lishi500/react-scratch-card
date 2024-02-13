import React, { useEffect, useRef } from 'react'

interface MaskingCanvasProps {
    // maskingImg: CanvasImageSource
    imgPath: string
}

const canvasOptions: CanvasRenderingContext2DSettings ={
     alpha: true,
    //  desynchronized: false,
    //  colorSpace: "srgb",
     willReadFrequently: true
  };

export function MaskingCanvas({imgPath}: MaskingCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null) 
    const [isDrawing, setIsDrawing] = React.useState(false)
    const [lastPos, setLastPos] = React.useState(null)
    const [percentage, setPercentage] = React.useState(0)
    const cleanUpCounterRef = useRef(0)
    const [ending, setEnding] = React.useState(false)
    const r = 30;
    const rThreshold = r / 2;
    const percentageThreshold = 0.5;

    const onMousePress = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        console.log('press', x, y)
        setIsDrawing(true)
        wipeOut(x, y)
    }

    const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        wipeOut(x, y)
        // console.log('move', x, y)
    };

    const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        console.log('up')
        setIsDrawing(false)
    }
   

    const wipeOut = (x: number, y: number) => {
        if (!isDrawing) return
        const ctx = canvasRef.current?.getContext("2d", canvasOptions);
        if (!ctx) return;
        const imgData: ImageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        // const index = (x + y * imgData.width) * 4;
        // imgData.data[index + 3] = 0;
        let top = Math.max(y - r, 0);
        let left = Math.max(x - r, 0);
        let right = Math.min(x + r, imgData.width);
        let bottom = Math.min(y + r, imgData.height);
        let removed = 0;

        for (let i = top; i < bottom; i++) {
            for (let j = left; j < right; j++) {
               
                const dist = Math.sqrt((i - y) ** 2 + (j - x) ** 2);
                if (dist < r) {
                    if (dist < rThreshold) { 
                        const index = (j + i * imgData.width) * 4;
                        // removed+= 255 - imgData.data[index + 3];
                        imgData.data[index + 3] = 0;
                    } else {
                        const percentage = (dist - rThreshold) / (rThreshold)
                        const alpha = 255 * percentage;
                        const index = (j + i * imgData.width) * 4;
                        const targetAlpha = Math.min(alpha, imgData.data[index + 3]);
                        // removed += imgData.data[index + 3] - targetAlpha;
                        imgData.data[index + 3] = targetAlpha;
                    }
                }   
            }
        }

         for (let i = 0; i < imgData.data.length; i+=4) {
            removed+= 255 - imgData.data[i + 3];
         }
         setPercentage(removed / (imgData.data.length / 4 * 255))

        ctx.putImageData(imgData, 0, 0);

        // const removedPercentage = removed / (imgData.data.length / 4 * 255)
        // setPercentage((prev) => {
        //     // console.log('percent', prev + removedPercentage)
        //     return prev + removedPercentage
        // })
    }


    useEffect(() => {  
        const cxt = canvasRef.current?.getContext('2d');
        const img = new Image();
        
        img.src = imgPath;
        img.onload = () => {
            cxt?.drawImage(img, 0, 0);
        }
    }, [])

    useEffect(() => {
        if (percentage > percentageThreshold && !ending) {
            setEnding(true)
            console.log('done', ending)
            const intervalHandle = setInterval(() => {
                const ctx = canvasRef.current?.getContext("2d", canvasOptions);
                if (!ctx) return;
              
                const imgData: ImageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
                for (let i = 0; i < imgData.data.length; i+=4) {
                    imgData.data[i + 3] -= 23;
                    if (cleanUpCounterRef.current >= 10) {
                        ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                        clearInterval(intervalHandle)
                        cleanUpCounterRef.current = 0; 
                    }
                }
                ctx.putImageData(imgData, 0, 0);
                cleanUpCounterRef.current += 1
            }, 50)
        }
    }, [percentage])

  return (
    <canvas 
    ref={canvasRef} style={{position: "absolute", top: 0, left: 0}}
    onMouseDown={onMousePress}
    onMouseMove={onMouseMove}
    onMouseUp={onMouseUp}
    // onMouseEnter={}
    // onMouseLeave={\}
   
    
    >
      
    </canvas>
  )
}