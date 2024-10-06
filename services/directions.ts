const BASE_URL = 'https://maps.googleapis.com/maps/api/directions/json';

export async function getDirections(from, to) {
  const response = await fetch(
    `${BASE_URL}?origin=${from[0]},${from[1]}&destination=${to[0]},${to[1]}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
  );
  const json = await response.json();
  return json;
}
