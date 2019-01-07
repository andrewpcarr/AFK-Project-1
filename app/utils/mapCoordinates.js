let coordinatesArray = [];

export function updateCoordinatesArray(latLongArray) {
  coordinatesArray.push(latLongArray);
}

export function getMapCoordinates() {
  return coordinatesArray;
}

export function emptyCoordinatesArray() {
  coordinatesArray = [];
}
