import React from 'react'
import { MaskingCanvas } from './MaskingCanvas'
import { TicketContent } from './TicketContent'

export function ScratchCard() {
  return (
    <div style={{position: "relative", height: "200px", width: "300px", border: "1px solid black"}}>
      <MaskingCanvas imgPath="/cover.png" />
      <TicketContent/>
    </div>
  )
}