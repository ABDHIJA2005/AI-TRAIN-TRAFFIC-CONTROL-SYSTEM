import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// You need to replace this with your actual Mapbox access token
// Do not hardcode this in a public repository. Use environment variables.
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

export default function TrackMap() {
  const mapContainerRef = useRef(null);
  const map = useRef(null);
  const [tracks, setTracks] = useState([]);
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    // Initialize map
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [78.6569, 11.2319], // Initial center (e.g., a location in India)
      zoom: 5
    });

    map.current.on('load', () => {
      // Add a GeoJSON source for the tracks
      map.current.addSource('tracks-data', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      // Add a line layer for the tracks
      map.current.addLayer({
        id: 'tracks-layer',
        type: 'line',
        source: 'tracks-data',
        paint: {
          'line-color': [
            'case',
            ['>', ['get', 'currentOccupancy'], 0], '#FF0000', // Red for occupied
            '#008000' // Green for unoccupied
          ],
          'line-width': 4
        }
      });
      
      // Add a GeoJSON source for the trains
      map.current.addSource('trains-data', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      // Add a symbol layer for the trains
      map.current.addLayer({
        id: 'trains-layer',
        type: 'symbol',
        source: 'trains-data',
        layout: {
          'icon-image': 'rail-light', // A built-in Mapbox icon for railways
          'icon-allow-overlap': true
        }
      });
    });
    
    // Cleanup on component unmount
    return () => map.current.remove();
  }, []);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const [tracksRes, trainsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/tracks'),
          axios.get('http://localhost:5000/api/trains')
        ]);
        setTracks(tracksRes.data);
        setTrains(trainsRes.data);
      } catch (err) {
        console.error("Failed to fetch map data:", err);
      }
    };
    
    // Fetch data on initial load and every 5 seconds
    fetchMapData();
    const interval = setInterval(fetchMapData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    // Update track data source
    const trackFeatures = tracks.map(track => ({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [track.startLocation.longitude, track.startLocation.latitude],
          [track.endLocation.longitude, track.endLocation.latitude]
        ]
      },
      properties: {
        sectionId: track.sectionId,
        currentOccupancy: track.currentOccupancy
      }
    }));
    map.current.getSource('tracks-data').setData({
      type: 'FeatureCollection',
      features: trackFeatures
    });
    
    // Update train data source
    const trainFeatures = trains
      .filter(train => train.currentLocation && train.currentLocation.latitude !== 0)
      .map(train => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [train.currentLocation.longitude, train.currentLocation.latitude]
        },
        properties: {
          title: train.name,
          status: train.status
        }
      }));
    map.current.getSource('trains-data').setData({
      type: 'FeatureCollection',
      features: trainFeatures
    });
  }, [tracks, trains]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Live Railway Map</h2>
      <div ref={mapContainerRef} className="w-full h-[600px] rounded-2xl shadow-lg" />
    </div>
  );
}