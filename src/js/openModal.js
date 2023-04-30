import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

export function openModal() {
  let simpleLightBox = new SimpleLightbox('.gallery a').refresh();
}
