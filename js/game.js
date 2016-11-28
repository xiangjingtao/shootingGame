//随机函数
function randFn(min,max){
	return parseInt(Math.random()*(max-min+1)+min);
}
//敌军颜色的种类
var arrEnemyColor=["white","red","pink","yellow","green","darkorange","lightskyblue"];
//创建画笔
var myCanvas=document.getElementById("myCanvas");
var pen=myCanvas.getContext("2d");
//子弹类
function Bullet(x){
	this.r=5;
	this.c="blue";
	this.x=x+15;
	this.y=465;
	this.speed=10;
}
Bullet.prototype.draw=function(){
	pen.beginPath();
	pen.fillStyle=this.c;
	pen.arc(this.x,this.y,this.r,0,Math.PI*2,true);
	pen.fill();
	pen.closePath();
};
Bullet.prototype.run=function(){
	this.y-=this.speed;
};
//敌军类
function Enemy(){
	var width=randFn(10,60);
	this.w=width;
	this.c=arrEnemyColor[randFn(0,6)];
	this.x=randFn(0,500-width);
	this.y=0;
	this.speedX=randFn(-8,8);
	this.speedY=randFn(1,10);
	this.fre=randFn(10,60);
	this.count=0;
}
Enemy.prototype.draw=function(){
	pen.beginPath();
	pen.fillStyle=this.c;
	pen.fillRect(this.x,this.y,this.w,this.w);
	pen.fill();
	pen.closePath();
};
Enemy.prototype.run=function(){
	this.x+=this.speedX;
	this.y+=this.speedY;
};
//主机类
function Mine(){
	this.w=30;
	this.c="yellow";
	this.x=235;
	this.y=470;
}
Mine.prototype.draw=function(){
	pen.beginPath();
	pen.fillStyle=this.c;
	pen.fillRect(this.x,this.y,this.w,this.w);
	pen.fill();
	pen.closePath();
};
//主机的实例
var mine=new Mine();
mine.draw();
//主机的移动
document.onmousemove=function(e){
	var ev=e||event;
	var ex=ev.clientX;
	if(ex<=315){
		ex=315;
	}
	if(ex>=785){
		ex=785;
	}
	pen.clearRect(mine.x,mine.y,mine.w,mine.w);
	mine.x=ex-315;
	mine.draw();
};
//子弹实例的数组
var arrAllBullet=[];
//敌军实例的数组
var arrAllEnemy=[];
//发射子弹
document.onclick=function(){
	var bullet=new Bullet(mine.x);
	arrAllBullet.push(bullet);
};
function bulletAnimation(){
	for(var i=0;i<arrAllBullet.length;i++){
		pen.clearRect(arrAllBullet[i].x-5,arrAllBullet[i].y-5,10,10);
		arrAllBullet[i].run();
		arrAllBullet[i].draw();		
	}
}
function createEnemy(){
	var enemy=new Enemy();
	arrAllEnemy.push(enemy);
}
function enemyAnimation(){
	for(var i=0;i<arrAllEnemy.length;i++){
		pen.clearRect(arrAllEnemy[i].x,arrAllEnemy[i].y,arrAllEnemy[i].w,arrAllEnemy[i].w);
		arrAllEnemy[i].run();
		arrAllEnemy[i].draw();
		arrAllEnemy[i].count++;
		if(arrAllEnemy[i].count==arrAllEnemy[i].fre||arrAllEnemy[i].x>=500-arrAllEnemy[i].w||arrAllEnemy[i].x<=0){
			arrAllEnemy[i].speedX*=-1;
			arrAllEnemy[i].count=0;
		}
	}
}
var tag=false;
var num=0;
var bloodNum=3;
function hit(){
	for(var j=0;j<arrAllEnemy.length;j++){
		for(var i=0;i<arrAllBullet.length;i++){
			if(!(arrAllBullet[i].y-5>=arrAllEnemy[j].y+arrAllEnemy[j].w-2||arrAllBullet[i].y-5<arrAllEnemy[j].y+arrAllEnemy[j].w-20||arrAllBullet[i].x+5<arrAllEnemy[j].x||arrAllBullet[i].x-5>arrAllEnemy[j].x+arrAllEnemy[j].w)){
				pen.clearRect(arrAllEnemy[j].x,arrAllEnemy[j].y,arrAllEnemy[j].w,arrAllEnemy[j].w);
				pen.clearRect(arrAllBullet[i].x-5,arrAllBullet[i].y-5,10,10);
				arrAllEnemy.splice(j,1);
				arrAllBullet.splice(i,1);
				num++;
				tag=true;
				break;
			}else if(arrAllBullet[i].y<=0){
				arrAllBullet.splice(i,1);
				tag=true;
				break;
			}
		}
		if(tag){
			tag=false;
			break;
		}
		if(arrAllEnemy[j].y>=470-arrAllEnemy[j].w){
			pen.clearRect(arrAllEnemy[j].x,arrAllEnemy[j].y,arrAllEnemy[j].w,arrAllEnemy[j].w);
			arrAllEnemy.splice(j,1);
			bloodNum--;
			break;
		}
	}
	requestAnimationFrame(hit);
}
var timeBullet=setInterval(bulletAnimation,100);
var timeCreateEnemy=setInterval(createEnemy,2000);
var timeEnemy=setInterval(enemyAnimation,50);
hit();