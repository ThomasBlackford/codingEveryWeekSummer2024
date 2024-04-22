document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Mandelbrot set settings
    const maxIterations = 50;
    let escapeRadius = 0; // Initial escape radius
    const colorMultiplier = 10;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;

    function mandelbrot(x, y) {
        let real = x;
        let imag = y;
        for (let i = 0; i < maxIterations; i++) {
            const real2 = real * real;
            const imag2 = imag * imag;
            if (real2 + imag2 > escapeRadius * escapeRadius) {
                return i;
            }
            const twoRealImag = 2 * real * imag;
            real = real2 - imag2 + x;
            imag = twoRealImag + y;
        }
        return maxIterations;
    }

    function drawMandelbrot() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const index = (y * canvas.width + x) * 4;
                const xx = (x - canvas.width / 2 + translateX) / (canvas.width / 4);
                const yy = (y - canvas.height / 2 + translateY) / (canvas.height / 4);
                const iterations = mandelbrot(xx, yy);
                const color = iterations === maxIterations ? 0 : iterations * colorMultiplier;
                data[index] = color;
                data[index + 1] = color;
                data[index + 2] = color;
                data[index + 3] = 255;
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }

    function animate() {
        escapeRadius += 0.1; // Increase the escape radius for animation
        drawMandelbrot();
        requestAnimationFrame(animate);
    }

    animate();

    function handleMouseDown(event) {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
    }

    function handleMouseMove(event) {
        if (isDragging) {
            const deltaX = event.clientX - startX;
            const deltaY = event.clientY - startY;
            translateX += deltaX;
            translateY += deltaY;
            startX = event.clientX;
            startY = event.clientY;
            drawMandelbrot();
        }
    }

    function handleMouseUp() {
        isDragging = false;
    }

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseUp);

    function handleMouseWheel(event) {
        escapeRadius += Math.sign(event.deltaY) * 0.1; // Adjust escape radius based on scroll direction
        drawMandelbrot();
    }

    canvas.addEventListener('wheel', handleMouseWheel);
});
