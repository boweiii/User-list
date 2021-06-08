const baseUrl = 'https://lighthouse-user-api.herokuapp.com'
const indexUrl = baseUrl + '/api/v1/users/'
const dataPanel = document.querySelector('#data-panel')
let userArray = []
let userFiltered = []
const searchInput = document.querySelector('#search-input')
const searchButton = document.querySelector('#search-button')
const paginator = document.querySelector('#paginator')
const addButton = document.querySelector('.btn-add-favorite')

axios.get(indexUrl)
  .then(function (response) {
    // handle success
    console.log(response.data.results)
    userArray.push(...response.data.results)
    showUser(getUsersByPage(1))
    renderPaginator(userArray.length)
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })

//監聽使用者照片被點選
dataPanel.addEventListener('click', function onAvatarClick(event) {
  if (event.target.matches('.card-img-top')) {
    showUserModal(event.target.dataset.id)
  }
})

//監聽search Button
searchButton.addEventListener('click', (event) => {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  if (!keyword.length) {
    alert('請輸入有效之名稱')
  }
  userFiltered = userArray.filter(item => {
    return item.name.toLowerCase().trim().includes(keyword)
  })
  if (userFiltered.length === 0) {
    alert('查無此人')
  }
  showUser(getUsersByPage(1))
  renderPaginator(userFiltered.length)
})

//監聽分頁器
paginator.addEventListener('click', event => {
  let nowPage = event.target.innerText
  event.preventDefault()
  showUser(getUsersByPage(nowPage))
})

addButton.addEventListener('click', event => {
  addToFavorite(Number(event.target.dataset.id))
})

//Render Users
function showUser(users) {
  let userList = ''
  users.forEach(item => {
    if (item.gender === "male") {
      userList += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <a href="" data-toggle="modal" data-target="#user-modal"><img class="card-img-top border border-primary" data-id="${item.id}" src=${item.avatar} alt="Card image cap"></a>
            <div class="card-body d-flex text-align-center justify-content-center">
              <div>
                <h5 class="card-title">${item.name}</h5>
                <h6 class="card-age">${item.age}<span><i class="fas fa-male"></i></span></h6>
              </div>
            </div>
          </div>
        </div>
      </div>`
    } else if (item.gender === "female") {
      userList += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <a href="" data-toggle="modal" data-target="#user-modal"><img class="card-img-top border border-danger" data-id="${item.id}" src=${item.avatar} alt="Card image cap"></a>
            <div class="card-body d-flex text-align-center justify-content-center">
              <div>
                <h5 class="card-title">${item.name}</h5>
                <h6 class="card-age">${item.age}<span><i class="fas fa-female"></i></span></h6>
              </div>
            </div>
          </div>
        </div>
      </div>`
    }

  })
  dataPanel.innerHTML = userList
}

//Render Paginator
function renderPaginator(amount) {
  let paginatorList = ''
  for (let page = 1; page <= Math.ceil(amount / 12); page++) {
    paginatorList += `<li class="page-item"><a class="page-link" href="#">${page}</a></li>`
  }
  paginator.innerHTML = paginatorList
}

//點選頁碼後對應生成的資料們，回傳為陣列
function getUsersByPage(page) {
  const data = userFiltered.length ? userFiltered : userArray
  const startIndex = (page - 1) * 12
  const endIndex = page * 12
  return data.slice(startIndex, endIndex)
}

//彈出使用者資訊
function showUserModal(id) {
  const modalTitle = document.querySelector('#user-modal-title')
  const modalImage = document.querySelector('#user-modal-image')
  const modalDate = document.querySelector('#user-modal-date')
  const modalEmail = document.querySelector('#user-modal-email')
  const modalSurname = document.querySelector('#user-modal-surname')
  const modalRegion = document.querySelector('#user-modal-region')

  axios.get(indexUrl + id)
    .then(function (response) {
      // handle success
      console.log(response.data)
      const data = response.data
      modalTitle.innerText = 'Name : ' + data.name
      modalImage.innerHTML = `<img src=${data.avatar} class="w-100" alt="">`
      modalDate.innerText = 'Birthday : ' + data.birthday
      modalEmail.innerText = 'Email : ' + data.email
      modalSurname.innerText = 'Surname : ' + data.surname
      modalRegion.innerText = 'Region : ' + data.region
      addButton.dataset.id = response.data.id
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
}

function addToFavorite(id) {
  let favoriteUser = JSON.parse(localStorage.getItem('favoriteUser')) || []
  if (favoriteUser.some(user => user.id === id)) {
    alert('已新增過此使用者')
  } else {
    favoriteUser.push(userArray.find(user => user.id === id))
  }
  localStorage.setItem('favoriteUser', JSON.stringify(favoriteUser))
  $('#user-modal').modal('hide')
}
