var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

var world;
var scale = 30; //30 pixels on our canvas correspond to 1 meter in the Box2d world
function init(){
  // Set up the Box2d world that will do most of the physics calculation
  var gravity = new b2Vec2(0,9.8); //declare gravity as 9.8 m/s^2 downward
  var allowSleep = true; //Allow objects that are at rest to fall asleep and be excluded from calculations
  world = new b2World(gravity,allowSleep);

  createFloor();
  // Create some bodies with simple shapes
  createRectangularBody();
  createCircularBody();
  createSimplePolygonBody();

  // Create a body combining two shapes
  createComplexBody();

  setupDebugDraw();
  animate();
}

var timeStep = 1/60;

// As per the Box2d manual, the suggested iteration count for Box2D is 8 for velocity and 3 for position
var velocityIterations = 8;
var positionIterations = 3;

function animate(){
  world.Step(timeStep, velocityIterations,positionIterations);
  world.ClearForces();

  world.DrawDebugData();

  setTimeout(animate, timeStep);
}

function createFloor(){
  // A body definition holds all the data needed to construct a rigid body.
  var bodyDef = new b2BodyDef;
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position.x = 640/2/scale;
  bodyDef.position.y = 450/scale;

  // A fixture is used to attach a shape to a body for collision detection
  // A fixture definition is used to create a fixture
  var fixtureDef = new b2FixtureDef;
  fixtureDef.density = 1.0;
  fixtureDef.friction = 0.5;
  fixtureDef.restitution = 0.2;

  fixtureDef.shape = new b2PolygonShape;
  fixtureDef.shape.SetAsBox(320/scale, 10/scale); // 640 pixels wide and 20 pixels tall

  var body = world.CreateBody(bodyDef);
  var fixture = body.CreateFixture(fixtureDef);
}

function createRectangularBody(){
  var bodyDef = new b2BodyDef;
  bodyDef.type = b2Body.b2_dynamicBody;
  bodyDef.position.x = 40/scale;
  bodyDef.position.y = 100/scale;

  var fixtureDef = new b2FixtureDef;
  fixtureDef.density = 1.0;
  fixtureDef.friction = 0.5;
  fixtureDef.restitution = 0.3;

  fixtureDef.shape = new b2PolygonShape;
  fixtureDef.shape.SetAsBox(30/scale,50/scale);

  var body = world.CreateBody(bodyDef);
  var fixture = body.CreateFixture(fixtureDef);
}

function createCircularBody(){
  var bodyDef = new b2BodyDef;
  bodyDef.type = b2Body.b2_dynamicBody;
  bodyDef.position.x = 130/scale;
  bodyDef.position.y = 100/scale;

  var fixtureDef = new b2FixtureDef;
  fixtureDef.density = 1.0;
  fixtureDef.friction = 0.5;
  fixtureDef.restitution = 0.7;

  fixtureDef.shape = new b2CircleShape(30/scale);

  var body = world.CreateBody(bodyDef);
  var fixture = body.CreateFixture(fixtureDef);
}

function createSimplePolygonBody(){
  var bodyDef = new b2BodyDef;
  bodyDef.type = b2Body.b2_dynamicBody;
  bodyDef.position.x = 230/scale;
  bodyDef.position.y = 50/scale;

  var fixtureDef = new b2FixtureDef;
  fixtureDef.density = 1.0;
  fixtureDef.friction = 0.5;
  fixtureDef.restitution = 0.2;

  fixtureDef.shape = new b2PolygonShape;
  // Create an array of b2Vec2 points in clockwise direction
  var points = [
    new b2Vec2(0,0),
    new b2Vec2(40/scale,50/scale),
    new b2Vec2(50/scale,100/scale),
    new b2Vec2(-50/scale,100/scale),
    new b2Vec2(-40/scale,50/scale),
  ];
  // Use SetAsArray to define the shape using the points array
  fixtureDef.shape.SetAsArray(points,points.length);

  var body = world.CreateBody(bodyDef);

  var fixture = body.CreateFixture(fixtureDef);
}

function createComplexBody(){
  var bodyDef = new b2BodyDef;
  bodyDef.type = b2Body.b2_dynamicBody;
  bodyDef.position.x = 350/scale;
  bodyDef.position.y = 50/scale;
  var body = world.CreateBody(bodyDef);

  // Create first fixture and attach a circular shape to the body
  var fixtureDef = new b2FixtureDef;
  fixtureDef.density = 1.0;
  fixtureDef.friction = 0.5;
  fixtureDef.restitution = 0.7;
  fixtureDef.shape = new b2CircleShape(40/scale);
  body.CreateFixture(fixtureDef);

  // Create second fixture and attach a polygon shape to the body
  fixtureDef.shape = new b2PolygonShape;
  var points = [
    new b2Vec2(0,0),
    new b2Vec2(40/scale,50/scale),
    new b2Vec2(50/scale,100/scale),
    new b2Vec2(-50/scale,100/scale),
    new b2Vec2(-40/scale,50/scale),
  ];
  fixtureDef.shape.SetAsArray(points,points.length);
  body.CreateFixture(fixtureDef);
}

var context;
function setupDebugDraw(){
  context = document.getElementById('canvas').getContext('2d');

  var debugDraw = new b2DebugDraw();

  // Use this canvas context for drawing the debugging screen
  debugDraw.SetSprite(context);
  // Set the scale
  debugDraw.SetDrawScale(scale);
  // Fill boxes with an alpha transparency of 0.3
  debugDraw.SetFillAlpha(0.3);
  // Draw lines with a thickness of 1
  debugDraw.SetLineThickness(1.0);
  // Display all shapes and joints
  debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

  // Start using debug draw in our world
  world.SetDebugDraw(debugDraw);
}