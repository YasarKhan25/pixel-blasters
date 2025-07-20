import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Trophy } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface GameObject extends Position {
  id: string;
  width: number;
  height: number;
}

interface Bullet extends GameObject {
  velocity: number;
  damage: number;
}

interface Enemy extends GameObject {
  health: number;
  velocity: number;
  type: 'basic' | 'fast' | 'tank' | 'boss';
  points: number;
}

interface Particle extends Position {
  id: string;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
  color: string;
}

interface PowerUp extends GameObject {
  type: 'health' | 'damage' | 'speed' | 'multishot';
  duration: number;
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SPEED = 8;
const BULLET_SPEED = 12;

export function SpaceShooter() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [player, setPlayer] = useState<Position>({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 80 });
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });
  const [powerUpEffects, setPowerUpEffects] = useState<{
    damage: number;
    speed: number;
    multishot: boolean;
    multiShotTime: number;
  }>({
    damage: 1,
    speed: 1,
    multishot: false,
    multiShotTime: 0,
  });

  const gameLoopRef = useRef<number>();
  const lastShotRef = useRef(0);
  const enemySpawnRef = useRef(0);

  const createParticles = useCallback((x: number, y: number, count: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        velocity: {
          x: (Math.random() - 0.5) * 8,
          y: (Math.random() - 0.5) * 8,
        },
        life: 60,
        maxLife: 60,
        color,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  const spawnEnemy = useCallback(() => {
    const types: Enemy['type'][] = ['basic', 'fast', 'tank'];
    if (level >= 5) types.push('boss');
    
    const type = types[Math.floor(Math.random() * types.length)];
    let enemy: Enemy;

    switch (type) {
      case 'fast':
        enemy = {
          id: `enemy-${Date.now()}`,
          x: Math.random() * (GAME_WIDTH - 40),
          y: -50,
          width: 30,
          height: 30,
          health: 1,
          velocity: 4 + level * 0.5,
          type,
          points: 15,
        };
        break;
      case 'tank':
        enemy = {
          id: `enemy-${Date.now()}`,
          x: Math.random() * (GAME_WIDTH - 60),
          y: -50,
          width: 60,
          height: 40,
          health: 5,
          velocity: 1.5,
          type,
          points: 50,
        };
        break;
      case 'boss':
        enemy = {
          id: `enemy-${Date.now()}`,
          x: GAME_WIDTH / 2 - 50,
          y: -100,
          width: 100,
          height: 80,
          health: 20,
          velocity: 1,
          type,
          points: 200,
        };
        break;
      default: // basic
        enemy = {
          id: `enemy-${Date.now()}`,
          x: Math.random() * (GAME_WIDTH - 40),
          y: -50,
          width: 40,
          height: 40,
          health: 2,
          velocity: 2 + level * 0.3,
          type,
          points: 10,
        };
    }

    setEnemies(prev => [...prev, enemy]);
  }, [level]);

  const shoot = useCallback(() => {
    const now = Date.now();
    if (now - lastShotRef.current < (200 / powerUpEffects.speed)) return;

    lastShotRef.current = now;
    const newBullets: Bullet[] = [];

    if (powerUpEffects.multishot) {
      // Triple shot
      for (let i = -1; i <= 1; i++) {
        newBullets.push({
          id: `bullet-${now}-${i}`,
          x: player.x + 20 + i * 15,
          y: player.y,
          width: 4,
          height: 12,
          velocity: BULLET_SPEED,
          damage: powerUpEffects.damage,
        });
      }
    } else {
      newBullets.push({
        id: `bullet-${now}`,
        x: player.x + 20,
        y: player.y,
        width: 4,
        height: 12,
        velocity: BULLET_SPEED,
        damage: powerUpEffects.damage,
      });
    }

    setBullets(prev => [...prev, ...newBullets]);
  }, [player, powerUpEffects]);

  const checkCollision = useCallback((obj1: GameObject, obj2: GameObject): boolean => {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  }, []);

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    // Update player position
    setPlayer(prev => {
      let newX = prev.x;
      let newY = prev.y;

      if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        newX = Math.max(0, prev.x - PLAYER_SPEED * powerUpEffects.speed);
      }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        newX = Math.min(GAME_WIDTH - 40, prev.x + PLAYER_SPEED * powerUpEffects.speed);
      }
      if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        newY = Math.max(0, prev.y - PLAYER_SPEED * powerUpEffects.speed);
      }
      if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        newY = Math.min(GAME_HEIGHT - 40, prev.y + PLAYER_SPEED * powerUpEffects.speed);
      }

      return { x: newX, y: newY };
    });

    // Auto-shoot
    if (keys[' '] || keys['Space']) {
      shoot();
    }

    // Update bullets
    setBullets(prev => prev
      .map(bullet => ({ ...bullet, y: bullet.y - bullet.velocity }))
      .filter(bullet => bullet.y > -20)
    );

    // Update enemies
    setEnemies(prev => prev
      .map(enemy => ({ ...enemy, y: enemy.y + enemy.velocity }))
      .filter(enemy => enemy.y < GAME_HEIGHT + 50)
    );

    // Update particles
    setParticles(prev => prev
      .map(particle => ({
        ...particle,
        x: particle.x + particle.velocity.x,
        y: particle.y + particle.velocity.y,
        life: particle.life - 1,
      }))
      .filter(particle => particle.life > 0)
    );

    // Update power-ups
    setPowerUps(prev => prev
      .map(powerUp => ({ ...powerUp, y: powerUp.y + 2 }))
      .filter(powerUp => powerUp.y < GAME_HEIGHT + 50)
    );

    // Spawn enemies
    const now = Date.now();
    if (now - enemySpawnRef.current > Math.max(500, 2000 - level * 100)) {
      spawnEnemy();
      enemySpawnRef.current = now;
    }

    // Check collisions
    setBullets(prevBullets => {
      const remainingBullets = [...prevBullets];
      
      setEnemies(prevEnemies => {
        return prevEnemies.map(enemy => {
          const hitBulletIndex = remainingBullets.findIndex(bullet => 
            checkCollision(bullet, enemy)
          );
          
          if (hitBulletIndex !== -1) {
            const bullet = remainingBullets[hitBulletIndex];
            remainingBullets.splice(hitBulletIndex, 1);
            
            const newHealth = enemy.health - bullet.damage;
            if (newHealth <= 0) {
              createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 8, '#ff6b35');
              setScore(prev => prev + enemy.points);
              
              // Chance to drop power-up
              if (Math.random() < 0.1) {
                const powerUpTypes: PowerUp['type'][] = ['health', 'damage', 'speed', 'multishot'];
                const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
                setPowerUps(prev => [...prev, {
                  id: `powerup-${Date.now()}`,
                  x: enemy.x + enemy.width / 2 - 15,
                  y: enemy.y,
                  width: 30,
                  height: 30,
                  type,
                  duration: 10000,
                }]);
              }
              
              return null;
            }
            return { ...enemy, health: newHealth };
          }
          return enemy;
        }).filter(Boolean) as Enemy[];
      });
      
      return remainingBullets;
    });

    // Check player-enemy collisions
    setEnemies(prevEnemies => {
      const playerObj: GameObject = { ...player, id: 'player', width: 40, height: 40 };
      const hitEnemy = prevEnemies.find(enemy => checkCollision(playerObj, enemy));
      
      if (hitEnemy) {
        createParticles(player.x + 20, player.y + 20, 6, '#ff4757');
        setPlayerHealth(prev => {
          const newHealth = Math.max(0, prev - 20);
          if (newHealth <= 0) {
            setLives(prevLives => {
              const newLives = prevLives - 1;
              if (newLives <= 0) {
                setGameState('gameOver');
              } else {
                setPlayerHealth(100);
              }
              return newLives;
            });
          }
          return newHealth;
        });
        
        return prevEnemies.filter(enemy => enemy.id !== hitEnemy.id);
      }
      
      return prevEnemies;
    });

    // Check power-up collection
    setPowerUps(prevPowerUps => {
      const playerObj: GameObject = { ...player, id: 'player', width: 40, height: 40 };
      const collectedPowerUp = prevPowerUps.find(powerUp => checkCollision(playerObj, powerUp));
      
      if (collectedPowerUp) {
        createParticles(collectedPowerUp.x + 15, collectedPowerUp.y + 15, 5, '#2ed573');
        
        switch (collectedPowerUp.type) {
          case 'health':
            setPlayerHealth(prev => Math.min(100, prev + 30));
            break;
          case 'damage':
            setPowerUpEffects(prev => ({ ...prev, damage: prev.damage + 0.5 }));
            break;
          case 'speed':
            setPowerUpEffects(prev => ({ ...prev, speed: Math.min(2, prev.speed + 0.2) }));
            break;
          case 'multishot':
            setPowerUpEffects(prev => ({ 
              ...prev, 
              multishot: true, 
              multiShotTime: Date.now() + collectedPowerUp.duration 
            }));
            break;
        }
        
        return prevPowerUps.filter(powerUp => powerUp.id !== collectedPowerUp.id);
      }
      
      return prevPowerUps;
    });

    // Update power-up effects
    setPowerUpEffects(prev => {
      if (prev.multishot && Date.now() > prev.multiShotTime) {
        return { ...prev, multishot: false, multiShotTime: 0 };
      }
      return prev;
    });

    // Level progression
    if (score > level * 500) {
      setLevel(prev => prev + 1);
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, keys, player, shoot, spawnEnemy, checkCollision, createParticles, score, level, powerUpEffects]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = (e.target as HTMLElement)?.getBoundingClientRect();
      if (rect) {
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const handleClick = () => {
      if (gameState === 'playing') {
        shoot();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [gameState, shoot]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setLives(3);
    setPlayerHealth(100);
    setPlayer({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 80 });
    setBullets([]);
    setEnemies([]);
    setParticles([]);
    setPowerUps([]);
    setPowerUpEffects({ damage: 1, speed: 1, multishot: false, multiShotTime: 0 });
  };

  const pauseGame = () => {
    setGameState(gameState === 'paused' ? 'playing' : 'paused');
  };

  const resetGame = () => {
    setGameState('menu');
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-space flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center bg-card border-primary shadow-glow-primary">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                SPACE SHOOTER
              </h1>
              <p className="text-muted-foreground">
                Defend the galaxy from alien invasion!
              </p>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={startGame}
                size="lg"
                className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                START GAME
              </Button>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <p>🎮 Use WASD or Arrow Keys to move</p>
                <p>🔫 SPACE or Click to shoot</p>
                <p>💎 Collect power-ups for upgrades</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="min-h-screen bg-gradient-space flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center bg-card border-destructive shadow-glow-accent">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-destructive">GAME OVER</h1>
              <div className="space-y-1">
                <p className="text-xl font-semibold flex items-center justify-center gap-2">
                  <Trophy className="h-5 w-5 text-warning" />
                  Score: {score.toLocaleString()}
                </p>
                <p className="text-muted-foreground">Level Reached: {level}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={startGame}
                size="lg"
                className="w-full bg-gradient-primary hover:shadow-glow-primary"
              >
                <Play className="mr-2 h-5 w-5" />
                PLAY AGAIN
              </Button>
              <Button 
                onClick={resetGame}
                variant="outline"
                className="w-full"
              >
                MAIN MENU
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-space flex items-center justify-center p-4">
      <div className="relative">
        {/* Game UI */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-semibold">Score: {score.toLocaleString()}</span>
              <span>Level: {level}</span>
              <span>Lives: {'💛'.repeat(lives)}</span>
            </div>
            <div className="w-48">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs">Health</span>
                <span className="text-xs">{playerHealth}%</span>
              </div>
              <Progress value={playerHealth} className="h-2" />
            </div>
            {powerUpEffects.multishot && (
              <div className="text-xs text-secondary animate-pulse-glow">
                🔥 MULTISHOT ACTIVE
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={pauseGame}
              size="sm"
              variant="outline"
              className="shadow-glow-primary"
            >
              {gameState === 'paused' ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <Button
              onClick={resetGame}
              size="sm"
              variant="outline"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Game Area */}
        <div 
          className="relative bg-gradient-to-b from-background to-muted border-2 border-primary shadow-intense overflow-hidden"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Player */}
          <div
            className="absolute w-10 h-10 bg-gradient-primary rounded-lg shadow-glow-primary transition-all duration-75"
            style={{
              left: player.x,
              top: player.y,
              transform: 'rotate(-45deg)',
            }}
          >
            <div className="absolute inset-2 bg-primary-glow rounded-sm animate-pulse-glow" />
          </div>

          {/* Bullets */}
          {bullets.map(bullet => (
            <div
              key={bullet.id}
              className="absolute bg-gradient-to-t from-primary to-primary-glow rounded-full shadow-glow-primary"
              style={{
                left: bullet.x,
                top: bullet.y,
                width: bullet.width,
                height: bullet.height,
              }}
            />
          ))}

          {/* Enemies */}
          {enemies.map(enemy => (
            <div
              key={enemy.id}
              className={`absolute rounded-lg shadow-lg transition-all duration-100 ${
                enemy.type === 'basic' ? 'bg-enemy border-enemy-glow' :
                enemy.type === 'fast' ? 'bg-gradient-to-br from-enemy to-warning border-warning' :
                enemy.type === 'tank' ? 'bg-gradient-to-br from-muted to-enemy border-enemy-glow' :
                'bg-gradient-to-br from-enemy to-destructive border-destructive animate-pulse-glow'
              }`}
              style={{
                left: enemy.x,
                top: enemy.y,
                width: enemy.width,
                height: enemy.height,
              }}
            >
              {enemy.type === 'boss' && (
                <div className="absolute inset-1 bg-gradient-to-br from-destructive to-warning rounded opacity-60 animate-pulse-glow" />
              )}
            </div>
          ))}

          {/* Power-ups */}
          {powerUps.map(powerUp => (
            <div
              key={powerUp.id}
              className={`absolute rounded-full animate-pulse-glow shadow-glow-secondary ${
                powerUp.type === 'health' ? 'bg-health' :
                powerUp.type === 'damage' ? 'bg-destructive' :
                powerUp.type === 'speed' ? 'bg-warning' :
                'bg-secondary'
              }`}
              style={{
                left: powerUp.x,
                top: powerUp.y,
                width: powerUp.width,
                height: powerUp.height,
              }}
            >
              <div className="absolute inset-1 bg-gradient-to-br from-white to-transparent rounded-full opacity-50" />
            </div>
          ))}

          {/* Particles */}
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 rounded-full pointer-events-none"
              style={{
                left: particle.x,
                top: particle.y,
                backgroundColor: particle.color,
                opacity: particle.life / particle.maxLife,
              }}
            />
          ))}

          {/* Pause Overlay */}
          {gameState === 'paused' && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Card className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">PAUSED</h2>
                <Button onClick={pauseGame} className="bg-gradient-primary">
                  <Play className="mr-2 h-4 w-4" />
                  RESUME
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}