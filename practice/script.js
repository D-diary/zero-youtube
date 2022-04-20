;(function () {
  'use strict'

  const get = (target) => document.querySelector(target)
  const getAll = (target) => document.querySelectorAll(target)

  const $search = get('#search')
  const $list = getAll('.contents.list figure')
  const $searchButton = get('.btn_search')

  const init = () => {
    $search.addEventListener('keyup', search)
    $searchButton.addEventListener('click', search)
    for (let index = 0; index < $list.length; index++) {
      const $target = $list[index].querySelector('picture')
      $target.addEventListener('mouseover', onMouseOver)
      $target.addEventListener('mouseout', onMouseOut)
    }
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

  init()
})()
