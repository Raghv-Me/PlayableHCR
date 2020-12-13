class Car{
    constructor(world){
        this.y = canvas.height/2-20
        this.x =  canvas.width/5
        this.stx = this.x
        this.sty = this.y
        
        this.w = 60
        this.h = 17.5
        this.id = 'Car'
        this.world = world
        this.det = new Box(this.x,this.y-this.h/2-5,10,10,world,{type:"D"},
        
      
        {
            friction:0.9,
            density:0.01,
            restitution:0.3
        })
        this.det.id = 'Head';
        this.det.body.SetUserData(this.det)
        this.deadCount =  0
        this.det.dead =false
        let vectors = [ ]
        let cham = 7
        vectors.push(createVector(- (this.w/2 - cham),-this.h/2))
        vectors.push(createVector((this.w/2 - cham),- this.h/2))
        vectors.push(createVector(this.w/2,- (this.h/2 - cham)))
        vectors.push(createVector(this.w/2,(this.h/2 - cham)))
        vectors.push(createVector((this.w/2 -cham),this.h/2))
        vectors.push(createVector( - (this.w/2 - cham), this.h/2))
        vectors.push(createVector(-this.w/2, (this.h/2 - cham)))
        vectors.push(createVector(-this.w/2, - (this.h/2 - cham)))
        // console.log(vectors)
        // new Polygon(vectors,this.world,{type:"S"},{
        //     friction:0.9,
        //     density:1.5,
        //     restitution:0.3
        // },
        // this.x-20,this.y-30
        // )
        //  this.frame = new  Box(this.x,this.y,this.w,this.h,world,{type:"D"},

        this.speed = 13
        this.torquewheel = 1200
        this.torque = 2.15
      
        // {
        //     friction:0.9,
        //     density:1.5,
        //     restitution:0.3
        // })
        this.frame = new Polygon(vectors,this.world,{type:"D"},{
            friction:0.9,
            density:1.5,
            restitution:0.3
        },
        this.x,this.y
        )
        var filtData = new box2d.b2FilterData();
        // filtData.groupIndex = -2;
        filtData.categoryBits = carframeCat;
        filtData.maskBits = carMask;
        this.frame.body.GetFixtureList().SetFilterData(filtData)
        
        var weldJointDef = new box2d.b2WeldJointDef();
      weldJointDef.Initialize(this.det.body, this.frame.body, this.det.body.GetPosition());
      weldJointDef.referenceAngle = 0
      this.det.joint = this.world.CreateJoint(weldJointDef);
    //   console.log(this.det.joint)
        this.wheelRad = 10
        
        this.wh1 = this.createWheel(false)
        this.wh1.body.body.SetUserData(this.wh1)
        this.wh2 = this.createWheel(true)
        this.wh2.body.body.SetUserData(this.wh2)

        this.frame.body.SetUserData(this)
    }
    deadmeth(){
        dead()
    }
    createWheel(front){
        let mul = front?-1:1
        // console.log(mul*(this.w/2 + this.wheelRad+3))
        let wh1 = {
            x : (this.x  + mul*(-this.w/2 + this.wheelRad)),
            y : this.y + this.h/2+3 ,
            rad : this.wheelRad,
            id:'wheel',
            onGround : 0,

            fix : {
                friction : 1,
                restitution: 0.01,
                density:0.5
            },
            bodyop:{type:'D'}

        }

   
        wh1.body = new Ball(wh1.x,wh1.y,wh1.rad,world,wh1.bodyop,wh1.fix)
        var filtData = new box2d.b2FilterData();
        // filtData.groupIndex = -2;
        filtData.categoryBits = WheelCat;
        filtData.maskBits = wheelMask;
        wh1.body.body.GetFixtureList().SetFilterData(filtData)
        wh1.sup = undefined
        let body = new box2d.b2BodyDef()
        body.type = box2d.b2DynamicBody
        body.position.x = wh1.body.body.GetPosition().x
        body.position.y = wh1.body.body.GetPosition().y   

        body.angle = 0
        let fix = new box2d.b2FixtureDef()
        fix.density = 0.03
        fix.friction = 0.99
        fix.restitution = 0.02
        fix.shape = new box2d.b2CircleShape(wh1.rad/SCALE)
        wh1.sup = this.world.CreateBody(body)
        var filtData = new box2d.b2FilterData();
        filtData.groupIndex = -1;
        wh1.sup.CreateFixture(fix).SetFilterData(filtData);
        var revjointDef1 = new box2d.b2RevoluteJointDef()
        revjointDef1.Initialize(wh1.body.body,wh1.sup,wh1.body.body.GetPosition())
        // console.log(revjointDef)
        wh1.joint = this.world.CreateJoint(revjointDef1)
        var pris1 = new box2d.b2PrismaticJointDef()
        pris1.Initialize(wh1.sup,this.frame.body,wh1.body.body.GetPosition(),new box2d.Vec2(0,-1))
        pris1.lowerTranslation = -10
        wh1.pjoint = this.world.CreateJoint(pris1)

        var dist1 = new box2d.b2DistanceJointDef()
        var ancwheel = wh1.body.body.GetPosition()
        var anccar = new box2d.Vec2(ancwheel.x,ancwheel.y - (3*wh1.rad)/SCALE)
        dist1.Initialize(wh1.sup,this.frame.body,ancwheel,anccar)
        dist1.frequencyHz = 40
        // dist1.length = 2*wh1.rad/SCALE
        dist1.dampingRatio = 10
        wh1.djoint = this.world.CreateJoint(dist1)
        return wh1
    }
        show(x0,x1){
        if(!this.wh1.onGround && !this.wh2.onGround){
            // console.log('FLY')
        }
        this.frame.show(x0,x1)
        this.wh1.body.show(x0,x1)
        this.wh2.body.show(x0,x1)
        // this.wh1.sup.show(x0,x1)
        // this.wh2.sup.show(x0,x1)
        
        if (!this.det.dead) this.det.show(x0,x1)
        // console.log(this.det.dead)
        
    }
    update(){
        if (this.det.dead) this.deadCount++
        if (this.deadCount>100){ 
            this.destroyEverything()
            this.deadmeth()
        }
    }
    motorOn(dir){
        if (!this.det.dead
            ){
        this.wh1.joint.EnableMotor(true)
        this.wh2.joint.EnableMotor(true)
        // console.log(dir)
        // console.log(this.frame.body.GetLinearVelocity())
        if (dir == 1)
        {
            this.wh1.joint.SetMotorSpeed(- dir * PI*this.speed)
            this.wh1.joint.SetMaxMotorTorque(this.torquewheel )
            this.wh2.joint.SetMotorSpeed(- dir * PI*this.speed)
            this.wh2.joint.SetMaxMotorTorque(this.torquewheel - 200)
            this.applyTorque(dir)
        }
        else if (dir == -1)
        {
            this.wh1.joint.SetMotorSpeed(- dir * PI*this.speed)
            this.wh1.joint.SetMaxMotorTorque(this.torquewheel )
            this.wh2.joint.SetMotorSpeed(- dir * PI*this.speed)
            this.applyTorque(dir)
            this.wh2.joint.SetMaxMotorTorque(this.torquewheel - 200)
        }
    }
    }
    motorOff(){
        this.wh1.joint.EnableMotor(false)
        this.wh2.joint.EnableMotor(false)
    }
    destroyEverything(){
        this.frame.destroy()
        this.wh1.body.destroy()
        this.wh2.body.destroy()
        RemoveBody(this.world,this.wh1.sup)
        RemoveBody(this.world,this.wh2.sup)
        RemoveJoint(this.world,this.wh1.joint)
        RemoveJoint(this.world,this.wh1.pjoint)
        RemoveJoint(this.world,this.wh1.djoint) 
           RemoveJoint(this.world,this.wh2.joint)
        RemoveJoint(this.world,this.wh2.pjoint)
        RemoveJoint(this.world,this.wh2.djoint)
        // 
        // RemoveJoint(this.world, this.det.joint)
        // console.log(this.det.joint)
        this.det.destroy()
    }
    applyTorque(dir){
        this.frame.body.ApplyTorque(-dir*this.torque)
    }
}
