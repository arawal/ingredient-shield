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
    async function initializeCamera() {
      try {
        // First check camera permission
        await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCamera(true);

        // Initialize the code reader
        codeReaderRef.current = new BrowserMultiFormatReader();

        // Get available cameras
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);

        // Select the back camera by default (usually the last device)
        if (videoDevices.length > 0) {
          const defaultDevice = videoDevices[videoDevices.length - 1].deviceId;
          setSelectedDevice(defaultDevice);
          
          // Automatically start scanning with the selected camera
          if (videoRef.current && codeReaderRef.current) {
            setIsScanning(true);
            await codeReaderRef.current.decodeFromVideoDevice(
              defaultDevice,
              videoRef.current,
              (result, err) => {
                if (result) {
                  onScan(result.getText());
                }
                if (err && !(err instanceof NotFoundException)) {
                  setError('Scanning error: ' + err.message);
                }
              }
            );
          }
        }
      } catch (err) {
        setError('Error accessing camera: ' + (err as Error).message);
        setHasCamera(false);
      }
    }

    initializeCamera();

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, [onScan]);

  const switchCamera = async (deviceId: string) => {
    try {
      if (codeReaderRef.current) {
        // Stop current scanning
        codeReaderRef.current.reset();
        setIsScanning(false);
        
        // Start scanning with new device
        if (videoRef.current) {
          setIsScanning(true);
          setError('');
          await codeReaderRef.current.decodeFromVideoDevice(
            deviceId,
            videoRef.current,
            (result, err) => {
              if (result) {
                onScan(result.getText());
              }
              if (err && !(err instanceof NotFoundException)) {
                setError('Scanning error: ' + err.message);
              }
            }
          );
        }
      }
      setSelectedDevice(deviceId);
    } catch (err) {
      setError('Failed to switch camera: ' + (err as Error).message);
      setIsScanning(false);
    }
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
                onClick={() => {
                  // Stop video tracks
                  if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
                    const tracks = videoRef.current.srcObject.getTracks();
                    tracks.forEach(track => track.stop());
                    videoRef.current.srcObject = null;
                  }
                  // Reset code reader
                  if (codeReaderRef.current) {
                    codeReaderRef.current.reset();
                    setIsScanning(false);
                  }
                  onClose?.();
                }}
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
              {error && (
                <div className="bg-destructive/10 p-4 rounded-lg">
                  <p className="text-destructive text-center text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-center text-sm text-muted-foreground">
                  {isScanning 
                    ? "Point your camera at a barcode to scan"
                    : "Initializing camera..."}
                </p>

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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}