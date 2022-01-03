const postsContainerDOM = document.querySelector('#posts-container')
const loaderContainerDOM = document.querySelector('.loader')
const inputFilterDOM = document.querySelector('#filter')

let pagina = 1

const pegarPosts = async () => {
  const resposta = await
  fetch(`https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${pagina}`)
  return resposta.json()
}

const gerarPostsTemplate = posts => posts.map(({
  id,
  title,
  body
}) => `
  <div class="post">
    <div class="number">${id}</div>
    <div class="post-info">
        <h2 class="post-title">${title}</h2>
        <p class="post-body">${ body}</p>
      </div>
    </div>
`).join('')

const addPostsEmDOM = async () => {
  const posts = await pegarPosts()
  const postsTemplate = gerarPostsTemplate(posts)

  postsContainerDOM.innerHTML += postsTemplate
}

const pegarProximoPosts = () => {
  setTimeout(() => {
    pagina++
    addPostsEmDOM()
  }, 300)
}

const mostrarLoader = () => {
  loaderContainerDOM.classList.add('show')
  removeLoader()
}

const removeLoader = () => {
  setTimeout(() => {
    loaderContainerDOM.classList.remove('show')
    pegarProximoPosts()
  }, 1000)
}

const lidarComScrollEmBaixoPagina = () => {
  const {
    clientHeight,
    scrollHeight,
    scrollTop
  } = document.documentElement
  const parteInferiorDaPaginaQuaseFim = scrollTop + clientHeight >=
    scrollHeight - 10

  if (parteInferiorDaPaginaQuaseFim) {
    mostrarLoader()
  }
}

//closures 
const mostrarValorDeEntradaInput = inputValor => post => {
  const postTitle = post.querySelector('.post-title').textContent.toLocaleLowerCase()
  const postBody = post.querySelector('.post-body').textContent.toLocaleLowerCase()

  if (postTitle.includes(inputValor) ||
    postBody.includes(inputValor)) {
    post.style.display = 'flex'
    return
  }
  post.style.display = 'none'
}

//objeto event
const handleInputValue = event => {
  const inputValor = event.target.value
  const posts = document.querySelectorAll('.post')

  posts.forEach(mostrarValorDeEntradaInput(inputValor))
}

addPostsEmDOM()

window.addEventListener('scroll', lidarComScrollEmBaixoPagina)
inputFilterDOM.addEventListener('input', handleInputValue)