;(function () {
  'use strict'

  const get = (target) => document.querySelector(target)
  const getAll = (target) => document.querySelectorAll(target)

  const $search = get('#search')
  const $list = getAll('.contents.list figure')
  const $searchButton = get('.btn_search')

  const $player = get('.view video')
  const $btnPlay = get('.js-play')
  const $btnReplay = get('.js-replay')
  const $btnStop = get('.js-stop')
  const $btnMute = get('.js-mute')
  const $progress = get('.js-progress')
  const $volume = get('.js-volume')
  const $fullScreen = get('.js-fullScreen')

  const init = () => {
    $search.addEventListener('keyup', search)
    $searchButton.addEventListener('click', search)
    for (let index = 0; index < $list.length; index++) {
      const $target = $list[index].querySelector('picture')
      $target.addEventListener('mouseover', onMouseOver)
      $target.addEventListener('mouseout', onMouseOut)
    }

    for (let index = 0; index < $list.length; index++) {
      $list[index].addEventListener('click', hashChange)
    }

    window.addEventListener('hashchange', () => {
      const isView = -1 < window.location.hash.indexOf('view')
      if (isView) {
        getViewPage()
      } else {
        getListPage()
      }
    })
    // init에 다있으면 어지러워서 따로 선언
    viewPageEvent()
  }



  const search = () => {
    let searchText = $search.value.toLowerCase()
    for (let index = 0; index < $list.length; index++) {
      const $target = $list[index].querySelector('strong')
      const text = $target.textContent.toLowerCase()
      if(-1 < text.indexOf(searchText)) {
        $list[index].style.display = 'flex'
      } else {
        $list[index].style.display = 'none'
      }
    }
  }

  const onMouseOver = (e) => {
    const webpPlay = e.target.parentNode.querySelector('source')
    webpPlay.setAttribute('srcset', './assets/sample.webp')
  }

  const onMouseOut = (e) => {
    const webpPlay = e.target.parentNode.querySelector('source')
    webpPlay.setAttribute('srcset', './assets/sample.jpg')
  }

  const hashChange = (e) => {
    e.preventDefault() // a링크거나 submit요소를 취소해줌
    const parentNode = e.target.closest('figure') // 리스트를 클릭했을때 가장 가까운 figure는 그 리스트에 포함된 figure
    const viewTitle = parentNode.querySelector('strong').textContent
    window.location.hash = `view&${viewTitle}`
  }
  // 해시 값에 view글자와 viewTitle을 넣었는데 왜 인코딩이 되었나
  const getViewPage = () => {
    const viewTitle = get('.view strong')
    // console.log('before', window.location.hash.split('&')[1])
    // before Lorem%20Ipsum%20Powerful%20movie
    const urlTitle = decodeURI(window.location.hash.split('&')[1])
    // console.log('after', urlTitle)
    // Lorem Ipsum Powerful movie
    viewTitle.innerText = urlTitle

    get('.list').style.display = 'none'
    get('.view').style.display = 'flex'
  }

  const getListPage = () => {
    get('.list').style.display = 'flex'
    get('.view').style.display = 'none'
  }

  const buttonChange = (btn, value) => {
    btn.innerHTML = value
  }

  const viewPageEvent = () => {
    $volume.addEventListener('change', (e) => {
      $player.volume = e.target.value
    })

    $player.addEventListener('timeupdate', setProgress)
    $player.addEventListener('play', buttonChange($btnPlay, 'pause'))
    $player.addEventListener('pause', buttonChange($btnPlay, 'play'))
    $player.addEventListener('volumechange', () => {
      $player.muted
        ? buttonChange($btnMute, 'unmute')
        : buttonChange($btnMute, 'mute')
    })
    $player.addEventListener('ended', $player.pause())
    $progress.addEventListener('click', getCurrent)
    $btnPlay.addEventListener('click', playVideo)
    $btnReplay.addEventListener('click', replayVideo)
    $btnStop.addEventListener('click', stopVideo)
    $btnMute.addEventListener('click', mute)
    $fullScreen.addEventListener('click', fullScreen)
  }

  const getCurrent = (e) => {
    let percent = e.offsetX / $progress.offsetWidth
    $player.currentTime = percent * $player.duration 
    e.target.value = Math.floor(percent / 100) //
    console.log($player.duration)
  }

  const setProgress = () => {
    let percentage = Math.floor((100 / $player.duration) * $player.currentTime) // 100 왜나눔
    $progress.value = percentage 
  }

  const playVideo = () => {
    if ($player.paused || $player.ended) {
      buttonChange($btnPlay, 'pause')
      $player.play()
    } else {
      buttonChange($btnPlay, 'play')
      $player.pause()
    }
  }

  const stopVideo = () => {
    $player.pause()
    $player.currentTime = 0
    buttonChange($btnPlay, 'play')
  }

  const resetPlayer = () => {
    $progress.value = 0
    $player.currentTime = 0
  }

  const replayVideo = () => {
    resetPlayer()
    $player.play()
    buttonChange($btnPlay, 'pause')
  }

  const mute = () => {
    if ($player.muted) {
      buttonChange($btnMute, 'mute')
      $player.muted = false
    } else {
      buttonChange($btnMute, 'unmute')
      $player.muted = true
    }
  }

  const fullScreen = () => {
    if ($player.requestFullscreen) {
      if (document.fullscreenElement) {
        document.cancelFullScreen()
      } else {
        $player.requestFullscreen()
      }
    } else if ($player.msRequestFullscreen) {
      if (document.msRequestFullscreen) {
        document.msExitFullscreen()
      } else {
        $player.msRequestFullscreen()
      }
    } else {
      alert("Not Supported")
    }
  }

  init()
})()
