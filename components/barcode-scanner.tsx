'use client';

import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';

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

  const [manualInput, setManualInput] = useState('');
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if device has a camera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => setHasCamera(true))
      .catch(() => setHasCamera(false));
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScan(manualInput.trim());
    }
  };

  if (hasCamera === false) {
    return (
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              No camera detected or camera access was denied.
            </p>
            <p className="text-sm text-muted-foreground">
              You can manually enter the barcode number:
            </p>
          </div>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode Number</Label>
              <Input
                id="barcode"
                placeholder="Enter barcode number"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Check Product
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-64 bg-black rounded-lg"
            />
            {onClose && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2"
                onClick={onClose}
              >
                Close
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {devices.length > 1 && (
              <div className="space-y-2">
                <Label htmlFor="camera">Select Camera</Label>
                <select
                  id="camera"
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
              </div>
            )}

            <div className="flex flex-col space-y-4">
              <div className="flex justify-center space-x-2">
                {!isScanning ? (
                  <Button onClick={startScanning} className="w-full">
                    Start Camera
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={stopScanning} className="w-full">
                    Stop Camera
                  </Button>
                )}
              </div>

              {error && (
                <p className="text-red-500 text-center text-sm">{error}</p>
              )}

              <p className="text-center text-sm text-muted-foreground">
                Or manually enter the barcode:
              </p>

              <form onSubmit={handleManualSubmit} className="space-y-2">
                <Input
                  placeholder="Enter barcode number"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                />
                <Button type="submit" variant="outline" className="w-full">
                  Submit Barcode
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}