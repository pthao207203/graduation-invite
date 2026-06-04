import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // react-leaflet v5 + React 19 crashes under StrictMode's dev-only
  // mount→unmount→remount probe: Leaflet's map.remove() destroys the map
  // panes, then <TileLayer> throws "Cannot read properties of undefined
  // (reading 'appendChild')" when it tries to re-attach. StrictMode only
  // double-invokes in development, so disabling it doesn't change production.
  reactStrictMode: false,
};

export default nextConfig;
