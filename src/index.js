import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkup } from './js/createMarkup';
import { scrollBy } from './js/scrollBy';
import { openModal } from './js/openModal';
import {getImages} from './js/getImages'

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

let currentPage = 1;
let queryParam;

searchFormEl.addEventListener('submit', onSearchFormEl);
loadMoreBtnEl.addEventListener('click', onLoadMore);

loadMoreBtnEl.setAttribute('hidden', true);

// Отримання зображень по сабміту
async function getGalleryBySubmit() {
  try {
    const resp = await getImages(queryParam);
    const arr = resp.data.hits;
    loadMoreBtnEl.removeAttribute('hidden');
      galleryEl.innerHTML = createMarkup(arr);
      if (!arr.length) {
          throw new Error('not found');
      } else {
          Notify.success(`Hooray! We found ${resp.data.totalHits} images.`);
    } 
      if (arr.length < 40) {
      loadMoreBtnEl.setAttribute('hidden', true);
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
      loadMoreBtnEl.setAttribute('hidden',true);
      Notify.success(`Hooray! We found ${resp.data.totalHits} images.`);
    }
    galleryEl.insertAdjacentHTML('beforeend', createMarkup(arr));
    scrollBy();

    const newGalleryItems = galleryEl.querySelectorAll('.gallery a');
    const lightbox = new SimpleLightbox(newGalleryItems);
    newGalleryItems.forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        lightbox.open(item.href);
      });
    });
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}

function onSearchFormEl(e) {
  e.preventDefault();
  queryParam = e.currentTarget.elements.searchQuery.value;
  galleryEl.innerHTML = '';
  if (!queryParam) {
    return Notify.warning('Please, fill the field');
  }
  getGalleryBySubmit(queryParam);
}



