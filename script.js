const chars = "@#S%?*+;:,.";
        
        document.getElementById('imageInput').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        drawImageToAscii(img);
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        function drawImageToAscii(img) {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');

            const scaleFactor = 0.15;
            canvas.width = img.width * scaleFactor;
            canvas.height = img.height * scaleFactor;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let ascii = '';

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const index = (y * canvas.width + x) * 4;
                    const brightness = (imgData.data[index] + imgData.data[index + 1] + imgData.data[index + 2]) / 3;
                    const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
                    ascii += chars[charIndex];
                }
                ascii += '\n';
            }

            document.getElementById('asciiOutput').textContent = ascii;
        }

        function updateColors() {
            const bgColor = document.getElementById('bgColor').value;
            document.getElementById('asciiContainer').style.backgroundColor = bgColor;

            let textColor = document.getElementById('textColor').value;
            if (!textColor) {
                textColor = getBrightness(bgColor) > 128 ? 'black' : 'white';
            }
            document.getElementById('asciiOutput').style.color = textColor;
        }

        function getBrightness(hex) {
            const r = parseInt(hex.substring(1, 3), 16);
            const g = parseInt(hex.substring(3, 5), 16);
            const b = parseInt(hex.substring(5, 7), 16);
            return (r * 0.299 + g * 0.587 + b * 0.114);
        }

        document.getElementById('bgColor').addEventListener('input', updateColors);
        document.getElementById('textColor').addEventListener('input', updateColors);

        function downloadAsciiImage() {
        const asciiText = document.getElementById('asciiOutput').textContent;
        const lines = asciiText.split('\n').filter(line => line.trim() !== ''); // Remove empty lines

        const fontSize = 10; // Adjusted font size
        const charWidth = 6; // Approximate character width
        const lineHeight = fontSize + 2; // Adjusted spacing

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas width & height dynamically
        const maxCharsPerLine = Math.max(...lines.map(line => line.length));
        canvas.width = maxCharsPerLine * charWidth;
        canvas.height = lines.length * lineHeight;

        // Background Color
        const bgColor = document.getElementById('bgColor').value;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Text Color
        let textColor = document.getElementById('textColor').value;
        if (!textColor) {
            textColor = getBrightness(bgColor) > 128 ? "black" : "white";
        }
        ctx.fillStyle = textColor;
        ctx.font = `${fontSize}px monospace`;

        // Draw ASCII text without gaps
        lines.forEach((line, index) => {
            ctx.fillText(line, 0, (index + 1) * lineHeight);
        });

        // Download the image
        const link = document.createElement('a');
        link.download = 'ascii_image.png';
        link.href = canvas.toDataURL();
        link.click();
    }
    
    window.addEventListener('load', function () {
        setTimeout(function () {
            const loadingScreen = document.getElementById('loading-screen');
            const mainContent = document.getElementById('main-content');
        
            loadingScreen.style.display = 'none';
            mainContent.style.display = 'block';
        }, 5000); // 5 seconds
        });
                
    document.getElementById("year").textContent = new Date().getFullYear();
