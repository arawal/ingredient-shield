'use client';

import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onClose?: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    // Initialize the code reader
    codeReaderRef.current = new BrowserMultiFormatReader();

    // Get available cameras
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        // Select the back camera by default (usually the last device)
        if (videoDevices.length > 0) {
          setSelectedDevice(videoDevices[videoDevices.length - 1].deviceId);
        }
      })
      .catch(err => setError('Error accessing camera: ' + err.message));

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  const startScanning = async () => {
    if (!videoRef.current || !selectedDevice || !codeReaderRef.current) {
      setError('Camera not available');
      return;
    }

    try {
      setIsScanning(true);
      setError('');

      await codeReaderRef.current.decodeFromVideoDevice(
        selectedDevice, 
        videoRef.current,
        (result, err) => {
          if (result) {
            onScan(result.getText());
            // Optionally stop scanning after successful scan
            // stopScanning();
          }
          if (err && !(err instanceof NotFoundException)) {
            setError('Scanning error: ' + err.message);
          }
        }
      );
    } catch (err) {
      setError('Failed to start scanning: ' + (err as Error).message);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      setIsScanning(false);
    }
  };

  const switchCamera = (deviceId: string) => {
    stopScanning();
    setSelectedDevice(deviceId);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-64 bg-black rounded-lg"
        />
        <div className="absolute top-2 right-2 space-x-2">
          {onClose && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {devices.length > 1 && (
          <select
            className="w-full p-2 border rounded"
            value={selectedDevice}
            onChange={(e) => switchCamera(e.target.value)}
          >
            {devices.map((device, index) => (
              <option key={device.deviceId} value={device.deviceId}>
                Camera {index + 1} ({device.label || `Device ${index + 1}`})
              </option>
            ))}
          </select>
        )}

        <div className="flex justify-center space-x-2">
          {!isScanning ? (
            <Button onClick={startScanning}>
              Start Scanning
            </Button>
          ) : (
            <Button variant="secondary" onClick={stopScanning}>
              Stop Scanning
            </Button>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}