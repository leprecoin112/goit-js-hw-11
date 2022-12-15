import axios from 'axios';
const BASE_URL =
  'https://pixabay.com/api/?key=32082026-7518fe05ec696c0df051a22ed';
export default class PixaBayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.pages = 0;
  }

  async imagesByName() {
    const res = await axios.get(
      `${BASE_URL}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    );

    return res;
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  calcPages(hits) {
    this.pages = Math.ceil(hits / 40);
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
