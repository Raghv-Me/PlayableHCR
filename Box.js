 var box2d = {
     Vec2  : Box2D.Common.Math.b2Vec2,
 b2BodyDef  : Box2D.Dynamics.b2BodyDef,
 b2Body  : Box2D.Dynamics.b2Body,
 b2FixtureDef  : Box2D.Dynamics.b2FixtureDef,
 b2Fixture  : Box2D.Dynamics.b2Fixture,
 b2World  : Box2D.Dynamics.b2World,
 b2MassData  : Box2D.Collision.Shapes.b2MassData,
 b2PolygonShape  : Box2D.Collision.Shapes.b2PolygonShape,
 b2CircleShape  : Box2D.Collision.Shapes.b2CircleShape,
 b2EdgeChainDef  : Box2D.Collision.Shapes.b2EdgeChainDef,

 b2DebugDraw  : Box2D.Dynamics.b2DebugDraw,
 b2StaticBody  : Box2D.Dynamics.b2Body.b2_staticBody,
 b2DynamicBody  : Box2D.Dynamics.b2Body.b2_dynamicBody,
 b2RevoluteJoint  : Box2D.Dynamics.Joints.b2RevoluteJoint,
 b2RevoluteJointDef  : Box2D.Dynamics.Joints.b2RevoluteJointDef,

 b2PrismaticJoint  : Box2D.Dynamics.Joints.b2PrismaticJoint,

 b2PrismaticJointDef  : Box2D.Dynamics.Joints.b2PrismaticJointDef,

 b2FilterData  : Box2D.Dynamics.b2FilterData,

 b2DistanceJoint  : Box2D.Dynamics.Joints.b2DistanceJoint,
 b2DistanceJointDef  : Box2D.Dynamics.Joints.b2DistanceJointDef,

 b2WeldJoint  : Box2D.Dynamics.Joints.b2WeldJoint,
 b2WeldJointDef  : Box2D.Dynamics.Joints.b2WeldJointDef,
 b2ContactListener : Box2D.Dynamics.b2ContactListener
}
const SCALE =  30
function BWtoP(val){
    return val*SCALE
}
function PtoBW(val){ return val/SCALE}
function SetupWorld(vector,sleep = true){
    var vec =new  box2d.Vec2(vector.x/1,vector.y/1)
    let world = new box2d.b2World(vec,sleep)
    return world
}
function Debugdraw(world,can){
    let  debugDraw = new box2d.b2DebugDraw();
    // console.log(debugDraw)
    debugDraw.SetSprite(can.canvas.getContext('2d'))
    debugDraw.SetDrawScale(SCALE)
    debugDraw.SetFillAlpha(2)
    debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw)
    return debugDraw
}
function AddBody(world,bodydef){
    return world.CreateBody(bodydef)
}
function RemoveBody(world,body){
    world.DestroyBody(body)
}
function RemoveJoint(world,body){
    world.DestroyJoint(body)
}
class Box{
    constructor(cx,cy,w,h,world,BodyOptions = {type:'D'},fixOptions){
        this.fix = new box2d.b2FixtureDef()
        if (!fixOptions){
            fixOptions = {
                density : 1,
                friction : 0.3,
                restitution: 0.5,

            }

        }
        this.fix.density = fixOptions.density
        this.fix.friction = fixOptions.friction
        this.fix.restitution = fixOptions.restitution
        this.fix.shape = new box2d.b2PolygonShape()
        this.fix.shape.SetAsBox(PtoBW(w/2),PtoBW(h/2))
        if (!BodyOptions){
            BodyOptions = {
                density : 1,
                friction : 0.3,
                restitution: 0.5
            }

        }
        this.bodydef = new box2d.b2BodyDef()
        this.bodydef.type = BodyOptions.type == 'D'? box2d.b2Body.b2_dynamicBody :box2d.b2Body.b2_staticBody
        this.bodydef.position.x = PtoBW(cx)
        this.bodydef.position.y = PtoBW(cy)
        this.world = world
        this.body = AddBody(world,this.bodydef)
        this.body.CreateFixture(this.fix)
        this.w =  w
        this.h = h
    }
    getPos(){
        var tmp = this.body.GetPosition()
        return createVector(BWtoP(tmp.x),BWtoP(tmp.y))
    }
    getAngle(){
        return this.body.GetAngle()
    }
    destroy(){
        RemoveBody(this.world,this.body)
    }
    show(x0,x1){
        let pos = this.getPos()
        if (!(pos.x+this.w<x0 || pos.x-this.w>x1)){
        let angle = this.getAngle()
        push()
        fill(51)
        stroke(220)
        rectMode(CENTER)
        translate(pos.x,pos.y)
        rotate(this.getAngle())

        rect(0,0,this.w,this.h)
        pop()
        }

    }
}
class Ball{
    constructor(cx,cy,rad,world,BodyOptions = {type:'D'},fixOptions){
        this.fix = new box2d.b2FixtureDef()
        if (!fixOptions){
            fixOptions = {
                density : random(1,10),
                friction : 0.3,
                restitution: 0.5,

            }

        }
        this.fix.density = fixOptions.density
        this.fix.friction = fixOptions.friction
        this.fix.restitution = fixOptions.restitution
        this.fix.shape = new box2d.b2CircleShape(rad/SCALE)
        if (!BodyOptions){
            BodyOptions = {
                density : 1,
                friction : 0.3,
                restitution: 0.5
            }

        }
        this.bodydef = new box2d.b2BodyDef()
        this.bodydef.type = BodyOptions.type == 'D'? box2d.b2Body.b2_dynamicBody :box2d.b2Body.b2_staticBody
        this.bodydef.position.x = PtoBW(cx)
        this.bodydef.position.y = PtoBW(cy)
        this.world = world
        this.body = AddBody(world,this.bodydef)
        this.body.CreateFixture(this.fix)
        this.rad = rad
      
    }
    getPos(){
        var tmp = this.body.GetPosition()
        return createVector(BWtoP(tmp.x),BWtoP(tmp.y))
    }
    getAngle(){
        return this.body.GetAngle()
    }
    destroy(){
        RemoveBody(this.world,this.body)
    }
    show(x0,x1){
        let pos = this.getPos()
        if (!(pos.x + this.rad*2<x0 || pos.x - this.rad*2 >x1))
        {
        let angle = this.getAngle()
        push()
        stroke(0)
        fill(255,0,0)
        translate(pos.x,pos.y)
        rotate(this.getAngle())
        circle(0,0,this.rad*2)
        line(0,0,0,this.rad)

        pop()
        }
    }
}
class Polygon{
    constructor(vert,world,BodyOptions = {type:'D'},fixOptions,x,y){
        this.fix = new box2d.b2FixtureDef()
        if (!fixOptions){
            fixOptions = {
                density : 1,
                friction : 0.3,
                restitution: 0.5,

            }

        }
        this.fix.density = fixOptions.density
        this.fix.friction = fixOptions.friction
        this.fix.restitution = fixOptions.restitution
        this.fix.shape = new box2d.b2PolygonShape()
        // this.fix.shape.vertexCount = vert.length
        let tmp = []
        
        for (let i = 0;i<vert.length;i++){
            tmp[i] =  new box2d.Vec2(vert[i].x/SCALE,vert[i].y/SCALE)
        }
        this.fix.shape.SetAsArray(tmp,vert.length)
        if (!BodyOptions){
            BodyOptions = {
                density : 1,
                friction : 0.3,
                restitution: 0.5
            }

        }
        this.bodydef = new box2d.b2BodyDef()
        this.bodydef.type = BodyOptions.type == 'D'? box2d.b2Body.b2_dynamicBody :box2d.b2Body.b2_staticBody
        if (x && y){
            this.bodydef.position.x = x/SCALE
            this.bodydef.position.y = y/SCALE
            this.x = x;this.y = y
        }
        this.world = world
        this.body = AddBody(world,this.bodydef)
        this.body.CreateFixture(this.fix)
      
    
    }
    destroy(){
        RemoveBody(this.world,this.body)
    }
    getPos(){
        var tmp = this.body.GetPosition()
        return createVector(BWtoP(tmp.x),BWtoP(tmp.y))
    }
    getAngle(){
        return this.body.GetAngle()
    }
    show(x0,x1){
        let tver = this.body.m_fixtureList.m_shape.m_vertices,ver=[]
        for (let i of tver){
            ver.push(createVector(i.x*SCALE,i.y*SCALE))
        }
        if (!this.x && !this.y){
        
        let x = this.body.GetFixtureList().GetShape().GetVertices()[3].x*SCALE
        let wid = this.body.GetFixtureList().GetShape().GetVertices()[2].x*SCALE - x
        let cx = x+ wid/2
        if (!(cx+wid<x0||cx-wid>x1)){
        // console.log(ver)
        push()
        stroke(0)
        noStroke()
        fill(0)
        beginShape()
        for(let i of ver){
            vertex(i.x,i.y)
        }
        endShape(CLOSE)
        pop()
    }
    }
    else{
        let xcent = this.getPos()
        push()
        translate(xcent.x,xcent.y)

        stroke(0)
        rotate(this.getAngle())
        noStroke()
        fill(0)
        beginShape()
        for(let i of ver){
            vertex(i.x,i.y)
        }
        endShape(CLOSE)
        pop()
    }
}

}