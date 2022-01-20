/**
 * role guard used as middleware
 * @param {*} role specify which role will have access the pages
 * it can be a single string, like "user" , or an array of roles
 * like ["CUSTOMER", "ADMIN", "STAFF", "GUEST"]
 * @returns
 */
export const roleGuard = (roles) => (context) => {
  console.log('init role guard')
  if (!Array.isArray(roles)) roles = [roles]
  // the "GUEST" role will be considered as no "user"
  // no roles param -> open route
  if (
    !roles.length ||
    (roles.includes('GUEST') && !context.$auth.user) ||
    (context.$auth.user && roles.includes(context.$auth.user.role))
  ) {
    return
  }
  if (
    context.$auth.user &&
    ['ADMIN', 'STAFF'].includes(context.$auth.user.role)
  )
    return context.redirect('/dashboard')
  context.redirect('/')
}

export const imageZoom = (imgID, resultID, lensID) => {
  // source image for zoom
  const img = document.getElementById(imgID)
  // result div
  const result = document.getElementById(resultID)
  // create a lens
  const lens = document.getElementById(lensID)
  // lens.setAttribute('class', 'img-zoom-lens')
  lens.style.height = img.offsetHeight * 0.2 + 'px'
  lens.style.width = img.offsetWidth * 0.2 + 'px'
  // insert lens
  // img.parentElement.insertBefore(lens, img)
  // calculate the ratio between result div and the lens
  let cx = result.offsetWidth / lens.offsetWidth
  let cy = result.offsetHeight / lens.offsetHeight
  // set background properties for the result DIV:*/
  result.style.backgroundImage = "url('" + img.src + "')"
  result.style.backgroundSize = img.width * cx + 'px ' + img.height * cy + 'px'
  // add mousemove and wheel event
  lens.addEventListener('mousemove', moveLens)
  lens.addEventListener('wheel', zoomLens)
  img.addEventListener('mousemove', moveLens)
  lens.addEventListener('mouseout', (event) => {
    lens.style.visibility = 'hidden'
    result.style.visibility = 'hidden'
  })
  img.addEventListener('mouseover', () => {
    lens.style.visibility = 'visible'
    result.style.visibility = 'visible'
  })
  function moveLens(e) {
    let x, y
    e.preventDefault()
    // get the cursor's x and y positions
    const pos = getCursorPos(e)
    // calculate the position of the lens
    // position here mean the top-left of the lens
    x = pos.x - lens.offsetWidth / 2
    y = pos.y - lens.offsetHeight / 2
    // prevent the lens from being positioned outside the image
    if (x > img.width - lens.offsetWidth) {
      x = img.width - lens.offsetWidth
    }
    if (x < 0) {
      x = 0
    }
    if (y > img.height - lens.offsetHeight) {
      y = img.height - lens.offsetHeight
    }
    if (y < 0) {
      y = 0
    }
    // set new position
    lens.style.left = x + 'px'
    lens.style.top = y + 'px'
    // display what the lens "sees"
    result.style.backgroundPosition = '-' + x * cx + 'px -' + y * cy + 'px'
  }
  function getCursorPos(e) {
    let x = 0
    let y = 0
    e = e || window.event
    // get the x and y positions of the image
    const a = img.getBoundingClientRect()
    // calculate the cursor's x and y coordinates, relative to the image
    x = e.pageX - a.left
    y = e.pageY - a.top
    // consider any page scrolling
    x = x - window.pageXOffset
    y = y - window.pageYOffset
    return { x, y }
  }
  function zoomLens(event) {
    event.preventDefault()
    // get the image size
    const { height: imgHeight } = img.getBoundingClientRect()
    // set scale base on wheel direction
    const scale = event.deltaY > 0 ? -0.04 : 0.04
    // get the current ratio between image and the lens
    const currentRatio = lens.offsetHeight / imgHeight
    // set new lens size base on new ratio
    let newRatio = currentRatio + scale
    if (newRatio < 0.1) newRatio = 0.1
    if (newRatio > 1) newRatio = 1
    lens.style.height = img.offsetHeight * newRatio + 'px'
    lens.style.width = img.offsetWidth * newRatio + 'px'
    // re-calculate ratio between lens and result div
    cx = result.offsetWidth / lens.offsetWidth
    cy = result.offsetHeight / lens.offsetHeight

    // repeat calculate lens view
    const pos = getCursorPos(event)
    // calculate the position of the lens
    let x = pos.x - lens.offsetWidth / 2
    let y = pos.y - lens.offsetHeight / 2
    // prevent the lens from being positioned outside the image
    if (x > img.width - lens.offsetWidth) {
      x = img.width - lens.offsetWidth
    }
    if (x < 0) {
      x = 0
    }
    if (y > img.height - lens.offsetHeight) {
      y = img.height - lens.offsetHeight
    }
    if (y < 0) {
      y = 0
    }
    lens.style.left = x + 'px'
    lens.style.top = y + 'px'
    result.style.backgroundPosition = '-' + x * cx + 'px -' + y * cy + 'px'
    result.style.backgroundSize =
      img.width * cx + 'px ' + img.height * cy + 'px'
  }
}

export const priceFormat = (price) => {
  return price.toLocaleString().replaceAll(',', '.')
}

export const afterDiscount = (price, discountPercent) =>
  discountPercent
    ? Math.round((price * (1 - discountPercent / 100)) / 100) * 100
    : price

/**
 *
 * @param {*} date Date string
 * @returns Date string with locale format
 */
export const getTimeFormat = (date) => new Date(date).toLocaleString()
