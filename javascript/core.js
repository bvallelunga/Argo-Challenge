/* Vending Machine Class */
var VendingMachine = function(container, selector) {
  this.$filler = $("<div class='filler'></div>")
  this.$container = $(container)
  this.container = container
  this.selector = selector
  this.rowSize = 150
  this.fillers = 30
  this._init()
}

VendingMachine.prototype._init = function() {
  this.snacks = this._buildSnackList([
    "cheetos", "cheetos_flaming", "cheetos_puffs",
    "dorritos", "dorritos_cool", "kitkat",
    "m&ms_almond", "m&ms_peaunt_butter",
    "m&ms_peaunt", "milkyway", "snickers"
  ])
  $("body").append(this.$filler)
}

VendingMachine.prototype.buildGrid = function() {
  var _this = this;
  this.$container.html("")
  this.$filler.html("")
  this._shuffleSnacks()

  this.snacks.forEach(function(snack) {
    _this.$container.append(snack.element)
  })

  for(var i = 0; i < this.fillers; i++) {
    this.$filler.append(this._buildSnack())
  }

  this.$container.mason({
    itemSelector: this.selector,
    ratio: 1.5,
    sizes: [
      [1, 1],
      [2, 1]
    ],
    filler: {
      itemSelector: '.filler'
    },
    randomFillers: true,
    layout: 'fluid',
    gutter: 5
  })
}

VendingMachine.prototype.fadeIn = function(counter) {
  this.$container.fadeIn(counter)
}

VendingMachine.prototype.start = function() {
  var _this = this
  var count = 0
  var index = 0
  var times = Math.floor((Math.random() * 15) + 5);
  var elements = this.snacks.map(function(snack) {
    return snack.element
  })

  var interval = setInterval(function() {
    if(count >= times) return clearInterval(interval)
    if(index >= elements.length) index = 0

    $(_this.selector).removeClass("activated")
    elements[index].addClass("activated")
    count++
    index++
  }, 180)
}

VendingMachine.prototype._buildSnack = function(snack) {
  var className = ""
  var element = $("<div/>")

  if(snack) {
    className += "snack active"

    element.css({
      "background-color": snack.color,
      "background-image": "url(" + snack.image + ")",
    })
  } else {
    className += "filler"
  }

  return $("<div/>").append(element).addClass(className)
}

VendingMachine.prototype._buildSnackList = function(list) {
  var snacks = []

  for(var index in list) {
    var name = list[index]
    var snack = {
      name: name.replace(/_/g, " "),
      image: "./images/" + name + ".png",
      available: Math.floor((Math.random() * 15) + 1),
      color: this._randomColor()
    }

    snack.element = this._buildSnack(snack)
    snacks.push(snack)
  }

  return snacks
}

VendingMachine.prototype._randomColor = function() {
  var random = Math.floor(Math.random() * 360)
  return "hsla(" + random + ", 76%, 52%, 0.8)"
}

VendingMachine.prototype._shuffleSnacks = function() {
  var currentIndex = this.snacks.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = this.snacks[currentIndex];
    this.snacks[currentIndex] = this.snacks[randomIndex];
    this.snacks[randomIndex] = temporaryValue;
  }
}

/* Start The Vending Machine */
var machine = new VendingMachine(".snacks", ".snack")

$(function() {
  machine.buildGrid()

  setTimeout(function() {
    machine.fadeIn(500)

    setTimeout(function() {
      machine.start()
    }, 500)
  }, 1000)
})

$(window).resize(function() {
  machine.buildGrid()
})
