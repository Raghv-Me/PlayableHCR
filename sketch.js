
let deaths = 0,score = 0,scale
let sc = screen.width/640
document.body.style.zoom = (((sc-1)*100).toString()+'%');

let ke = 0
function draw(){
    // console.log(key)
    let switc = false
    let minn = -5
    let maxx = canvas.width
    world.Step(1/50,10,10)
    world.ClearForces();
    if(switc){
    world.DrawDebugData()
    }
    if (!switc){
        translate(-cam.getX(),0)
        // scale(1.5,1.5)
        let range = cam.giveRange(minn,maxx)
    canvas.background(255,255)
    // ground.show()
    car.show(...range)
    // wal1.show()
    ground.forEach(item=>{
        item.show(...range)
    })
    obj.forEach(item=>{
        item.show(...range)
    })
    }
    if (car) car.update()
    if (key == '' && !mouseIsPressed) ke = 0
    if (ke == 0)
      car.motorOff()
    else if (ke == 1)
        car.motorOn(1)
    else if (ke == -1)
        car.motorOn(-1)
    // console.log(key)
    // if (random()>0.2)  if (random()>0.2) car.motorOn(1); else car.motorOn(-1);else  car.motorOff()
    device = getDeviceType()
    score = max(score,(car.frame.getPos().x - car.stx)/5)
    tex.html('Deaths: '+deaths+'<br/>'+'Max Score: '+floor(score)+'<br/>Current Score: '+(floor((car.frame.getPos().x - car.stx+1)/5)<0?0:floor((car.frame.getPos().x - car.stx+1)/5))+ '<br/>' +'Device Type: ' + device[0].toUpperCase()+device.slice(1,device.length))
}

let canvas
let world
let carframeCat = 0X0001
let WheelCat = 0X0002,groundCat = 0X0004
let wheelMask = (groundCat),carMask = (groundCat),groundMask = (carframeCat|WheelCat)
let ground = [],flor =[]
let obj = []
let car,cam,wal1
let size = 30
let listener 

let device
const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    }
    if (
      /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return "mobile";
    }
    return "desktop";
  };
 
  function setup(){
    
    canvas = createCanvas(640,360)
    scale = 1280/canvas.width
     device = getDeviceType()

    listener = new box2d.b2ContactListener;
    world = SetupWorld(createVector(0,10),true)
    listener.BeginContact = function(contact){
        if (contact.GetFixtureA().GetBody().GetUserData()== null || contact.GetFixtureB().GetBody().GetUserData() == null) {
            return;
          }
        if (contact.GetFixtureA().GetBody().GetUserData().id == 'Head'){
            if (contact.GetFixtureB().GetBody().GetUserData().id == 'Ground'){
            // console.log('Head')
            contact.GetFixtureA().GetBody().GetUserData().dead = true
            if (contact.GetFixtureA().GetBody().GetUserData().joint!=undefined){
            world.DestroyJoint(contact.GetFixtureA().GetBody().GetUserData().joint)}
            contact.GetFixtureA().GetBody().GetUserData().joint = undefined
            }
        }
        else if (contact.GetFixtureA().GetBody().GetUserData().id == 'Ground'){
            if (contact.GetFixtureB().GetBody().GetUserData().id == 'Head'){
            // console.log('Head')
            contact.GetFixtureB().GetBody().GetUserData().dead = true
            if (contact.GetFixtureB().GetBody().GetUserData().joint!=undefined){
            world.DestroyJoint(contact.GetFixtureB().GetBody().GetUserData().joint)}
            contact.GetFixtureB().GetBody().GetUserData().joint = undefined
            }
        }
        if (contact.GetFixtureA().GetBody().GetUserData().id == 'wheel'){
            if (contact.GetFixtureB().GetBody().GetUserData().id == 'Ground'){
            contact.GetFixtureA().GetBody().GetUserData().onGround = 1
            // console.log('onGround')
            }
        }
        else if (contact.GetFixtureA().GetBody().GetUserData().id == 'Ground'){
            if (contact.GetFixtureB().GetBody().GetUserData().id == 'wheel'){
            contact.GetFixtureB().GetBody().GetUserData().onGround = 1
            // console.log('onGround')
            }
        }
    }
    listener.EndContact = function(contact){
        if (contact.GetFixtureA().GetBody().GetUserData()== null || contact.GetFixtureB().GetBody().GetUserData() == null) {
            return;
          }
        if (contact.GetFixtureA().GetBody().GetUserData().id == 'wheel'){
            if (contact.GetFixtureB().GetBody().GetUserData().id == 'Ground')
            contact.GetFixtureA().GetBody().GetUserData().onGround = 0
        }
        else if (contact.GetFixtureA().GetBody().GetUserData().id == 'Ground'){
            if (contact.GetFixtureB().GetBody().GetUserData().id == 'wheel')
            contact.GetFixtureB().GetBody().GetUserData().onGround = 0
        }
    }
    world.SetContactListener(listener)
    Debugdraw(world,canvas)
    tex = createDiv('')
    FormGround()
 new Box(-1,canvas.height/2,2,canvas.height,world,{type:''})
    new Box(canvas.width*size,canvas.height/2,2,canvas.height,world,{type:''})
    car = new Car(world)
    cam = new Camera(car)
}
function dead(){
    // FormGround()
    deaths++
    console.log('OOPS i died')
    ke = 0
    car = new Car(world)
    cam.so = car
    
}
// function mousePressed(){
//     if (obj.length<50){
//     let tmp = random([1])?new Ball(mouseX + cam.getX(),mouseY,random(10,15),world):new Box(mouseX,mouseY,random(50,70),random(50,70),world) 
//     obj.push(tmp)
//     }
// }
class Camera{
    constructor(source){
        this.so= source
        this.x = this.so.frame.getPos().x
    }
    lerp(){

        this.x = lerp(this.x, this.so.frame.getPos().x,0.33)
        return this.x
    }
    getX(){
        return  constrain(this.lerp() - this.so.stx,0,canvas.width*(size) - (canvas.width))
    }
    giveRange(minx,maxx){
        let x0 = minx + constrain(this.so.frame.getPos().x - this.so.stx,0,canvas.width*(size) - (canvas.width))
        let x1 = x0+maxx
        return [x0,x1]
    }
}
function FormGround(){
    '838,977,100'
    let seed =  (random()<0.4) ? 1000:ceil(random(1000))
    if (ground.length!=0){
        ground.forEach(item=>{
            item.destroy()
        })
    }
    ground = []

    flor = []
    console.log(seed)
    noiseSeed(seed)
    let y = map(noise(0),0,1,canvas.height - 200,canvas.height - 10)
    let division = 100
    for (let i = 0;i<division*size;i++){
        
        let tmp = []
        for (let j = 0;j<2;j++){
            let x = (i*canvas.width/division+j*(canvas.width/division)+2)*scale
            if (j==1) {
                // y += 0 &&  random(-15,15)
                let xx = map(x,0,canvas.width*size,0,6*size)/scale
                y = map(noise(xx),0,1,canvas.height - 200,canvas.height - 10)
            }
            y = constrain(y,canvas.height/2,canvas.height-5)
            tmp.push(createVector(x,y))
            flor.push(createVector(x,y))
            // tmp.push()
        };
        tmp.push(createVector((i+1)*canvas.width*scale/division +2,canvas.height))
        tmp.push(createVector((i)*canvas.width*scale/division,canvas.height))
        // console.log(tmp)
        let temp = new Polygon(tmp,world,{type:'S'},{
            friction:0.99,
            density:2,
            restitution:0.01
        })
        temp.id = 'Ground'
        var filtData = new box2d.b2FilterData();
        filtData.groupIndex = 8;
        filtData.categoryBits = groundCat;
        filtData.maskBits = groundMask;
        temp.body.GetFixtureList().SetFilterData(filtData)
        temp.body.SetUserData(temp)
        ground.push(temp)
    }
}
function keyPressed(){
    if (device == 'desktop')
    switch (key){
        case 'r':
            dead()
            
            break
        case 'ArrowRight':
            ke = 1
            break
        case 'ArrowLeft':
            ke = -1
    }

}
function keyReleased(){
    ke = 0
    key = ''

}
function mousePressed(){
    // console.log(device)
    
    if (mouseX<canvas.width/2) ke = -1
    else ke = 1
    
    // console.log(ke)

}
function mouseReleased(){
    ke = 0
    key = ''

}
