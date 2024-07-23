document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const pencilBtn = document.getElementById('pencilBtn');
    const eraserBtn = document.getElementById('eraserBtn');
    
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let isEraser = false;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getPosition(e);
    }
    
    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        
        const [x, y] = getPosition(e);
        const pressure = e.pressure || e.force || 0.5;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        
        if (isEraser) {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 20;
        } else {
            ctx.strokeStyle = `rgba(0, 0, 0, ${pressure})`;
            ctx.lineWidth = pressure * 20;
        }
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        
        [lastX, lastY] = [x, y];
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    function getPosition(e) {
        if (e.touches && e.touches[0]) {
            return [e.touches[0].clientX, e.touches[0].clientY];
        }
        return [e.clientX, e.clientY];
    }

    canvas.addEventListener('pointerdown', startDrawing);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', stopDrawing);
    canvas.addEventListener('pointerout', stopDrawing);

    pencilBtn.addEventListener('click', () => {
        isEraser = false;
    });

    eraserBtn.addEventListener('click', () => {
        isEraser = true;
    });
});