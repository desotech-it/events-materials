import React, { useEffect, useRef, useState } from 'react';

const DinoGame = ({ onGameOver, username }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const CONFIG = {
    canvasWidth: 800,
    canvasHeight: 250,
    dinoX: 50,
    dinoWidth: 44,
    dinoHeight: 48,
    dinoDuckHeight: 30,
    gravity: 0.8,
    jumpForce: -13,
    baseObstacleSpeed: 7,
    obstacleInterval: 1500, // Ms tra gli ostacoli
  };

  const gameState = useRef({
    dinoY: 0,
    dinoVelocityY: 0,
    isJumping: false,
    isDucking: false,
    obstacles: [],
    particles: [],
    gridOffset: 0,
    score: 0,
    lastObstacleTime: 0,
    speedMultiplier: 1,
    frameCount: 0,
    shakeTime: 0,
  });

  // Sound Synth
  const playSound = (freq, type, duration) => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        if (type === 'sawtooth') osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch(e) {}
  };

  const jump = () => {
    if (!gameState.current.isJumping && !gameState.current.isDucking && gameStarted && !isGameOver) {
      gameState.current.dinoVelocityY = CONFIG.jumpForce;
      gameState.current.isJumping = true;
      playSound(200, 'square', 0.1);
    } else if (!gameStarted) {
      setGameStarted(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        if (!gameState.current.isJumping) gameState.current.isDucking = true;
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        gameState.current.isDucking = false;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, isGameOver]);

  useEffect(() => {
    if (!gameStarted || isGameOver) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const createExplosion = (x, y) => {
      for (let i = 0; i < 30; i++) {
        gameState.current.particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 15,
          vy: (Math.random() - 0.5) * 15,
          life: 1.0,
          color: '#00ff41'
        });
      }
    };

    const drawDino = (x, y, frame, isDucking) => {
      const color = '#00ff41';
      ctx.fillStyle = color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      
      if (isDucking) {
        ctx.fillRect(x, y + 18, 55, 20); // Corpo
        ctx.fillRect(x + 45, y + 15, 15, 12); // Testa
        const leg = frame % 6 < 3 ? 0 : 5;
        ctx.fillRect(x + 10, y + 38, 8, 4);
        ctx.fillRect(x + 35, y + 38, 8, 4);
      } else {
        ctx.fillRect(x + 10, y, 24, 28); // Corpo
        ctx.fillRect(x + 24, y - 10, 22, 16); // Testa
        const leg = frame % 8 < 4 ? 0 : 5;
        ctx.fillRect(x + 12, y + 28 + (leg === 0 ? 4 : 0), 8, 10);
        ctx.fillRect(x + 26, y + 28 + (leg === 5 ? 4 : 0), 8, 10);
      }
      ctx.shadowBlur = 0;
    };

    const gameLoop = (timestamp) => {
      gameState.current.frameCount++;
      if (gameState.current.shakeTime > 0) gameState.current.shakeTime--;

      // Physics
      gameState.current.dinoVelocityY += CONFIG.gravity;
      gameState.current.dinoY += gameState.current.dinoVelocityY;
      const groundLineY = CONFIG.canvasHeight - 30;
      const currentDinoHeight = gameState.current.isDucking ? CONFIG.dinoDuckHeight : CONFIG.dinoHeight;
      const dinoGroundY = groundLineY - currentDinoHeight;
      
      if (gameState.current.dinoY > dinoGroundY) {
        gameState.current.dinoY = dinoGroundY;
        gameState.current.dinoVelocityY = 0;
        gameState.current.isJumping = false;
      }

      // Grid
      gameState.current.gridOffset = (gameState.current.gridOffset + CONFIG.baseObstacleSpeed * gameState.current.speedMultiplier) % 40;

      // Obstacle Spawn
      if (timestamp - gameState.current.lastObstacleTime > CONFIG.obstacleInterval / gameState.current.speedMultiplier) {
        const isBird = Math.random() > 0.7 && (gameState.current.score / 10) > 300;
        const h = isBird ? 20 : 35 + Math.random() * 25;
        const w = isBird ? 40 : 20 + Math.random() * 15;
        
        // Altezza uccelli: alta (duck), media (jump/duck), bassa (jump)
        let birdY = groundLineY - h; 
        if (isBird) {
            const rand = Math.random();
            if (rand > 0.6) birdY = groundLineY - 80; // Alto (abbassarsi)
            else if (rand > 0.3) birdY = groundLineY - 50; // Medio (abbassarsi o saltare)
            else birdY = groundLineY - 20; // Basso (saltare)
        }

        gameState.current.obstacles.push({
          x: CONFIG.canvasWidth,
          y: isBird ? birdY : groundLineY - h,
          width: w,
          height: h,
          type: isBird ? 'bird' : 'cactus'
        });
        gameState.current.lastObstacleTime = timestamp;
      }

      // Movement & Collision
      gameState.current.obstacles = gameState.current.obstacles.filter(obs => {
        obs.x -= CONFIG.baseObstacleSpeed * gameState.current.speedMultiplier;
        
        const dH = { 
            x: CONFIG.dinoX + 10, 
            y: gameState.current.dinoY + 5, 
            w: CONFIG.dinoWidth - 20, 
            h: currentDinoHeight - 10 
        };
        const oH = { x: obs.x + 5, y: obs.y + 5, w: obs.width - 10, h: obs.height - 10 };

        if (dH.x < oH.x + oH.w && dH.x + dH.w > oH.x && dH.y < oH.y + oH.h && dH.y + dH.h > oH.y) {
          setIsGameOver(true);
          gameState.current.shakeTime = 15;
          createExplosion(dH.x + 20, dH.y + 20);
          playSound(100, 'sawtooth', 0.4);
          onGameOver(gameState.current.score);
        }
        return obs.x > -100;
      });

      // Particles
      gameState.current.particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.02;
      });
      gameState.current.particles = gameState.current.particles.filter(p => p.life > 0);

      gameState.current.score += 1;
      setScore(Math.floor(gameState.current.score / 10));
      gameState.current.speedMultiplier = 1 + (gameState.current.score / 6000);

      // --- RENDER ---
      ctx.save();
      if (gameState.current.shakeTime > 0) {
        ctx.translate((Math.random()-0.5)*10, (Math.random()-0.5)*10);
      }

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);

      // Grid
      ctx.strokeStyle = '#003310';
      ctx.lineWidth = 1;
      for (let i = 0; i < CONFIG.canvasWidth + 100; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i - gameState.current.gridOffset, groundLineY);
        ctx.lineTo(i - gameState.current.gridOffset - 100, CONFIG.canvasHeight);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(0, groundLineY);
      ctx.lineTo(CONFIG.canvasWidth, groundLineY);
      ctx.stroke();

      // Particles
      gameState.current.particles.forEach(p => {
        ctx.fillStyle = `rgba(0, 255, 65, ${p.life})`;
        ctx.fillRect(p.x, p.y, 3, 3);
      });

      // Dino
      drawDino(CONFIG.dinoX, gameState.current.dinoY, gameState.current.frameCount, gameState.current.isDucking);

      // Obstacles
      gameState.current.obstacles.forEach(o => {
        ctx.fillStyle = o.type === 'bird' ? '#ff003c' : '#00ff41';
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;
        if (o.type === 'bird') {
            ctx.fillRect(o.x, o.y, o.width, o.height);
            const wingY = gameState.current.frameCount % 20 < 10 ? -8 : 8;
            ctx.fillRect(o.x + 10, o.y + wingY, 15, 5);
        } else {
            ctx.fillRect(o.x, o.y, o.width, o.height);
            ctx.fillRect(o.x - 5, o.y + 10, 5, 10);
            ctx.fillRect(o.x + o.width, o.y + 15, 5, 10);
        }
        ctx.shadowBlur = 0;
      });

      ctx.restore();
      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [gameStarted, isGameOver]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-[800px] aspect-[16/5] rounded-lg border-2 border-green-500/30 shadow-[0_0_50px_rgba(0,255,65,0.1)] overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          width={CONFIG.canvasWidth}
          height={CONFIG.canvasHeight}
          className="w-full h-full cursor-pointer"
          onClick={jump}
        />
        
        {!gameStarted && !isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer" onClick={jump}>
            <div className="border-2 border-green-500 p-4 animate-pulse">
                <p className="text-[10px] md:text-sm font-['Press_Start_2P'] text-green-500">INSERT COIN TO START</p>
            </div>
            <p className="text-[7px] text-gray-500 mt-6 font-['Press_Start_2P'] uppercase">Space: Jump | S / Down: Duck</p>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/40 backdrop-blur-md">
             <div className="text-3xl md:text-5xl font-['Press_Start_2P'] text-white mb-4 drop-shadow-[0_0_20px_rgba(255,0,0,1)]">TERMINATED</div>
             <div className="text-[10px] font-['Press_Start_2P'] text-red-200 mb-8 tracking-[0.4em]">ANALYZING TRACE...</div>
          </div>
        )}

        <div className="absolute top-4 right-6 text-2xl font-['Press_Start_2P'] text-green-900/50 pointer-events-none select-none">
          {score.toString().padStart(5, '0')}
        </div>
      </div>
    </div>
  );
};

export default DinoGame;
