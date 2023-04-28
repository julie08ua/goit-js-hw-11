import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

let currentPage = 1;
let queryParam;

searchFormEl.addEventListener('submit', onSearchFormEl);
loadMoreBtnEl.addEventListener('click', onLoadMore);

loadMoreBtnEl.setAttribute('hidden', true);

// Сабміт форми
function onSearchFormEl(e) {
  e.preventDefault();
  queryParam = e.currentTarget.elements.searchQuery.value;
  galleryEl.innerHTML = '';
  if (!queryParam) {
    return Notify.warning('Please, fill the field');
  }
  getGalleryBySubmit(queryParam);
}

// Отримання зображень по сабміту
async function getGalleryBySubmit() {
  try {
    const resp = await getImages(queryParam);
    const arr = resp.data.hits;
      galleryEl.innerHTML = createMarkup(arr);
      loadMoreBtnEl.removeAttribute('hidden');
      if (!arr.length) {
          throw new Error('not found');
      } else if (arr.length) {
          Notify.success(`Hooray! We found ${resp.data.totalHits} images.`);
      } else if (arr.length >= 40){
          
      } else {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
    openModal();
    scrollBy();
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    galleryEl.innerHTML = '';
    } 
    searchFormEl.reset();
}

// Отримання зображень по кліку
function onLoadMore() {
  currentPage += 1;
  getGalleryByClick(queryParam, currentPage);
}

async function getGalleryByClick() {
  try {
    const resp = await getImages(queryParam, currentPage);
    const arr = resp.data.hits;
    if (currentPage * 40 > resp.data.totalHits) {
      loadMoreBtnEl.removeAttribute('hidden');
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
    galleryEl.insertAdjacentHTML('beforeend', createMarkup(arr));
    scrollBy();

    const newGalleryItems = galleryEl.querySelectorAll('.gallery a');
    newGalleryItems.forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        lightbox.open(item.href);
      });
    });
    refreshImageModal();
  } catch (error) {
    console.log(error);
  }
}

// Створення розмітки картки
function createMarkup(arr) {
  return arr.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads
    }) => {
      return `<div class="photo-card">
  <a href="${largeImageURL}">
  <img
  src="${webformatURL}" 
  alt="${tags}" 
  loading="lazy" 
  width= 320
  height=220>
  
  <div class="info">
    <p class="info-item">
      <b>Likes </b>${likes}
    </p>
    <p class="info-item">
      <b>Views </b>${views}
    </p>
    <p class="info-item">
      <b>Comments </b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads </b>${downloads}
    </p>
  </div>
  </a>
</div>
`
    })
    .join('');
}

// Отримання зображень
async function getImages(queryParam, page = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY_API = '35856796-45f142b26b414f7fc23da79d0';
  return await axios.get(
    `${BASE_URL}?key=${KEY_API}&q=${queryParam}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
}

// Модалка
function openModal() {
  let simpleLightBox = new SimpleLightbox('.gallery a').refresh();
}

// Скролл
 function scrollBy() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}