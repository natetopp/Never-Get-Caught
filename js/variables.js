let play = false
let winDialog

let levelSpecs =[
    {
        field: '#333',
        ball: 'rgb(255, 137, 235)',
        food: 'greenyellow',
        mobs: 'rgb(255, 52, 52)',
    },
    {
        field: '#226634',
        ball: '#4c6cc7',
        food: '#a24cc7',
        mobs: '#917b33',
    },
    {
        field: '#d6676e',
        ball: '#6785d6',
        food: '#11783f',
        mobs: '#595959',
    },
    {
        field: '#50b55f',
        ball: '#b56750',
        food: '#7d50b5',
        mobs: '#5087b5',
    }
]

let lvl = 1
let point = 0
let statsAnim = null

let mouseX = 0
let mouseY = 0
let ballWidth
let ballHeight

let ballLeft
let ballTop
let ballRight
let ballBottom

let foodList = []
let foodNum
let foodListenerNum = 0

let foodLeft
let foodTop
let foodRight
let foodBottom

let foodIntersectAnim = null
let foodIntersect = false

let mobs = []
let mobNum
let mobListenerNum = 0
let mobX
let mobY

let mobSpeed = [6, -6]
let mobSpeedGrow = 1
let mobStepX
let mobStepY

let mobMoveAnim = null

let mobLeft
let mobTop
let mobRight
let mobBottom

let mobIntersectAnim = null
let mobIntersect = false