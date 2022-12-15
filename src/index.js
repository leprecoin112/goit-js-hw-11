import PixaBayApiService from './js/pixabay-api-service';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import imgCardMarkup from './js/img-card-markup';
import LoadMoreBtn from './js/load-more-btn';
import LoadMoreBtn from './js/load-more-btn';

const lightBoxOptions = {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
};

const lightbox = new SimpleLightbox('.gallery a', lightBoxOptions);

const ERROR_TEXT =
  'Sorry, there are no images matching your search query. Please try again.';

const pixaBayApiServices = new PixaBayApiService();

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', hidden: true });

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.btnEl.addEventListener('click', onloadMore);
async function onSearch(e) {
  e.preventDefault();
  loadMoreBtn.hide();
  pixaBayApiServices.query = e.target.searchQuery.value.trim();
  if (pixaBayApiServices.query === '') {
    warning();
    return;
  }
  try {
    pixaBayApiServices.resetPage();
    addLoadingSpinner();
    clearGallery();
    const images = await pixaBayApiServices.imagesByName();
    const totalHits = images.data.totalHits;
    console.log(images);
    if (totalHits === 0) {
      error();
      removeLoadingSpinner();
      return;
    }

    pixaBayApiServices.calcPage(totalHits);

    renderGallery(images.data);
    success(totalHits);
    removeLoadingSpinner();
    pixaBayApiServices.incrementPage();
    loadMoreBtn.show();
    lightbox.refresh();
  } catch (error) {
    console.log(error.message);
    pixaBayApiServices.resetPage();
    Notiflix.Notify.failure('Oops!');
  }
}

async function onloadMore() {
  if (!checkEndResults()) {
    return;
  }
  loadMoreBtn.disable();
  const images = await pixaBayApiServices.imagesByName();
  renderGallery(images.data);
  pixaBayApiServices.incrementPage();
  loadMoreBtn.enable();
  lightbox.refresh();
}

function checkEndResults() {
  if (pixaBayApiServices.page >= pixaBayApiServices.pages) {
    loadMoreBtn.hide();
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );

    return false;
  }

  return true;
}

function addLoadingSpinner() {
  refs.searchForm.classList.add('loading');
}

function removeLoadingSpinner() {
  refs.searchForm.classList.remove('loading');
}

function renderGallery({ hits }) {
  refs.gallery.insertAdjacentHTML(
    'beforeend',
    hits.map(imgCardMarkup).join('')
  );
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function success(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function error() {
  Notiflix.Notify.failure(ERROR_TEXT);
}

function warning() {
  Notiflix.Notify.warning('Enter data to continue searching');
}
