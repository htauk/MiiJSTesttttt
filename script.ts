import jsQR from 'jsqr';
import { Mii } from './MiiJS/mii';

document.getElementById('fileInput')!.addEventListener('change', handleFileSelect, false);

function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
            if (qrCode) {
                decodeMii(qrCode.data);
            } else {
                alert('No QR code found.');
            }
        };
        img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
}

function decodeMii(data: string) {
    try {
        const miiBuffer = Buffer.from(data, 'base64');
        const mii = new Mii(miiBuffer);

        // Render Mii Studio URL
        const url = mii.studioUrl({ width: 512, type: 'all_body' });
        const imgElement = document.getElementById('miiImage') as HTMLImageElement;
        imgElement.src = url;
        imgElement.style.display = 'block';
    } catch (error) {
        alert('Failed to decode Mii data: ' + error.message);
    }
}
