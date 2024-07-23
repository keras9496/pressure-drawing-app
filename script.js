document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    const userName = document.getElementById('userName');
    const startButton = document.getElementById('startButton');
    const drawingArea = document.getElementById('drawingArea');
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const saveButton = document.getElementById('saveButton');

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let pressureSequence = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight * 0.8;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    startButton.addEventListener('click', () => {
        if (userName.value.trim() !== '') {
            userForm.style.display = 'none';
            drawingArea.style.display = 'block';
        } else {
            alert('이름을 입력해주세요.');
        }
    });

    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.touches[0].clientX - canvas.offsetLeft, e.touches[0].clientY - canvas.offsetTop];
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const pressure = touch.force || 0.5;
        const x = touch.clientX - canvas.offsetLeft;
        const y = touch.clientY - canvas.offsetTop;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(0, 0, 0, ${pressure})`;
        ctx.lineWidth = pressure * 10;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        [lastX, lastY] = [x, y];
        
        pressureSequence.push(pressure);
    }

    function stopDrawing() {
        isDrawing = false;
    }

    saveButton.addEventListener('click', () => {
        // 압력 값 시퀀스 저장
        const pressureData = {
            name: userName.value,
            pressures: pressureSequence
        };
        localStorage.setItem(userName.value + '_pressure', JSON.stringify(pressureData));

        // 그림 저장
        const imageData = canvas.toDataURL('image/png');
        localStorage.setItem(userName.value + '_image', imageData);

        alert('그림과 압력 데이터가 저장되었습니다.');
    });
});