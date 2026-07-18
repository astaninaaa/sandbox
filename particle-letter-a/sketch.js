let img;
let particles = [];
let targets = [];
let isMobile = false;

// ТВОИ ЦВЕТА
let bgColor = [255, 255, 255]; // Белый фон
let particleColor = [20, 0, 110]; // Темно-синий

function preload() {
    img = loadImage('A.png', 
    () => { console.log('Картинка загружена'); },
    () => { console.error('Ошибка загрузки A.png! Проверь название файла.'); }
  );
}

function setup() {
    // Добавляем pixelDensity(1) для старых телефонов (не повредит)
    pixelDensity(1);
    createCanvas(windowWidth, windowHeight);

    if (!img || img.width === 0) {
        textAlign(CENTER, CENTER);
        textSize(20);
        fill(200, 0, 0);
        text("ОШИБКА: Файл A.png не найден!", width/2, height/2);
        return;
    }
    
    let pg = createGraphics(width, height);
    pg.background(0, 0, 0, 0);
    
    // Буква 50% от экрана
    let scaleX = (width * 0.5) / img.width;
    let scaleY = (height * 0.5) / img.height;
    let scaleFactor = min(scaleX, scaleY);
    
    let w = img.width * scaleFactor;
    let h = img.height * scaleFactor;
    
    let offsetX = (width - w) / 2;
    let offsetY = (height - h) / 2;
    pg.image(img, offsetX, offsetY, w, h);
    pg.loadPixels();

    for (let y = 0; y < pg.height; y++) {
        for (let x = 0; x < pg.width; x++) {
            let index = (x + y * pg.width) * 4;
            let alpha = pg.pixels[index + 3];
            if (alpha > 100) { 
                targets.push({x: x, y: y});
            }
        }
    }

    // ЦЕНТР
    let centerX = width / 2;
    let centerY = height / 2;

    isMobile = windowWidth < 768;
    let particleCount = isMobile ? 1000 : 4000;

    let spreadX = isMobile ? 40 : 80;
    let spreadY = isMobile ? 30 : 60;
    let sizeMin = isMobile ? 2.3 : 1.1;
    let sizeMax = isMobile ? 3 : 2;

    // Только один цикл создания частиц
    for (let i = 0; i < particleCount; i++) {
        let randomTarget = random(targets);
        particles.push({
            x: centerX + randomGaussian(0, spreadX),
            y: centerY + randomGaussian(0, spreadY),
            targetX: randomTarget.x,
            targetY: randomTarget.y,
            delay: random(5, 100),
            sizeW: random(sizeMin, sizeMax),
            sizeH: random(1, 2.2),
            rot: random(TWO_PI)
        });
    }
}

function draw() {
    background(bgColor[0], bgColor[1], bgColor[2]);

    if (targets.length === 0) return;

    for (let p of particles) {
        if (frameCount > p.delay) {
            p.x += (p.targetX - p.x) * 0.4;
            p.y += (p.targetY - p.y) * 0.4;
        }

        // Отталкивание от мыши
        let d = dist(mouseX, mouseY, p.x, p.y);
        if (d < 150) {
            let angle = atan2(p.y - mouseY, p.x - mouseX);
            let force = map(d, 0, 150, 10, 0);
            p.x += cos(angle) * force;
            p.y += sin(angle) * force;
        }

        // Рисуем эллипсы. На телефоне убираем вращение (чтобы не тормозить)
        if (isMobile) {
            // Облегченная версия для телефона
            fill(particleColor[0], particleColor[1], particleColor[2]);
            noStroke();
            ellipse(p.x, p.y, p.sizeW, p.sizeH); 
        } else {
            push();
            translate(p.x, p.y);
            rotate(p.rot);
            fill(particleColor[0], particleColor[1], particleColor[2]);
            noStroke();
            ellipse(0, 0, p.sizeW, p.sizeH);
            pop();
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}