newGameBtn.addEventListener('click', firstGame)



//NEW GAME AND RELOAD
function firstGame() {
    document.getElementById('welcome').style.display = 'none'
    document.getElementById('pause').style.display = 'block'
    document.getElementById('newGameBtn').style.right = 165 + 'px'

    newGame()

    newGameBtn.removeEventListener('click', firstGame)
}

function reloadGame() {
    play = false

    cancelAnimationFrame(foodIntersectAnim)
    cancelAnimationFrame(mobIntersectAnim)
    cancelAnimationFrame(statsAnim)

    newGameBtn.removeEventListener('click', newGamePressed)
    pause.removeEventListener('click', pauseGame)
    document.removeEventListener('mousemove', ballMove)
    ballRemove()
    mobRemove()
    foodRemoveAll()
    newGame()
}

function newGame() {
    ballGenerate()
    foodGenerate()
    mobGenerate()
    setTimeout(() => newGameBtn.addEventListener('click', newGamePressed), 2000)
    setTimeout(() => pause.addEventListener('click', pauseGame), 2000)

    play = true

    stats()
    setTimeout(() => document.addEventListener('mousemove', ballMove), 2000)
    setTimeout(mobMove, 2000)
    setTimeout(foodIntersectCheck, 2000)
    setTimeout(mobIntersectCheck, 2000)

    levelDesign()
}



//BUTTONS AND STATS
function pauseGame() {
    play = false
    document.getElementById('pause').textContent = 'Play'
    pause.removeEventListener('click', pauseGame)
    pause.addEventListener('click', playGame)
}

function playGame() {
    play = true
    document.getElementById('pause').textContent = 'Pause'
    pause.removeEventListener('click', playGame)
    pause.addEventListener('click', pauseGame)

    stats()
    mobMove()
    foodIntersectCheck()
    mobIntersectCheck()
}

function newGamePressed() {
    mobSpeedGrow = 1
    lvl = 1
    point = 0
    
    if(play === false) {
        document.getElementById('pause').textContent = 'Pause'
        pause.removeEventListener('click', playGame)
        pause.addEventListener('click', pauseGame)
    }
    reloadGame()
}

function stats() {
    if(play === true) {
        statsAnim = requestAnimationFrame(stats)
        document.getElementById('level').textContent = 'Level ' + lvl
        document.getElementById('points').textContent = point + ' points'
    }
}



//LEVEL
function levelDesign() {
    document.getElementById('field').style.backgroundColor = levelSpecs[lvl-1].field
    field.children[0].style.backgroundColor = levelSpecs[lvl-1].ball

    foodNum = 0
    while(foodNum < 10) {
        field.children[foodNum + 1].style.backgroundColor = levelSpecs[lvl-1].food
        foodNum++
    }

    mobNum = 0
    while(mobNum < 5) {
        field.children[foodList.length + mobNum + 1].style.backgroundColor = levelSpecs[lvl-1].mobs
        mobNum++
    }
}



//BALL
function ballGenerate() {
    const newBall = document.createElement('div')
    newBall.classList.add('ball')
    field.append(newBall)

    ballWidth = 50
    ballHeight = 50
    field.children[0].style.width = ballWidth + 'px'
    field.children[0].style.height = ballHeight + 'px'
    field.children[0].style.left = window.innerWidth/2 - ballWidth/2 + 'px'
    field.children[0].style.top = window.innerHeight/2 - ballHeight/2 + 'px'
}

function ballMove(event) {
    if(play === true) {
        mouseX = event.pageX
        mouseY = event.pageY
        field.children[0].style.left = mouseX - ballWidth/2 + 'px'
        field.children[0].style.top = mouseY - ballHeight/2 + 'px'
    }
}

function ballGrow() {
    ballWidth += 6
    ballHeight += 6
    field.children[0].style.width = ballWidth + 'px'
    field.children[0].style.height = ballHeight + 'px'
    field.children[0].style.left = mouseX - ballWidth/2 + 'px'
    field.children[0].style.top = mouseY - ballHeight/2 + 'px'
}

function ballRemove() {
    field.removeChild(field.children[0])
}



//FOOD
function foodGenerate(x,  y) {
    foodNum = 0
    while(foodNum < 10) {
        const newFood = document.createElement('div')
        newFood.classList.add('food')
        field.append(newFood)
    
        x = Math.random() * (window.innerWidth - 140) + 70
        y = Math.random() * (window.innerHeight - 140) + 70
        while((x > (window.innerWidth/2 - ballWidth/2 - 100) && x < (window.innerWidth/2 + ballWidth/2 + 100))
            || (y > (window.innerHeight/2 - ballWidth/2 - 100) && y < (window.innerHeight/2 + ballHeight/2 + 100))) {
            x = Math.random() * (window.innerWidth - 140) + 70
            y = Math.random() * (window.innerHeight - 140) + 70
        }
        newFood.style.left = x + 'px'
        newFood.style.top = y + 'px'
        
        foodList.push({
            foodLeft: x,
            foodTop: y,
            foodWidth: 20,
            foodHeight: 20,
        })
        
        foodNum++
    }
}

function foodIntersectCheck() {
    if(play === true) {
        foodIntersectAnim = requestAnimationFrame(foodIntersectCheck)
        
        if(foodListenerNum >= foodList.length) {
            foodListenerNum = 0
        }
    
        foodLeft = parseInt(foodList[foodListenerNum].foodLeft)
        foodTop = parseInt(foodList[foodListenerNum].foodTop)
        foodRight = foodLeft + foodList[foodListenerNum].foodWidth
        foodBottom = foodTop + foodList[foodListenerNum].foodHeight
    
        ballLeft = parseInt(field.children[0].style.left)
        ballTop = parseInt(field.children[0].style.top)
        ballRight = ballLeft + parseInt(field.children[0].style.width)
        ballBottom = ballTop + parseInt(field.children[0].style.height)
    
        if(foodLeft >= ballLeft && foodRight <= ballRight && foodTop >= ballTop && foodBottom <= ballBottom) {
            foodIntersect = true

            ballGrow()
            foodRemove()
        }
        else {
            foodIntersect = false
        }
        //console.log(foodIntersect)
        foodListenerNum++
    }
}

function foodRemove() {
    field.removeChild(field.children[foodListenerNum + 1])
    foodList.splice(foodListenerNum, 1)
    point += 2
  
    if(foodList.length === 0) {
        if(lvl >= 4) {
            winDialog = confirm('You won!\nStart a new game?')
            if(winDialog === true) {
                newGamePressed()
            }
            else {
                pauseGame()
            }
        }
        else {
            mobSpeedGrow += 0.3
            lvl++
            reloadGame()
        }
    }
}

function foodRemoveAll() {
    while(foodList.length > 0) {
        if(foodListenerNum >= foodList.length) {
            foodListenerNum = 0
        }

        field.removeChild(field.children[foodListenerNum])
        foodList.splice(foodListenerNum, 1)
  
        foodListenerNum++
    }
}



//MOBS
function mobGenerate(x, y) {
    mobNum = 0
    while(mobNum < 5) {
        const newmob = document.createElement('div')
        newmob.classList.add('mob')
        field.append(newmob)
    
        x = Math.random() * (window.innerWidth - 140) + 70
        y = Math.random() * (window.innerHeight - 140) + 70
        while((x > (window.innerWidth/2 - ballWidth/2 - 100) && x < (window.innerWidth/2 + ballWidth/2 + 100))
            || (y > (window.innerHeight/2 - ballWidth/2 - 100) && y < (window.innerHeight/2 + ballHeight/2 + 100))) {
            x = Math.random() * (window.innerWidth - 140) + 70
            y = Math.random() * (window.innerHeight - 140) + 70
        }
        newmob.style.left = x + 'px'
        newmob.style.top = y + 'px'
        
        mobs.push({
            mobLeft: x,
            mobTop: y,
            mobWidth: 40,
            mobHeight: 40,
            speedX: mobSpeed[Math.round(Math.random())] * mobSpeedGrow,
            speedY: mobSpeed[Math.round(Math.random())] * mobSpeedGrow,
        })
        
        mobNum++
    }
}

function mobMove() {
    if(mobs.length > 0 && play === true) {
        mobMoveAnim = requestAnimationFrame(mobMove)
        
        if(mobListenerNum >= mobs.length) {
            mobListenerNum = 0
        }

        mobX = parseInt(mobs[mobListenerNum].mobLeft)
        mobY = parseInt(mobs[mobListenerNum].mobTop)
        mobStepX = mobs[mobListenerNum].speedX
        mobStepY = mobs[mobListenerNum].speedY

        if(mobX < 0 || (mobX + mobs[mobListenerNum].mobWidth) > window.innerWidth) {
            mobStepX = -mobStepX
            mobs[mobListenerNum].speedX = mobStepX
        }
        else if(mobY < 0 || (mobY + mobs[mobListenerNum].mobHeight) > window.innerHeight) {
            mobStepY = -mobStepY
            mobs[mobListenerNum].speedY = mobStepY
        }

        mobX += mobStepX
        mobY += mobStepY
        mobs[mobListenerNum].mobLeft = mobX + 'px'
        mobs[mobListenerNum].mobTop = mobY + 'px'

        field.children[mobListenerNum + foodList.length + 1].style.left = mobs[mobListenerNum].mobLeft
        field.children[mobListenerNum + foodList.length + 1].style.top = mobs[mobListenerNum].mobTop

        mobListenerNum++
    }
}

function mobIntersectCheck() {
    if(play === true) {
        mobIntersectAnim = requestAnimationFrame(mobIntersectCheck)

        if(mobListenerNum >= mobs.length) {
            mobListenerNum = 0
        }
        
        mobLeft = parseInt(mobs[mobListenerNum].mobLeft)
        mobTop = parseInt(mobs[mobListenerNum].mobTop)
        mobRight = mobLeft + mobs[mobListenerNum].mobWidth
        mobBottom = mobTop + mobs[mobListenerNum].mobHeight
            
        ballLeft = parseInt(field.children[0].style.left)
        ballTop = parseInt(field.children[0].style.top)
        ballRight = ballLeft + parseInt(field.children[0].style.width)
        ballBottom = ballTop + parseInt(field.children[0].style.height)
        
        if((mobLeft >= (ballLeft - 20) && mobTop >= (ballTop - 20)) && mobRight <= (ballRight + 20) && mobBottom <= (ballBottom + 20)) {
            mobIntersect = true

            alert('Game over')
            mobSpeedGrow = 1
            lvl = 1
            point = 0
            reloadGame()
            
        }
        else {
            mobIntersect = false
        }
        
        //console.log(mobIntersect)
        mobListenerNum++
    }
}

function mobRemove() {
    cancelAnimationFrame(mobMoveAnim)
    while(mobs.length > 0) {
        if(mobListenerNum >= mobs.length) {
            mobListenerNum = 0
        }

        field.removeChild(field.children[foodList.length + mobListenerNum])
        mobs.splice(mobListenerNum, 1)

        mobListenerNum++
    }
}