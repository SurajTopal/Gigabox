import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS } from '../utils/colors';

interface MapViewProps {
  storeLat?: number;
  storeLng?: number;
  deliveryLat?: number;
  deliveryLng?: number;
  storeAddress?: string;
  deliveryAddress?: string;
  height?: number;
  apiKey?: string;
  onMessage?: (event: any) => void;
  phase?: 'waiting' | 'moving' | 'delivered';
}

export default function MapView({
  storeLat = 13.041468,
  storeLng = 77.611759,
  deliveryLat = 13.0378463,
  deliveryLng = 77.6158119,
  storeAddress = 'Top N Top Salon',
  deliveryAddress = 'Indian Luxury PG',
  height = 300,
  apiKey = 'AIzaSyCQ6GQhUa7OC2T6pTEozwVq-FCu3bRLMac',
  onMessage,
  phase = 'moving',
}: MapViewProps) {
  // Rebuilding this string hands the WebView a new source and restarts the
  // animation, so it must only change when the route itself does.
  const htmlContent = useMemo(
    () => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=routes"></script>
      <style>
        * { margin: 0; padding: 0; }
        html, body { height: 100%; width: 100%; }
        .map-wrap { position: relative; width: 100%; height: calc(100% - 70px); }
        #map { width: 100%; height: 100%; }
        .progress-pill {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.95);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #065f46;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
          white-space: nowrap;
          z-index: 5;
        }
        .legend {
          padding: 12px 16px;
          background: white;
          font-size: 13px;
          border-top: 1px solid #e5e7eb;
          box-sizing: border-box;
          display: flex;
          gap: 20px;
        }
        .location {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }
        .marker {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .store { background: #667eea; }
        .delivery { background: #10b981; }
        .route-info {
          font-size: 12px;
          color: #667eea;
          font-weight: 600;
          margin-top: 6px;
        }
      </style>
    </head>
    <body>
      <div class="map-wrap">
        <div id="map"></div>
        <div class="progress-pill">🚲 Starting…</div>
      </div>
      <div class="legend">
        <div class="location">
          <div class="marker store"></div>
          <span><strong>Store:</strong> ${storeAddress}</span>
        </div>
        <div class="location">
          <div class="marker delivery"></div>
          <span><strong>Delivery:</strong> ${deliveryAddress}</span>
        </div>
        <div class="route-info">Loading route...</div>
      </div>
      <script>
        const PHASE = '${phase}';
        const storeLocation = { lat: ${storeLat}, lng: ${storeLng} };
        const deliveryLocation = { lat: ${deliveryLat}, lng: ${deliveryLng} };
        const centerLat = (${storeLat} + ${deliveryLat}) / 2;
        const centerLng = (${storeLng} + ${deliveryLng}) / 2;

        const map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: { lat: centerLat, lng: centerLng },
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false
        });

        // Handle map interaction for scroll control
        let isMapInteracting = false;

        map.addListener('dragstart', () => {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'disableScroll' }));
          }
          isMapInteracting = true;
        });

        map.addListener('dragend', () => {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'enableScroll' }));
          }
          isMapInteracting = false;
        });

        map.addListener('zoom_changed', () => {
          if (!isMapInteracting && window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'disableScroll' }));
            setTimeout(() => {
              window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'enableScroll' }));
            }, 500);
          }
        });

        // Store marker
        new google.maps.Marker({
          position: storeLocation,
          map: map,
          title: '${storeAddress}',
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

        // Delivery marker
        new google.maps.Marker({
          position: deliveryLocation,
          map: map,
          title: '${deliveryAddress}',
          icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        });

        // Directions Service for real route
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map: map,
          polylineOptions: {
            strokeColor: '#667eea',
            strokeOpacity: 0.8,
            strokeWeight: 4
          },
          suppressMarkers: true
        });

        // Bike marker with custom icon
        const bikeIcon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#FCD34D',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2
        };

        const bikeMarker = new google.maps.Marker({
          position: storeLocation,
          map: map,
          title: 'Delivery Bike 🚲',
          icon: bikeIcon,
          zIndex: google.maps.Marker.MAX_ZINDEX + 1
        });

        // Drawn over the full blue route to show how much has been covered.
        const traveledPath = new google.maps.Polyline({
          map: map,
          path: [],
          strokeColor: '#10b981',
          strokeOpacity: 1,
          strokeWeight: 6,
          zIndex: 2
        });

        function formatDistance(meters) {
          return meters < 1000
            ? Math.round(meters) + ' m'
            : (meters / 1000).toFixed(1) + ' km';
        }

        let polylinePoints = [];
        let bikeProgress = 0;
        let totalDistance = 0; // in meters
        const BIKE_SPEED_KMH = 200;
        const UPDATE_INTERVAL = 200; // Update every 200ms for smooth motion

        // Function to decode polyline (Google's algorithm)
        function decodePolyline(encoded) {
          const points = [];
          let index = 0, lat = 0, lng = 0;

          while (index < encoded.length) {
            let result = 0;
            let shift = 0;
            let byte;

            do {
              byte = encoded.charCodeAt(index++) - 63;
              result |= (byte & 0x1f) << shift;
              shift += 5;
            } while (byte >= 0x20);

            let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            result = 0;
            shift = 0;

            do {
              byte = encoded.charCodeAt(index++) - 63;
              result |= (byte & 0x1f) << shift;
              shift += 5;
            } while (byte >= 0x20);

            let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            points.push(new google.maps.LatLng(lat / 1e5, lng / 1e5));
          }
          return points;
        }

        // Function to calculate distance between two coordinates
        function haversineDistance(p1, p2) {
          const R = 6371; // Earth's radius in km
          const dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
          const dLng = (p2.lng() - p1.lng()) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
                    Math.sin(dLng/2) * Math.sin(dLng/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          return R * c * 1000; // Return in meters
        }

        directionsService.route(
          {
            origin: storeLocation,
            destination: deliveryLocation,
            travelMode: google.maps.TravelMode.DRIVING
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(result);

              // Get route info
              const route = result.routes[0];
              const distance = route.legs[0].distance.text;
              const distanceMeters = route.legs[0].distance.value;
              const duration = route.legs[0].duration.text;

              // Update legend with route info
              const infoEl = document.querySelector('.route-info');
              if (infoEl) {
                infoEl.innerText = '📍 ' + distance + ' • ' + duration;
              }

              // Extract waypoints from polyline (follows actual road)
              const waypoints = [];
              route.legs.forEach(leg => {
                leg.steps.forEach(step => {
                  // Decode polyline for each step to get detailed path
                  const stepPoints = decodePolyline(step.polyline.points);
                  stepPoints.forEach(point => {
                    waypoints.push({
                      lat: point.lat(),
                      lng: point.lng()
                    });
                  });
                });
              });

              console.log('Waypoints extracted:', waypoints.length);
              console.log('Total distance:', distanceMeters, 'meters');

              const progressPill = document.querySelector('.progress-pill');

              if (PHASE !== 'moving') {
                // Not en route: park the bike at whichever end matches the phase
                // and skip the animation entirely.
                const done = PHASE === 'delivered';
                const at = done ? waypoints[waypoints.length - 1] : waypoints[0];
                bikeMarker.setPosition(new google.maps.LatLng(at.lat, at.lng));
                if (done) {
                  traveledPath.setPath(
                    waypoints.map(p => new google.maps.LatLng(p.lat, p.lng))
                  );
                }
                if (progressPill) {
                  progressPill.innerText = done
                    ? '✅ Delivered • ' + formatDistance(distanceMeters) + ' covered'
                    : '📦 Packing your order';
                }
              } else if (waypoints.length > 1) {
                // Calculate total time in milliseconds
                totalDistance = distanceMeters;
                const totalTimeMs = (totalDistance / 1000 / BIKE_SPEED_KMH) * 3600 * 1000;

                console.log('Total time:', totalTimeMs / 1000, 'seconds');

                const progressEl = document.querySelector('.progress-pill');
                let startTime = Date.now();
                let isAnimating = true;

                // Confirmed waypoints behind the bike; the moving head is appended
                // each tick rather than rebuilding the whole array.
                let coveredIndex = 0;
                let coveredPath = [new google.maps.LatLng(waypoints[0].lat, waypoints[0].lng)];

                const animateBike = setInterval(() => {
                  if (!isAnimating) {
                    clearInterval(animateBike);
                    return;
                  }

                  const elapsedMs = Date.now() - startTime;
                  const progress = elapsedMs / totalTimeMs;

                  if (progress >= 1) {
                    // Arrived: settle on the destination and stop for good.
                    isAnimating = false;
                    clearInterval(animateBike);

                    const last = waypoints[waypoints.length - 1];
                    const end = new google.maps.LatLng(last.lat, last.lng);
                    bikeMarker.setPosition(end);
                    traveledPath.setPath(
                      waypoints.map(p => new google.maps.LatLng(p.lat, p.lng))
                    );

                    if (progressEl) {
                      progressEl.innerText =
                        '✅ Delivered • ' + formatDistance(totalDistance) + ' covered';
                    }

                    if (window.ReactNativeWebView) {
                      window.ReactNativeWebView.postMessage(
                        JSON.stringify({ action: 'delivered' })
                      );
                    }
                    return;
                  }

                  // Calculate waypoint index based on progress
                  const currentWaypointIndex = progress * (waypoints.length - 1);
                  const index = Math.floor(currentWaypointIndex);
                  const nextIndex = Math.min(index + 1, waypoints.length - 1);
                  const fraction = currentWaypointIndex - index;

                  if (index < waypoints.length) {
                    const current = waypoints[index];
                    const next = waypoints[nextIndex];

                    // Interpolate position
                    const lat = current.lat + (next.lat - current.lat) * fraction;
                    const lng = current.lng + (next.lng - current.lng) * fraction;
                    const head = new google.maps.LatLng(lat, lng);

                    bikeMarker.setPosition(head);

                    while (coveredIndex < index) {
                      coveredIndex++;
                      coveredPath.push(
                        new google.maps.LatLng(waypoints[coveredIndex].lat, waypoints[coveredIndex].lng)
                      );
                    }
                    traveledPath.setPath(coveredPath.concat([head]));

                    if (progressEl) {
                      const coveredMeters = progress * totalDistance;
                      progressEl.innerText =
                        '🚲 ' + formatDistance(coveredMeters) +
                        ' of ' + formatDistance(totalDistance) + ' covered';
                    }
                  }
                }, UPDATE_INTERVAL);
              } else {
                console.log('Not enough waypoints to animate');
              }
            }
          }
        );
      </script>
    </body>
    </html>
  `,
    [
      apiKey,
      storeLat,
      storeLng,
      deliveryLat,
      deliveryLng,
      storeAddress,
      deliveryAddress,
      phase,
    ],
  );

  const source = useMemo(() => ({ html: htmlContent }), [htmlContent]);

  return (
    <View style={[styles.container, { height }]}>
      {apiKey === 'YOUR_GOOGLE_MAPS_API_KEY' ? (
        <View style={styles.noKeyContainer}>
          <Text style={styles.noKeyTitle}>⚠️ API Key Required</Text>
          <Text style={styles.noKeyText}>
            Pass your Google Maps API key to enable the map.
          </Text>
          <Text style={styles.noKeySmall}>
            How to get it: Google Cloud Console → Enable Maps JavaScript API → Create API Key
          </Text>
        </View>
      ) : (
        <WebView
          source={source}
          style={styles.webView}
          scrollEnabled={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onMessage={onMessage}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  webView: {
    flex: 1,
  },
  noKeyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fef3c7',
  },
  noKeyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  noKeyText: {
    fontSize: 14,
    color: '#b45309',
    textAlign: 'center',
    marginBottom: 12,
  },
  noKeySmall: {
    fontSize: 12,
    color: '#a16207',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
